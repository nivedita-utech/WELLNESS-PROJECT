import mongoose from 'mongoose';

const bodyAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    weight: {
      type: Number,
      required: true,
    },
    bodyFat: {
      type: Number,
      required: true,
    },
    bmi: {
      type: Number,
      required: true,
    },
    muscleMass: {
      type: Number,
      required: true,
    },
    visceralFat: {
      type: Number,
      required: true,
    },
    waterPercent: {
      type: Number,
      required: true,
    },
    proteinPercent: {
      type: Number,
      required: true,
    },
    metabolicAge: {
      type: Number,
      required: true,
    },
    boneMass: {
      type: Number,
      required: true,
    },
    healthScore: {
      type: Number,
      required: true,
      default: 70,
    },
    riskIndicator: {
      type: String,
      enum: ['Green', 'Yellow', 'Red'],
      default: 'Green',
    },
  },
  {
    timestamps: true,
  }
);

const BodyAnalysis = mongoose.model('BodyAnalysis', bodyAnalysisSchema);
export default BodyAnalysis;
