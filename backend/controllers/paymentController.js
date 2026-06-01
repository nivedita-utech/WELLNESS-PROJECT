import Transaction from "../models/Transaction.js";
import Invoice from "../models/Invoice.js";

// @desc    Get all payments/transactions
// @route   GET /api/billing/payments
// @access  Private
export const getPayments = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { customer: req.user._id };
    const transactions = await Transaction.find(query).populate("customer", "name email").populate("invoice", "invoiceNumber").sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Record a manual payment
// @route   POST /api/billing/payments
// @access  Private/Admin
export const recordPayment = async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod, transactionId, notes } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const transaction = await Transaction.create({
      invoice: invoiceId,
      customer: invoice.customer,
      amount,
      paymentMethod,
      status: "Paid",
      transactionId,
      notes,
    });

    // Update invoice status based on total paid vs total amount
    const allPayments = await Transaction.find({ invoice: invoiceId, status: "Paid" });
    const totalPaid = allPayments.reduce((acc, t) => acc + t.amount, 0);

    if (totalPaid >= invoice.totalAmount) {
      invoice.status = "Paid";
    } else {
      invoice.status = "Partial Payment";
    }
    await invoice.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
