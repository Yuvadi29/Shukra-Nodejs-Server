import Subcategory from '../models/subcategories.schemas.js';
import asyncHandler from '../services/asyncHandler.js';
import CustomError from '../utils/customError.js';

// Create a new subcategory
// Create a new subcategory
export const createSubcategory = asyncHandler(async (req, res) => {
  const { name, categoryId } = req.body;

  const newSubcategory = await Subcategory.create({
    name,
    categoryId,
    // Add more fields as needed
  });

  res.status(201).json({ success: true, subcategory: newSubcategory });
});



// Get all subcategories
export const getAllSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find();

  res.status(200).json({
    success: true,
    subcategories,
  });
});

// Get a single subcategory by ID
export const getSubcategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const subcategory = await Subcategory.findById(id);
  
    if (!subcategory) {
      throw new CustomError('Subcategory not found', 404);
    }
  
    res.status(200).json({
      success: true,
      subcategory,
    });
  });
  
// New controller function to get subcategories by categoryId
// New controller function to get subcategories by categoryId
export const getSubcategoriesByCategoryId = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      // Find subcategories by categoryId
      const subcategories = await Subcategory.find({ categoryId });
  
      if (!subcategories || subcategories.length === 0) {
        // Set the response status code to 404 before sending the response
        return res.status(404).json({
          success: false,
          error: 'No subcategories found for the specified categoryId',
        });
      }
  
      res.status(200).json({
        success: true,
        subcategories,
      });
    } catch (error) {
      console.error(error);
  
      // Handle specific custom errors
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        // Handle other errors with a generic message
        res.status(500).json({
          success: false,
          error: 'Internal Server Error',
        });
      }
    }
  };
  
// Update a subcategory by ID
export const updateSubcategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // Only extract the 'name' field from the request body

  // Construct the update object with the fields you want to update
  const updateObject = { name };

  const updatedSubcategory = await Subcategory.findByIdAndUpdate(
    id,
    updateObject,
    { new: true, runValidators: true }
  );

  if (!updatedSubcategory) {
    throw new CustomError('Subcategory not found', 404);
  }

  res.status(200).json({
    success: true,
    subcategory: updatedSubcategory,
  });
});

// Delete a subcategory by ID
export const deleteSubcategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedSubcategory = await Subcategory.findByIdAndDelete(id);

  if (!deletedSubcategory) {
    throw new CustomError('Subcategory not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Subcategory deleted successfully',
    subcategory: deletedSubcategory,
  });
});