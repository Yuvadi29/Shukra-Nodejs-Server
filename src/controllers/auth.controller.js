import User from "../models/user.schema.js";
import bcrypt from "bcryptjs";
import CustomError from "../utils/customError.js";
import asyncHandler from "../services/asyncHandler.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError("User already exist", 400);
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("user created successfully!!");
    console.log("user created successfully");
  } catch (error) {
    console.log(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      throw new CustomError("Please fill all the fields", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("Invalid credentials", 400);
    }

    // if (!user) return next(createError(404, "User not found!!"));
    // console.log(user);

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      throw new CustomError("Invalid credentials", 400);
    }
    // if (!pass) return next(createError(400, "Wrong Credentials"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { ...otherDetails } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ token, ...otherDetails });
  } catch (error) {
    next(error);
  }
};

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
export const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    if (User.length === 0) {
      throw new CustomError("User not found", 400);
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    // console.log("Error:", error);
    // res.status(500).json({ message: "Internal server error" });
    next(error);
  }
});
export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  res.status(200).json({
    success: true,
    user,
  });
});
export const delUser = asyncHandler(async (req, res) => {
  // const { user } = req;
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new CustomError("User not found", 400);
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User Removed Sucessfully!!");
    } catch (error) {
      throw new CustomError("User not found", 400);
    }
  } catch (error) {
    throw new CustomError("OOps error occured", 500);
  }
});
export const delAll = asyncHandler(async (req, res) => {
  // const { user } = req;
  try {
    // const user = await User.findById(req.params.id);
    // if (!user) throw new CustomError("User not found", 400);
    try {
      await User.deleteMany();
      res.status(200).json("User Removed Sucessfully!!");
    } catch (error) {
      throw new CustomError("User not found", 400);
    }
  } catch (error) {
    next(error);
  }
});
export const getUser = asyncHandler(async (req, res) => {
  // const { user } = req;
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new CustomError("User not found", 400);
    else {
      res.status(200).json(user);
    }
  } catch (error) {
    throw new CustomError("User not found", 400);
  }
});
export const updateUser = asyncHandler(async (req, res) => {
  // const { user } = req;
  try {
    // Get product id
    const userId = req.params.id;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true } // Return modified document
    );

    if (updateUser) {
      res.status(200).json({
        success: true,
        message: "User Details Updated Successfully",
        data: updateUser,
      });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

// export { signin, signup, getProfile, logout, getAllUser };
