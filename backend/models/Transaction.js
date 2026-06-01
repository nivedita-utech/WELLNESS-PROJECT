import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet", "Cash", "Bank Transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Partial Payment", "Refunded"],
      default: "Pending",
    },
    transactionId: { type: String }, // External transaction ID from gateway
    notes: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
