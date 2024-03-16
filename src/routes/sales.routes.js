import { Router } from "express";
import { salesreport } from "../controllers/sales.controller.js";

const router = new Router();

router.get("/salesreport", salesreport);

export default router;
