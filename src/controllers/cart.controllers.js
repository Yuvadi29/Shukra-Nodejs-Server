import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
// import ProductModel from '../models/productModel.js'; // Adjust the path based on your project structure
import CartModel from "../models/cart.schema.js"; // Adjust the path based on your project structure

// Add a product to the cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, ProductSize, ProductColor } = req.body;
  console.log(req.body);

  // Check if the user has a cart
  let cart = await CartModel.findOne({ userId: req.user._id });
  if (!cart) {
    // If the user doesn't have a cart, create a new one
    cart = await CartModel.create({ userId: req.user._id, items: [] });
  }

  console.log();
  // Check if the product is already in the cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex !== -1) {
    // If the product is already in the cart, update the quantity
    cart.items[existingItemIndex].quantity += quantity;
    cart.items[existingItemIndex].ProductSize = ProductSize;
    cart.items[existingItemIndex].ProductColor = ProductColor;
  } else {
    // If the product is not in the cart, add it
    cart.items.push({ productId, quantity, ProductSize, ProductColor });
  }

  // Save the updated cart
  await cart.save();

  res
    .status(200)
    .json({ message: "Product added to the cart successfully", cart });
});

// Get the user's shopping cart
export const getCartByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await CartModel.findOne({ userId }).populate('items.productId', 'productName quantity');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add or update the quantity of an item in the cart
export const addItemOrUpdateItemQuantity = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // const userId = "65733d7e7fbf794e4bf23774"; // Assuming you have authentication middleware setting req.user

  const { productId, quantity, ProductSize, ProductColor } = req.body;
  // console.log(productId, quantity, ProductSize, ProductColor);
  // console.log(req.body);

  // Check if the user has a cart
  let cart = await CartModel.findOne({ userId: userId });
  if (!cart) {
    // If the user doesn't have a cart, create a new one
    cart = await CartModel.create({ userId: userId, items: [] });
  }

  // Check if the product is already in the cart
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.ProductColor === ProductColor &&
      item.ProductSize === ProductSize
  );
  if (existingItemIndex !== -1) {
    // If the product is already in the cart, update the quantity
    cart.items[existingItemIndex].quantity += quantity;
    cart.items[existingItemIndex].ProductSize = ProductSize;
    cart.items[existingItemIndex].ProductColor = ProductColor;
  } else {
    // If the product is not in the cart, add it
    cart.items.push({ productId, quantity, ProductSize, ProductColor });
    // }
    console.log();
    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Item added to the cart or quantity updated successfully",
      cart,
    });
  }
});

// Remove an item from the cart
// Remove an item from the cart
// Remove an item from the cart
export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  try {
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      throw new CustomError("Cart not found", 404);
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item) => !item.productId.equals(productId)
      );

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item removed from the cart successfully", cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
  }
});

// Clear the entire cart
export const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  // Clear the cart
  cart.items = [];

  // Save the updated cart
  await cart.save();

  res.status(200).json({ message: "Cart cleared successfully", cart });
});
