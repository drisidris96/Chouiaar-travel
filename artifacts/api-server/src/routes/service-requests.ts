import { Router, type IRouter } from "express";
import { db, serviceRequestsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, address, phone, passportNumber, serviceDescription } = req.body;
    if (!firstName || !lastName || !address || !phone || !passportNumber || !serviceDescription) {
      res.status(400).json({ error: "bad_request", message: "جميع الحقول مطلوبة" });
      return;
    }
    const [request] = await db
      .insert(serviceRequestsTable)
      .values({ firstName, lastName, address, phone, passportNumber, serviceDescription })
      .returning();
    res.status(201).json({ request, message: "تم إرسال طلبك بنجاح" });
  } catch (err) {
    req.log.error({ err }, "Create service request error");
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
    const requests = await db.select().from(serviceRequestsTable).orderBy(desc(serviceRequestsTable.createdAt));
    res.json({ requests });
  } catch (err) {
    req.log.error({ err }, "Get service requests error");
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
      .update(serviceRequestsTable)
      .set({ status })
      .where(eq(serviceRequestsTable.id, Number(req.params.id)))
      .returning();
    res.json({ request: updated });
  } catch (err) {
    req.log.error({ err }, "Update service request error");
    res.status(500).json({ error: "internal_error", message: "خطأ في الخادم" });
  }
});

export default router;
