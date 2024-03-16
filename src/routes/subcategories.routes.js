// Import necessary modules and dependencies
import express from 'express';
import {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,  // Add this line
  updateSubcategory,
  deleteSubcategory,
  getSubcategoriesByCategoryId,
} from '../controllers/subcategories.controller.js';

const router = express.Router();

// Create a new subcategory
router.post('/createsubcategories', createSubcategory);

// Get all subcategories
router.get('/subcategories', getAllSubcategories);

// Get a single subcategory by ID
router.get('/subcategories/:id', getSubcategoryById); // Add this line

// Get subcategories by categoryId
router.get('/subcategories/category/:categoryId', getSubcategoriesByCategoryId);

// Update a subcategory by ID
router.put('/subcategories/update/:id', updateSubcategory);

// Delete a subcategory by ID
router.delete('/subcategories/delete/:id', deleteSubcategory);

export default router;
