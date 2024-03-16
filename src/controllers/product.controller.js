// import { createError } from "../error.js"; // custom error
import Product from "../models/product.schema.js";
import Category from "../models/categories.schema.js";
// import multer from "multer";
// import { uploadFile } from "../s3.js";
import { s3FileDelete, s3FileUpload } from "../services/imageUpload.js";
import formidable from "formidable";
import config from "../config/index.js";
import mongoose from "mongoose";
import CustomError from "../utils/customError.js";
import fs from "fs";
import asyncHandler from "../services/asyncHandler.js";

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


//adding product into database
export const addProduct = async (req, res) => {
  // console.log("HI");
  try {
    // console.log("Inside Try Block");
    const form = formidable({ multiples: true, keepExtensions: true });
    // console.log("After Form Constant");
    console.log(req.body);

    form.parse(req, async function (err, fields, files) {
      // console.log("Inside Form parsing");
      if (err) {
        throw new CustomError(err.message || "Something went wrong", 500);
      }

      const productId = new mongoose.Types.ObjectId().toHexString();
      // console.log(productId);
      // Check for required fields
      if (
        !fields.productName ||
        !fields.mrpPrice ||
        !fields.description ||
        !fields.productCategories
      ) {
        throw new CustomError("Please fill all the fields", 400);
      }
      console.log(files);
      // Process image files
      const imgArrayResp = await Promise.all(
        Object.values(files).flatMap((fileList) =>
          fileList.map(async (file, index) => {
            const data = fs.readFileSync(file.filepath);
            // console.log("file", file);
            const upload = await s3FileUpload({
              bucketName: config.S3_BUCKET_NAME,
              key: `products/${productId}/photo_${index + 1}.png`,
              body: data,
              contentType: file.mimetype,
            });

            return {
              secure_url: upload.Location,
            };
          })
        ),
      );

      // Create the product object with correct data types
      const productData = {
        _id: productId,
        photos: imgArrayResp.filter(Boolean),
        productName: fields.productName[0],
        description: fields.description[0],
        productCategories: fields.productCategories[0],
        subcategories: fields.subcategories[0],
        purchasePrice: parseFloat(fields.purchasePrice) || 0,
        mrpPrice: parseFloat(fields.mrpPrice) || 0,
        profit: parseFloat(fields.profit) || 0,
        productQuantity: parseInt(fields.productQuantity) || 0,
        stockQuantity: parseInt(fields.stockQuantity) || 0,
        productDetailPhoto: fields.productDetailPhoto || "",
        size: fields.size[0],
        color: fields.color[0],
        adminId: fields.adminId || "",
      };

      // Create the product in the database
      const product = await Product.create(productData);

      if (!product) {
        throw new CustomError("Product failed to be created in DB", 500);
      }

      // Send the response
      res.status(200).json({
        success: true,
        product,
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ success: false, error: error.message });
  }
};

// Adding Category into database
export const addCat = async (req, res) => {
  try {
    const category = await new Category({ ...req.body });
    const saveCategory = await category.save();
    const categoryId = saveCategory._id;

    res.status(201).json({
      success: true,
      categoryId: categoryId,
      message: "Category Added Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

// Get all Product
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      res.status(404).json({
        message: "Products not found",
      });
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all Category
export const getAllCat = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      res.status(404).json({
        message: "Categories Not found",
      });
    } else {
      res.status(200).json(categories);
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: error });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    // next(error);
    console.log("Error", error);
  }
};
export const getCatProd = async (req, res) => {
  try {
    const { category } = req.query;
    console.log(category);
    const products = await Product.find({
      productCategories: category,
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found for the specified category",
      });
    }

    res.status(200).json(products);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};
export const getSubProd = async (req, res, next) => {
  try {
    const { cat, subCat } = req.query;
    const product = await Product.find({
      productCategories: cat,
      subcategories: subCat,
    });
    if (!product) {
      res.status(404).json({
        message: "product not found",
      });
    } else {
      res.status(200).json(product);
    }

    res
      .status(200)
      .json({ cat, subCat /* other details fetched from the database */ });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Deleting a product from Database
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  console.log("Product Id: ", productId);

  const product = await Product.findById(productId);
  console.log(product);

  if (!product) {
    throw new CustomError("No product found", 404);
  }

  const deletePhotos = await Promise.all(
    product.photos.map(async (elem, index) => {
      await s3FileDelete({
        bucketName: config.S3_BUCKET_NAME,
        key: `products/${productId}/photo_${index + 1}.png`,
      });
    })
  );

  await deletePhotos;
  console.log(deletePhotos);

  // await product.remove();
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product has been deleted successfully",
  });
});

// Deleting a category from Database
export const deleteCat = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) res.status(400).json({ success: false, error: error });

    try {
      await Category.findByIdAndDelete(req.params.id);
      res
        .status(201)
        .json({ success: true, message: "Category Deleted Successfully" });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

// Update product details
export const updateProduct = async (req, res) => {
  try {
    console.log("ProductId:", req.params.productId);

    // Get product id
    const productId = req.params.productId;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body, // Set updated fields
      { new: true } // Return modified document
    );

    if (updatedProduct) {
      res.status(200).json({
        success: true,
        message: "Product Details Updated Successfully",
        data: updatedProduct,
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
};

// Update the Catgory
export const updateCat = async (req, res) => {
  try {
    console.log("CategoryId:", req.params.id);

    // Get product id
    const categoryId = req.params.id;

    const updatedCat = await Category.findByIdAndUpdate(
      categoryId,
      req.body, // Set updated fields
      { new: true } // Return modified document
    );

    if (updatedCat) {
      res.status(200).json({
        success: true,
        message: "Category Details Updated Successfully",
        data: updatedCat,
      });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};
