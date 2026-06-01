import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Expired", "Cancelled", "Pending"],
      default: "Pending",
    },
    autoRenew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserSubscription = mongoose.model("UserSubscription", userSubscriptionSchema);

export default UserSubscription;
