import type { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "unauthorized", message: "يجب تسجيل الدخول أولاً" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "forbidden", message: "صلاحية المدير مطلوبة" });
    return;
  }

  (req as any).user = user;
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "unauthorized", message: "يجب تسجيل الدخول أولاً" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(401).json({ error: "unauthorized", message: "الحساب غير موجود" });
    return;
  }

  (req as any).user = user;
  next();
}
