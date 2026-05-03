import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import carsRouter from "./cars.js";
import packagesRouter from "./packages.js";
import ordersRouter from "./orders.js";
import workersRouter from "./workers.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/cars", carsRouter);
router.use("/packages", packagesRouter);
router.use("/orders", ordersRouter);
router.use("/workers", workersRouter);
router.use("/admin", adminRouter);

export default router;
