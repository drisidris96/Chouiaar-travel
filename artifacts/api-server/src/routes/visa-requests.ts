import { Router, type IRouter } from "express";
import { db, visaRequestsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../uploads/visas");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("نوع الملف غير مدعوم"));
    }
  },
});

const router: IRouter = Router();

router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "passportPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        firstName, lastName, birthDate, birthPlace, profession,
        address, phone, passportNumber, passportIssueDate,
        passportIssuePlace, passportExpiryDate, destination,
        travelDate, visaType, duration, notes,
      } = req.body;

      if (!firstName || !lastName || !birthDate || !birthPlace || !profession ||
          !address || !phone || !passportNumber || !passportIssueDate ||
          !passportIssuePlace || !passportExpiryDate || !destination) {
        res.status(400).json({ error: "bad_request", message: "جميع الحقول المطلوبة يجب ملؤها" });
        return;
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const photoUrl = files?.photo?.[0]?.filename || null;
      const passportPhotoUrl = files?.passportPhoto?.[0]?.filename || null;

      const [visaRequest] = await db
        .insert(visaRequestsTable)
        .values({
          firstName, lastName, birthDate, birthPlace, profession,
          address, phone, passportNumber, passportIssueDate,
          passportIssuePlace, passportExpiryDate, destination,
          travelDate: travelDate || null,
          visaType: visaType || "tourism",
          duration: duration || null,
          photoUrl, passportPhotoUrl,
          notes: notes || null,
        })
        .returning();

      res.status(201).json({ visaRequest, message: "تم تسجيل طلب الفيزا بنجاح" });
    } catch (err) {
      req.log.error({ err }, "Create visa request error");
      res.status(500).json({ error: "internal_error", message: "خطأ في الخادم" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      res.status(401).json({ error: "unauthorized", message: "غير مصرح" });
      return;
    }
    const visaRequests = await db.select().from(visaRequestsTable).orderBy(desc(visaRequestsTable.createdAt));
    res.json({ visaRequests });
  } catch (err) {
    req.log.error({ err }, "Get visa requests error");
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
    const { status, adminNotes } = req.body;
    const updateData: any = { status };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const [updated] = await db
      .update(visaRequestsTable)
      .set(updateData)
      .where(eq(visaRequestsTable.id, Number(req.params.id)))
      .returning();
    res.json({ visaRequest: updated });
  } catch (err) {
    req.log.error({ err }, "Update visa request error");
    res.status(500).json({ error: "internal_error", message: "خطأ في الخادم" });
  }
});

router.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "not_found" });
  }
});

export default router;
