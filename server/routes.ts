import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAuth, requireRole, login, register, type AuthRequest } from "./auth";
import { insertBlogSchema, insertCommentSchema } from "@shared/schema";
import slugify from "slugify";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const upload = multer({
  storage: multer.diskStorage({
    destination: async (_req, _file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, name } = req.body;
      
      if (!username || !email || !password || !name) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const user = await register({ username, email, password, name });
      req.session.userId = user.id;
      
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await login(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  // Category routes
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json({ categories });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Blog routes
  app.get("/api/blogs", async (req, res) => {
    try {
      const { 
        status = "published", 
        authorId, 
        categoryId, 
        search, 
        limit = "10", 
        offset = "0" 
      } = req.query;

      const result = await storage.getBlogs({
        status: status as string,
        authorId: authorId as string,
        categoryId: categoryId as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const blog = await storage.getBlog(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json({ blog });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blogs/slug/:slug", async (req, res) => {
    try {
      const blog = await storage.getBlogBySlug(req.params.slug);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json({ blog });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/blogs", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertBlogSchema.parse(req.body);
      
      // Generate slug from title
      const slug = slugify(validatedData.title, { lower: true, strict: true });
      
      const blog = await storage.createBlog({
        ...validatedData,
        slug,
        authorId: req.user!.id,
        readTime: Math.ceil(validatedData.content.split(/\s+/).length / 200), // ~200 words per minute
      });

      res.json({ blog });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/blogs/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const blog = await storage.getBlog(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (blog.authorId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updateData: any = { ...req.body };
      
      if (updateData.title) {
        updateData.slug = slugify(updateData.title, { lower: true, strict: true });
      }

      if (updateData.content) {
        updateData.readTime = Math.ceil(updateData.content.split(/\s+/).length / 200);
      }

      const updated = await storage.updateBlog(req.params.id, updateData);
      res.json({ blog: updated });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/blogs/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const blog = await storage.getBlog(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (blog.authorId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      await storage.deleteBlog(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Comment routes
  app.get("/api/blogs/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getComments(req.params.id);
      res.json({ comments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/blogs/:id/comments", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        blogId: req.params.id,
        userId: req.user!.id,
      });

      const comment = await storage.createComment(validatedData);
      res.json({ comment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/comments/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      await storage.deleteComment(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Like routes
  app.get("/api/blogs/:id/likes", async (req, res) => {
    try {
      const count = await storage.getLikesCount(req.params.id);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blogs/:id/likes/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      const isLiked = await storage.isLiked(req.params.id, req.user!.id);
      res.json({ isLiked });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/blogs/:id/likes", requireAuth, async (req: AuthRequest, res) => {
    try {
      const like = await storage.addLike(req.params.id, req.user!.id);
      res.json({ like });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/blogs/:id/likes", requireAuth, async (req: AuthRequest, res) => {
    try {
      await storage.removeLike(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Upload routes
  app.post("/api/upload", requireAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  const httpServer = createServer(app);
  return httpServer;
}
