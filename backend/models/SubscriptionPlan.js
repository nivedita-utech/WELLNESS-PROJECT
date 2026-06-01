import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Quarterly", "Half-Yearly", "Annual", "Custom"],
      required: true,
    },
    durationInDays: { type: Number, required: true },
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    features: [{ type: String }],
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);

export default SubscriptionPlan;
