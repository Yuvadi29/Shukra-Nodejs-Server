// adminCheck.js

import User from "../models/user.schema.js"; // Import your User model
import CustomError from "./customError.js";

const adminCheck = async (req, res, next) => {
  try {
    // Assuming your authentication middleware sets user email in req.user.email
    const userEmail = req.body.email;

    // Fetch user from the database based on the email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      next(); // If the user is an admin, proceed to the next middleware/route handler
    } else {
      throw new CustomError("Unauthorized - Admin access required", 403);
    }
  } catch (error) {
    console.error(error);
    throw new CustomError("Internal Server Error", 500);
  }
};

export default adminCheck;
