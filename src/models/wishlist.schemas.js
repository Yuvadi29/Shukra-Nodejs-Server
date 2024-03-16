// models/wishlistModel.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const WishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true,
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product', // Reference to your Product model
      required: true,
    },
  }],
}, { timestamps: true });

const WishlistModel = mongoose.model('Wishlist', WishlistSchema);

export default WishlistModel;
