import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { storage } from "./storage";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    name: string;
    role: string;
    avatar?: string | null;
  };
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: "Invalid session" });
  }

  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };

  next();
}

export function requireRole(...roles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

export async function login(username: string, password: string) {
  const user = await storage.getUserByUsername(username);
  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  name: string;
}) {
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
    role: "user",
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };
}
