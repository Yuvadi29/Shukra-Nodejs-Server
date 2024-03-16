import mongoose from "mongoose";
import OrderStatus from "../utils/orderStatus.js";
// import paymentStatus from "../utils/paymentStatus.js";
import { PaymentProviderEnum } from "../utils/PaymentProviderEnum.js";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    product: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          count: Number,
          price: Number,
        },
      ],
      required: true,
    },
    user: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentOption: {
      type: String,
      enum: Object.values(PaymentProviderEnum),
      default: PaymentProviderEnum.UNKNOWN,
    },
    transactionId: String,
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.ORDERED,
    },
    // paymentStatus: {
    //   type: String,
    //   enum: Object.values(paymentStatus),
    //   default: paymentStatus.PAID,
    // },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
