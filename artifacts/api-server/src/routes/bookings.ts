import { Router, type IRouter } from "express";
import { db, bookingsTable, tripsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const userId = (req.session as any).userId;

    const allBookings = await db
      .select({
        id: bookingsTable.id,
        tripId: bookingsTable.tripId,
        userId: bookingsTable.userId,
        guestName: bookingsTable.guestName,
        guestEmail: bookingsTable.guestEmail,
        guestPhone: bookingsTable.guestPhone,
        numberOfPeople: bookingsTable.numberOfPeople,
        totalPrice: bookingsTable.totalPrice,
        status: bookingsTable.status,
        specialRequests: bookingsTable.specialRequests,
        createdAt: bookingsTable.createdAt,
        trip: {
          id: tripsTable.id,
          title: tripsTable.title,
          description: tripsTable.description,
          destination: tripsTable.destination,
          country: tripsTable.country,
          imageUrl: tripsTable.imageUrl,
          price: tripsTable.price,
          duration: tripsTable.duration,
          maxCapacity: tripsTable.maxCapacity,
          availableSpots: tripsTable.availableSpots,
          startDate: tripsTable.startDate,
          endDate: tripsTable.endDate,
          featured: tripsTable.featured,
          rating: tripsTable.rating,
          reviewCount: tripsTable.reviewCount,
          includes: tripsTable.includes,
          createdAt: tripsTable.createdAt,
        },
      })
      .from(bookingsTable)
      .leftJoin(tripsTable, eq(bookingsTable.tripId, tripsTable.id));

    res.json(allBookings);
  } catch (err) {
    req.log.error({ err }, "Get bookings error");
    res.status(500).json({ error: "internal_error", message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [booking] = await db
      .select({
        id: bookingsTable.id,
        tripId: bookingsTable.tripId,
        userId: bookingsTable.userId,
        guestName: bookingsTable.guestName,
        guestEmail: bookingsTable.guestEmail,
        guestPhone: bookingsTable.guestPhone,
        numberOfPeople: bookingsTable.numberOfPeople,
        totalPrice: bookingsTable.totalPrice,
        status: bookingsTable.status,
        specialRequests: bookingsTable.specialRequests,
        createdAt: bookingsTable.createdAt,
        trip: {
          id: tripsTable.id,
          title: tripsTable.title,
          description: tripsTable.description,
          destination: tripsTable.destination,
          country: tripsTable.country,
          imageUrl: tripsTable.imageUrl,
          price: tripsTable.price,
          duration: tripsTable.duration,
          maxCapacity: tripsTable.maxCapacity,
          availableSpots: tripsTable.availableSpots,
          startDate: tripsTable.startDate,
          endDate: tripsTable.endDate,
          featured: tripsTable.featured,
          rating: tripsTable.rating,
          reviewCount: tripsTable.reviewCount,
          includes: tripsTable.includes,
          createdAt: tripsTable.createdAt,
        },
      })
      .from(bookingsTable)
      .leftJoin(tripsTable, eq(bookingsTable.tripId, tripsTable.id))
      .where(eq(bookingsTable.id, id));

    if (!booking) {
      res.status(404).json({ error: "not_found", message: "Booking not found" });
      return;
    }
    res.json(booking);
  } catch (err) {
    req.log.error({ err }, "Get booking error");
    res.status(500).json({ error: "internal_error", message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { tripId, guestName, guestEmail, guestPhone, numberOfPeople, specialRequests } = req.body;

    const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, tripId));
    if (!trip) {
      res.status(404).json({ error: "not_found", message: "Trip not found" });
      return;
    }
    if (trip.availableSpots < numberOfPeople) {
      res.status(400).json({ error: "no_spots", message: "Not enough available spots" });
      return;
    }

    const totalPrice = trip.price * numberOfPeople;
    const userId = (req.session as any).userId;

    const [booking] = await db.insert(bookingsTable).values({
      tripId,
      userId: userId ?? null,
      guestName,
      guestEmail,
      guestPhone,
      numberOfPeople,
      totalPrice,
      specialRequests,
    }).returning();

    await db.update(tripsTable)
      .set({ availableSpots: trip.availableSpots - numberOfPeople })
      .where(eq(tripsTable.id, tripId));

    const [fullBooking] = await db
      .select({
        id: bookingsTable.id,
        tripId: bookingsTable.tripId,
        userId: bookingsTable.userId,
        guestName: bookingsTable.guestName,
        guestEmail: bookingsTable.guestEmail,
        guestPhone: bookingsTable.guestPhone,
        numberOfPeople: bookingsTable.numberOfPeople,
        totalPrice: bookingsTable.totalPrice,
        status: bookingsTable.status,
        specialRequests: bookingsTable.specialRequests,
        createdAt: bookingsTable.createdAt,
        trip: {
          id: tripsTable.id,
          title: tripsTable.title,
          description: tripsTable.description,
          destination: tripsTable.destination,
          country: tripsTable.country,
          imageUrl: tripsTable.imageUrl,
          price: tripsTable.price,
          duration: tripsTable.duration,
          maxCapacity: tripsTable.maxCapacity,
          availableSpots: tripsTable.availableSpots,
          startDate: tripsTable.startDate,
          endDate: tripsTable.endDate,
          featured: tripsTable.featured,
          rating: tripsTable.rating,
          reviewCount: tripsTable.reviewCount,
          includes: tripsTable.includes,
          createdAt: tripsTable.createdAt,
        },
      })
      .from(bookingsTable)
      .leftJoin(tripsTable, eq(bookingsTable.tripId, tripsTable.id))
      .where(eq(bookingsTable.id, booking.id));

    res.status(201).json(fullBooking);
  } catch (err) {
    req.log.error({ err }, "Create booking error");
    res.status(500).json({ error: "internal_error", message: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      res.status(403).json({ error: "forbidden", message: "Admin access required" });
      return;
    }

    const id = parseInt(req.params.id);
    const { status } = req.body;

    const [booking] = await db.update(bookingsTable)
      .set({ status })
      .where(eq(bookingsTable.id, id))
      .returning();

    if (!booking) {
      res.status(404).json({ error: "not_found", message: "Booking not found" });
      return;
    }

    res.json(booking);
  } catch (err) {
    req.log.error({ err }, "Update booking error");
    res.status(500).json({ error: "internal_error", message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));

    if (!booking) {
      res.status(404).json({ error: "not_found", message: "Booking not found" });
      return;
    }

    await db.update(tripsTable)
      .set({ availableSpots: tripsTable.availableSpots })
      .where(eq(tripsTable.id, booking.tripId));

    await db.update(bookingsTable)
      .set({ status: "cancelled" })
      .where(eq(bookingsTable.id, id));

    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    req.log.error({ err }, "Cancel booking error");
    res.status(500).json({ error: "internal_error", message: "Internal server error" });
  }
});

export default router;
