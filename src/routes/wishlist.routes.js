// routes/wishlistRoutes.js
import express from 'express';
import {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
} from '../controllers/wishlist.controller.js'; // Adjust the path based on your project structure

const router = express.Router();

router.get('/wishlist',getWishlist);

router.post('/wishlist/add-item',addItemToWishlist);

router.delete('/wishlist/remove-item/:productId',removeItemFromWishlist);

router.delete('/wishlist/clear',clearWishlist);

export default router;
