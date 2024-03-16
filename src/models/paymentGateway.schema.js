import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentGatewayName: {
      type: String,
      required: true,
    },
    keyName: {
      type: String,
    },
    secretKey: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
