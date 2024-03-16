import mongoose from 'mongoose';
const { Schema } = mongoose;

const subcategorySchema = new mongoose.Schema({
    categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category', // Reference to your Category model
    required: true,
    },
  name: {
    type: String,
    required: true,
    unique: true,
  },
},
  { timestamps: true },
);

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

export default Subcategory;

