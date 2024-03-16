import { Router } from "express";
import {
  createConfig,
  showPaymentMethods,
  updatePaymentStatus,
  verifyTransaction,
} from "../controllers/paymentGateway.controller.js";

const router = new Router();

router.post("/paymentconfig", createConfig);
router.get("/paymentoptions", showPaymentMethods);
router.post("/updatestatus", updatePaymentStatus);
router.post("/verifytransaction", verifyTransaction);

export default router;
