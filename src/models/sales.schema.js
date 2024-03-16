import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    products: {
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
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Sale", salesSchema);
