// controllers/wishlistController.js
import asyncHandler from '../services/asyncHandler.js';
import CustomError from '../utils/customError.js';
import WishlistModel from '../models/wishlist.schemas.js';
// import ProductModel from '../models/productModel.js'; // Adjust the path based on your project structure

// Get the user's wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming you have authentication middleware setting req.user
    
//   // Validate if the product exists
//   const product = await ProductModel.findById(productId);
  
//   if (!product) {
//    throw new CustomError('Product not found', 404);
//   }


  const wishlist = await WishlistModel.findOne({ userId }).populate('items.productId', 'name price'); // Populate product details

  if (!wishlist) {
    throw new CustomError('Wishlist not found', 404);
  }

  res.status(200).json(wishlist);
});

// Add an item to the wishlist
export const addItemToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming you have authentication middleware setting req.user
  const { productId } = req.body;

  let wishlist = await WishlistModel.findOne({ userId });
  if (!wishlist) {
    // If the user doesn't have a wishlist, create a new one
    wishlist = await WishlistModel.create({ userId, items: [] });
  }

  // Check if the product is already in the wishlist
  const existingItem = wishlist.items.find(item => item.productId.toString() === productId);
  if (existingItem) {
    throw new CustomError('Product already in the wishlist', 400);
  }

  // If the product is not in the wishlist, add it
  wishlist.items.push({ productId });

  // Save the updated wishlist
  await wishlist.save();

  res.status(200).json({ message: 'Item added to the wishlist successfully', wishlist });
});

// Remove an item from the wishlist
export const removeItemFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming you have authentication middleware setting req.user
  const productIdToRemove = req.params.productId;

  let wishlist = await WishlistModel.findOne({ userId });
  if (!wishlist) {
    throw new CustomError('Wishlist not found', 404);
  }

  // Remove the item from the wishlist
  wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productIdToRemove);
  
  // Save the updated wishlist
  await wishlist.save();

  res.status(200).json({ message: 'Item removed from the wishlist successfully', wishlist });
});

// Clear the entire wishlist
export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming you have authentication middleware setting req.user

  const wishlist = await WishlistModel.findOne({ userId });
  if (!wishlist) {
    throw new CustomError('Wishlist not found', 404);
  }

  // Clear the wishlist
  wishlist.items = [];
  
  // Save the updated wishlist
  await wishlist.save();

  res.status(200).json({ message: 'Wishlist cleared successfully', wishlist });
});
