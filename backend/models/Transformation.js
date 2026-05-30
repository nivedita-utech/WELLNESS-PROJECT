import mongoose from 'mongoose';

const transformationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    weight: {
      type: Number, // in kg
      required: true,
    },
    chest: Number, // in inches
    waist: Number, // in inches
    hips: Number, // in inches
    biceps: Number, // in inches
    beforePhoto: {
      type: String, // filePath or URL
      default: '',
    },
    afterPhoto: {
      type: String, // filePath or URL
      default: '',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

const Transformation = mongoose.model('Transformation', transformationSchema);
export default Transformation;
