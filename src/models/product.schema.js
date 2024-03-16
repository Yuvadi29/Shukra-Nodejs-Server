import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  productCategories: {
    type: Schema.Types.ObjectId,
    ref: "Category", // Reference to your User model
    required: true,
  },
  subcategories: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory", // Reference to your User model
    required: true,

  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  mrpPrice: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    // required: true,
  },
  productQuantity: {
    type: Number,
    // required: true,
  },
  stockQuantity: {
    type: Number,
    // required: true,
  },
  color: {
    type: String, // Assuming storing URL to the image
    // required: true,
  },
  size: {
    type: Number, // Assuming storing URL to the image
    // required: true,
  },
  photos: [
    {
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  productDetailPhoto: {
    type: String, // Assuming storing URL to the image
    // required: true,
  },
  adminId: {
    type: String,
  },
});

const Product = mongoose.model("productdatas", productSchema);

export default Product;