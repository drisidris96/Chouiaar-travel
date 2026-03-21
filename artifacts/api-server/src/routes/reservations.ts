import { Router, type IRouter } from "express";
import { db, reservationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/", async (req, res) => {
  try {
    const { type, firstName, lastName, passportNumber, destination, departureDate, returnDate, notes } = req.body;
    if (!type || !firstName || !lastName || !passportNumber || !destination || !departureDate || !returnDate) {
      res.status(400).json({ error: "bad_request", message: "جميع الحقول مطلوبة" });
      return;
    }
    const [reservation] = await db
      .insert(reservationsTable)
      .values({ type, firstName, lastName, passportNumber, destination, departureDate, returnDate, notes: notes || null })
      .returning();
    res.status(201).json({ reservation, message: "تم تسجيل الحجز بنجاح" });
  } catch (err) {
    req.log.error({ err }, "Create reservation error");
    res.status(500).json({ error: "internal_error", message: "خطأ في الخادم" });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      res.status(401).json({ error: "unauthorized", message: "غير مصرح" });
      return;
    }
    const reservations = await db.select().from(reservationsTable).orderBy(desc(reservationsTable.createdAt));
    res.json({ reservations });
  } catch (err) {
    req.log.error({ err }, "Get reservations error");
    res.status(500).json({ error: "internal_error", message: "خطأ في الخادم" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      res.status(401).json({ error: "unauthorized", message: "غير مصرح" });
      return;
    }
    const { status } = req.body;
    const [updated] = await db
      .update(reservationsTable)
      .set({ status })
      .where(eq(reservationsTable.id, Number(req.params.id)))
      .returning();
    res.json({ reservation: updated });
  } catch (err) {
    req.log.error({ err }, "Update reservation error");
    res.status(500).json({ error: "internal_error", message: "خطأ في الخادم" });
  }
});

export default router;
