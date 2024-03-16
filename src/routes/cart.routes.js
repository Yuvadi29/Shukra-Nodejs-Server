// routes/cartRoutes.js

import express from 'express';
import {
  getCartByUserId,
  addItemOrUpdateItemQuantity,
  removeItemFromCart,
  clearCart,
} from '../controllers/cart.controllers.js';

const router = express.Router();

// router.get('/cart',getCart)

router.post('/cart/add-item/:userId',addItemOrUpdateItemQuantity)

router.get('/cart/:userId', getCartByUserId);


router.delete('/cart/remove-item/:userId/:productId', removeItemFromCart); // Updated route

router.delete('/cart/clear',clearCart)

export default router;
