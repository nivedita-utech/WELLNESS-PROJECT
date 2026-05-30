import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  changedByName: {
    type: String,
    required: true,
  },
  changeDescription: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const businessControlSchema = new mongoose.Schema(
  {
    franchiseMode: {
      type: Boolean,
      default: true, // ON / OFF
    },
    salesAssignment: {
      type: String,
      enum: ['franchise', 'company'],
      default: 'franchise', // Assign sales to Franchise or Company/Admin Account
    },
    selfFranchiseRule: {
      type: String,
      enum: ['franchise', 'company'],
      default: 'company', // Admin manually decided sales rule under franchise or company
    },
    auditLogs: [auditLogSchema],
  },
  {
    timestamps: true,
  }
);

const BusinessControl = mongoose.model('BusinessControl', businessControlSchema);
export default BusinessControl;
