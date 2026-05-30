import mongoose from 'mongoose';

const healthDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileCategory: {
      type: String,
      enum: ['Blood Report', 'Full Body Checkup', 'X-Ray / ECG', 'Vitamin Report', 'Sugar / BP / Thyroid', 'Other'],
      default: 'Other',
    },
    filePath: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const HealthDocument = mongoose.model('HealthDocument', healthDocumentSchema);
export default HealthDocument;
