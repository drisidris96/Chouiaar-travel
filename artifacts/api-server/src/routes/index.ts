import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import tripsRouter from "./trips";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";
import reservationsRouter from "./reservations";
import serviceRequestsRouter from "./service-requests";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/trips", tripsRouter);
router.use("/bookings", bookingsRouter);
router.use("/admin", adminRouter);
router.use("/reservations", reservationsRouter);
router.use("/service-requests", serviceRequestsRouter);

export default router;
