import app from "./app";
import { logger } from "./lib/logger";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function seedAdmin() {
  try {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, "admin@travel.com"));
    if (!existing) {
      const hashed = crypto.createHash("sha256").update("admin123" + "travel-agency-salt").digest("hex");
      await db.insert(usersTable).values({
        email: "admin@travel.com",
        password: hashed,
        name: "مدير النظام",
        role: "admin",
        verified: true,
      });
      logger.info("Admin account created: admin@travel.com");
    } else {
      logger.info("Admin account already exists");
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed admin account");
  }
}

seedAdmin().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
});
