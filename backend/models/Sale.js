import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Customer who purchased
      required: true,
    },
    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Associated Franchise owner (if any)
    },
    assignedTo: {
      type: String,
      enum: ['franchise', 'company'],
      required: true,
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
