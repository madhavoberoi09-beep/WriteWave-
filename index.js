var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// server/db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogs: () => blogs,
  categories: () => categories,
  comments: () => comments,
  insertBlogSchema: () => insertBlogSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertCommentSchema: () => insertCommentSchema,
  insertLikeSchema: () => insertLikeSchema,
  insertUserSchema: () => insertUserSchema,
  likes: () => likes,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique()
});
var blogs = pgTable("blogs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  authorId: varchar("author_id").notNull().references(() => users.id),
  categoryId: varchar("category_id").references(() => categories.id),
  status: text("status").notNull().default("draft"),
  readTime: integer("read_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  publishedAt: timestamp("published_at")
});
var comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  blogId: varchar("blog_id").notNull().references(() => blogs.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  parentId: varchar("parent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blogId: varchar("blog_id").notNull().references(() => blogs.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});
var insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true
});
var insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true
});
var insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  createdAt: true
});

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}
var db = drizzle({
  connection: process.env.DATABASE_URL,
  ws,
  schema: schema_exports
});

// server/storage.ts
import { eq, desc, and, or, like, sql as sql2 } from "drizzle-orm";
import bcrypt from "bcrypt";
var DbStorage = class {
  // User operations
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }
  async createUser(insertUser) {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword
    }).returning();
    return result[0];
  }
  // Category operations
  async getCategories() {
    return await db.select().from(categories);
  }
  async getCategoryBySlug(slug) {
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0];
  }
  async createCategory(category) {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }
  // Blog operations
  async getBlog(id) {
    const result = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    return result[0];
  }
  async getBlogBySlug(slug) {
    const result = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
    return result[0];
  }
  async getBlogs(options = {}) {
    const { status = "published", authorId, categoryId, search, limit = 10, offset = 0 } = options;
    let conditions = [];
    if (status) {
      conditions.push(eq(blogs.status, status));
    }
    if (authorId) {
      conditions.push(eq(blogs.authorId, authorId));
    }
    if (categoryId) {
      conditions.push(eq(blogs.categoryId, categoryId));
    }
    if (search) {
      conditions.push(
        or(
          like(blogs.title, `%${search}%`),
          like(blogs.excerpt, `%${search}%`),
          like(blogs.content, `%${search}%`)
        )
      );
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : void 0;
    const [blogResults, countResult] = await Promise.all([
      db.select().from(blogs).where(whereClause).orderBy(desc(blogs.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql2`count(*)` }).from(blogs).where(whereClause)
    ]);
    return {
      blogs: blogResults,
      total: Number(countResult[0]?.count || 0)
    };
  }
  async createBlog(blog) {
    const result = await db.insert(blogs).values({
      ...blog,
      publishedAt: blog.status === "published" ? /* @__PURE__ */ new Date() : null
    }).returning();
    return result[0];
  }
  async updateBlog(id, blogUpdate) {
    const updateData = {
      ...blogUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (blogUpdate.status === "published") {
      const existingBlog = await this.getBlog(id);
      if (existingBlog && existingBlog.status !== "published") {
        updateData.publishedAt = /* @__PURE__ */ new Date();
      }
    }
    const result = await db.update(blogs).set(updateData).where(eq(blogs.id, id)).returning();
    return result[0];
  }
  async deleteBlog(id) {
    const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();
    return result.length > 0;
  }
  // Comment operations
  async getComments(blogId) {
    return await db.select().from(comments).where(eq(comments.blogId, blogId)).orderBy(desc(comments.createdAt));
  }
  async createComment(comment) {
    const result = await db.insert(comments).values(comment).returning();
    return result[0];
  }
  async deleteComment(id) {
    const result = await db.delete(comments).where(eq(comments.id, id)).returning();
    return result.length > 0;
  }
  // Like operations
  async getLikesCount(blogId) {
    const result = await db.select({ count: sql2`count(*)` }).from(likes).where(eq(likes.blogId, blogId));
    return Number(result[0]?.count || 0);
  }
  async isLiked(blogId, userId) {
    const result = await db.select().from(likes).where(and(eq(likes.blogId, blogId), eq(likes.userId, userId))).limit(1);
    return result.length > 0;
  }
  async addLike(blogId, userId) {
    const result = await db.insert(likes).values({ blogId, userId }).returning();
    return result[0];
  }
  async removeLike(blogId, userId) {
    const result = await db.delete(likes).where(and(eq(likes.blogId, blogId), eq(likes.userId, userId))).returning();
    return result.length > 0;
  }
};
var storage = new DbStorage();

// server/auth.ts
import bcrypt2 from "bcrypt";
async function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user) {
    req.session.destroy(() => {
    });
    return res.status(401).json({ error: "Invalid session" });
  }
  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar
  };
  next();
}
async function login(username, password) {
  const user = await storage.getUserByUsername(username);
  if (!user) {
    return null;
  }
  const valid = await bcrypt2.compare(password, user.password);
  if (!valid) {
    return null;
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar
  };
}
async function register(data) {
  const existing = await storage.getUserByUsername(data.username);
  if (existing) {
    throw new Error("Username already exists");
  }
  const existingEmail = await storage.getUserByEmail(data.email);
  if (existingEmail) {
    throw new Error("Email already exists");
  }
  const user = await storage.createUser({
    username: data.username,
    email: data.email,
    password: data.password,
    name: data.name,
    role: "user"
  });
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar
  };
}

// server/routes.ts
import slugify from "slugify";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
var upload = multer({
  storage: multer.diskStorage({
    destination: async (_req, _file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  }
});
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, name } = req.body;
      if (!username || !email || !password || !name) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const user = await register({ username, email, password, name });
      req.session.userId = user.id;
      res.json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/me", requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });
  app2.get("/api/categories", async (_req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json({ categories: categories2 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/blogs", async (req, res) => {
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
        status,
        authorId,
        categoryId,
        search,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/blogs/:id", async (req, res) => {
    try {
      const blog = await storage.getBlog(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json({ blog });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/blogs/slug/:slug", async (req, res) => {
    try {
      const blog = await storage.getBlogBySlug(req.params.slug);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json({ blog });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/blogs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogSchema.parse(req.body);
      const slug = slugify(validatedData.title, { lower: true, strict: true });
      const blog = await storage.createBlog({
        ...validatedData,
        slug,
        authorId: req.user.id,
        readTime: Math.ceil(validatedData.content.split(/\s+/).length / 200)
        // ~200 words per minute
      });
      res.json({ blog });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/blogs/:id", requireAuth, async (req, res) => {
    try {
      const blog = await storage.getBlog(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      if (blog.authorId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }
      const updateData = { ...req.body };
      if (updateData.title) {
        updateData.slug = slugify(updateData.title, { lower: true, strict: true });
      }
      if (updateData.content) {
        updateData.readTime = Math.ceil(updateData.content.split(/\s+/).length / 200);
      }
      const updated = await storage.updateBlog(req.params.id, updateData);
      res.json({ blog: updated });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/blogs/:id", requireAuth, async (req, res) => {
    try {
      const blog = await storage.getBlog(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      if (blog.authorId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }
      await storage.deleteBlog(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/blogs/:id/comments", async (req, res) => {
    try {
      const comments2 = await storage.getComments(req.params.id);
      res.json({ comments: comments2 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/blogs/:id/comments", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        blogId: req.params.id,
        userId: req.user.id
      });
      const comment = await storage.createComment(validatedData);
      res.json({ comment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/comments/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteComment(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/blogs/:id/likes", async (req, res) => {
    try {
      const count = await storage.getLikesCount(req.params.id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/blogs/:id/likes/me", requireAuth, async (req, res) => {
    try {
      const isLiked = await storage.isLiked(req.params.id, req.user.id);
      res.json({ isLiked });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/blogs/:id/likes", requireAuth, async (req, res) => {
    try {
      const like2 = await storage.addLike(req.params.id, req.user.id);
      res.json({ like: like2 });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/blogs/:id/likes", requireAuth, async (req, res) => {
    try {
      await storage.removeLike(req.params.id, req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/upload", requireAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
var PgSession = ConnectPgSimple(session);
app.use(express3.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express3.urlencoded({ extended: false }));
app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "writewave-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
);
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
