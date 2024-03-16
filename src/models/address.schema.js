import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    userid: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    houseName: {
      type: String,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: Number,
      required: true,
      trim: true,
    },
    stateName: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Creating and exporting the model
export default mongoose.model("Addresses", AddressSchema);
