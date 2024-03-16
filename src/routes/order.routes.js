import { Router } from "express";
import {
  generateOrder,
  updateOrderStatus,
  getUserOrders,
  cancelOrder,
  getAllOrders 
} from "../controllers/order.controller.js";
// import { salesreport } from "../controllers/sales.controller.js";


const router = Router();

router.get("/orders/:userId", getUserOrders);
router.post("/generateorder", generateOrder);
router.put("/:orderId/orderstatus", updateOrderStatus);
router.get("/allorders", getAllOrders);

// router.get("/salesreport", salesreport);
router.put('/orders/:id/cancel', cancelOrder);



export default router;