import express from "express";
import {
  signup,
  signin,
  getAllUser,
  delUser,
  getUser,
  updateUser,
  delAll,
} from "../controllers/auth.controller.js";
import adminCheck from "../utils/admincheck.js";

const router = express.Router();

// CREATE A USER
router.post("/signup", signup);

// SIGN IN
router.post("/signin", signin);
// router.post("/signin", adminCheck, signin);

// get user
router.get("/getUser", getAllUser);
router.get("/getUser/:id", getUser);
router.put("/updUser/:id", updateUser);
router.get("/delAll", delAll);
// router.get("/deactivateUser/:id", deactiveUser);
router.delete("/delUser/:id", delUser);

export default router;
