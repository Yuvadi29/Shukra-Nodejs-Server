import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      // required: [true, "First Name is required"],
      trim: true,
      maxLength: [50, "Name should not exceed 50 character"],
    },
    lastname: {
      type: String,
      trim: true,
      maxLength: [50, "Name should not exceed 50 character"],
    },
    username: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxLength: [50, "Name should not exceed 50 character"],
    },
    phone: {
      type: Number,
      // required: [true, "Mobile number is required"],
      trim: true,
      maxLength: [10, "Number should not exceed 10 digits."],
    },
    altNumber: {
      type: Number,
      maxLength: [10, "Number should not exceed 10 digits."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Min characters should be 8"],
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    status: {
      type: String,
      default: "active",
    },
    address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("userDatas", userSchema);

export default User;
