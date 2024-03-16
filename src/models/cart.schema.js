// models/cartModel.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userDatas", // Reference to your User model
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "productdatas", // Reference to your Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        ProductColor: {
          type: String,
          // required: true,
        },
        ProductSize: {
          type: String,
          // required: true,
          // default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", CartSchema);

export default CartModel;


// product: {
//   type: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//       },
//       count: Number,
//       price: Number,
//     },
//   ],
//   required: true,
// }