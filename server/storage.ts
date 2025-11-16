import { db } from "./db";
import { 
  users, blogs, categories, comments, likes,
  type User, type InsertUser,
  type Blog, type InsertBlog,
  type Category, type InsertCategory,
  type Comment, type InsertComment,
  type Like, type InsertLike
} from "@shared/schema";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Blog operations
  getBlog(id: string): Promise<Blog | undefined>;
  getBlogBySlug(slug: string): Promise<Blog | undefined>;
  getBlogs(options?: {
    status?: string;
    authorId?: string;
    categoryId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ blogs: Blog[]; total: number }>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: string, blog: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: string): Promise<boolean>;
  
  // Comment operations
  getComments(blogId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: string): Promise<boolean>;
  
  // Like operations
  getLikesCount(blogId: string): Promise<number>;
  isLiked(blogId: string, userId: string): Promise<boolean>;
  addLike(blogId: string, userId: string): Promise<Like>;
  removeLike(blogId: string, userId: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Blog operations
  async getBlog(id: string): Promise<Blog | undefined> {
    const result = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    return result[0];
  }

  async getBlogBySlug(slug: string): Promise<Blog | undefined> {
    const result = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
    return result[0];
  }

  async getBlogs(options: {
    status?: string;
    authorId?: string;
    categoryId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ blogs: Blog[]; total: number }> {
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
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [blogResults, countResult] = await Promise.all([
      db.select()
        .from(blogs)
        .where(whereClause)
        .orderBy(desc(blogs.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(blogs)
        .where(whereClause)
    ]);

    return {
      blogs: blogResults,
      total: Number(countResult[0]?.count || 0)
    };
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const result = await db.insert(blogs).values({
      ...blog,
      publishedAt: blog.status === "published" ? new Date() : null,
    }).returning();
    return result[0];
  }

  async updateBlog(id: string, blogUpdate: Partial<InsertBlog>): Promise<Blog | undefined> {
    const updateData: any = {
      ...blogUpdate,
      updatedAt: new Date(),
    };

    if (blogUpdate.status === "published") {
      const existingBlog = await this.getBlog(id);
      if (existingBlog && existingBlog.status !== "published") {
        updateData.publishedAt = new Date();
      }
    }

    const result = await db.update(blogs)
      .set(updateData)
      .where(eq(blogs.id, id))
      .returning();
    return result[0];
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();
    return result.length > 0;
  }

  // Comment operations
  async getComments(blogId: string): Promise<Comment[]> {
    return await db.select()
      .from(comments)
      .where(eq(comments.blogId, blogId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const result = await db.insert(comments).values(comment).returning();
    return result[0];
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id)).returning();
    return result.length > 0;
  }

  // Like operations
  async getLikesCount(blogId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(eq(likes.blogId, blogId));
    return Number(result[0]?.count || 0);
  }

  async isLiked(blogId: string, userId: string): Promise<boolean> {
    const result = await db.select()
      .from(likes)
      .where(and(eq(likes.blogId, blogId), eq(likes.userId, userId)))
      .limit(1);
    return result.length > 0;
  }

  async addLike(blogId: string, userId: string): Promise<Like> {
    const result = await db.insert(likes).values({ blogId, userId }).returning();
    return result[0];
  }

  async removeLike(blogId: string, userId: string): Promise<boolean> {
    const result = await db.delete(likes)
      .where(and(eq(likes.blogId, blogId), eq(likes.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
