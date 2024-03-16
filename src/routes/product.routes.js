import express from "express";
const router = express.Router();
import {
  addProduct,
  addCat,
  deleteCat,
  getProduct,
  getAllProduct,
  getAllCat,
  // getCatProd,
  deleteProduct,
  updateProduct,
  updateCat,
  getCategoryById,
  getSubProd,
} from "../controllers/product.controller.js";

// router.post("/add", addProduct); // adding product

// Categorical Routing
router.post("/addCat", addCat); // Adding product category
router.delete("/deleteCat/:id", deleteCat); // Delete product category
router.put("/updateCat/:id", updateCat); //update product
router.get("/cat", getAllCat); // get all product category
router.get("/cat/:id", getCategoryById);

// router.get("/cat", getCatProd); // get product category

// Product Routing
router.post("/addProduct", addProduct);
router.get("/getProd/:id", getProduct); // get product
router.get("/", getAllProduct); // adding all products
router.get("/catSub", getSubProd); // get product sub-category
router.put("/updateProduct/:productId", updateProduct); //update product
router.delete("/deleteProduct/:id", deleteProduct); //Delete product

export default router;