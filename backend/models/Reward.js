import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Certificate', 'Milestone', 'Digital Reward'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    certificateUrl: {
      type: String, // If there's an actual image/PDF
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
