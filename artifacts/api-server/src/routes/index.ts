import { Router, type IRouter } from "express";
import healthRouter from "./health";
import erpRouter from "./erp";

const router: IRouter = Router();

router.use(healthRouter);
router.use(erpRouter);

export default router;
