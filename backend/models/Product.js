import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['Product', 'Consultation', 'Membership'],
      required: true,
    },
    stock: {
      type: Number,
      default: 0, // 0 for infinite (like digital/membership)
    },
    imageUrl: {
      type: String,
      default: '',
    },
    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // If null, belongs to company
      default: null
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
