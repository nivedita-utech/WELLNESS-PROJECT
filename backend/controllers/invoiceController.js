import Invoice from "../models/Invoice.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// @desc    Get all invoices
// @route   GET /api/billing/invoices
// @access  Private
export const getInvoices = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { customer: req.user._id };
    const invoices = await Invoice.find(query).populate("customer", "name email").sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create an invoice
// @route   POST /api/billing/invoices
// @access  Private/Admin
export const createInvoice = async (req, res) => {
  try {
    const { customer, items, discountAmount, taxAmount, dueDate, notes } = req.body;

    const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const totalAmount = subtotal - (discountAmount || 0) + (taxAmount || 0);

    const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      customer,
      items,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      dueDate,
      notes,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Generate PDF Invoice
// @route   GET /api/billing/invoices/:id/pdf
// @access  Private
export const generateInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer", "name email");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Authorization check
    if (req.user.role !== 'admin' && invoice.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    doc.pipe(res);

    // Header
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("WELLNESS ECOSYSTEM", 50, 57)
      .fontSize(10)
      .text("123 Wellness Avenue", 200, 50, { align: "right" })
      .text("San Francisco, CA 94107", 200, 65, { align: "right" })
      .moveDown();

    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 90).lineTo(550, 90).stroke();

    // Customer Info
    doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 110);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 125);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50, 140);
    doc.text(`Status: ${invoice.status}`, 50, 155);

    doc.text(`Billed To:`, 300, 110);
    doc.text(`${invoice.customer.name}`, 300, 125);
    doc.text(`${invoice.customer.email}`, 300, 140);

    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 180).lineTo(550, 180).stroke();

    // Items
    let y = 200;
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Description", 50, y);
    doc.text("Qty", 280, y, { width: 50, align: "right" });
    doc.text("Price", 350, y, { width: 80, align: "right" });
    doc.text("Amount", 450, y, { width: 80, align: "right" });

    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y + 15).lineTo(550, y + 15).stroke();
    
    y += 25;
    doc.font("Helvetica");
    
    invoice.items.forEach((item) => {
      doc.text(item.description, 50, y, { width: 200 });
      doc.text(item.quantity.toString(), 280, y, { width: 50, align: "right" });
      doc.text(`$${item.unitPrice.toFixed(2)}`, 350, y, { width: 80, align: "right" });
      doc.text(`$${item.amount.toFixed(2)}`, 450, y, { width: 80, align: "right" });
      y += 20;
    });

    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
    y += 15;

    // Totals
    doc.text("Subtotal:", 350, y, { width: 80, align: "right" });
    doc.text(`$${invoice.subtotal.toFixed(2)}`, 450, y, { width: 80, align: "right" });
    y += 20;

    if (invoice.discountAmount > 0) {
      doc.text("Discount:", 350, y, { width: 80, align: "right" });
      doc.text(`-$${invoice.discountAmount.toFixed(2)}`, 450, y, { width: 80, align: "right" });
      y += 20;
    }

    if (invoice.taxAmount > 0) {
      doc.text("Tax:", 350, y, { width: 80, align: "right" });
      doc.text(`$${invoice.taxAmount.toFixed(2)}`, 450, y, { width: 80, align: "right" });
      y += 20;
    }

    doc.font("Helvetica-Bold");
    doc.text("Total:", 350, y, { width: 80, align: "right" });
    doc.text(`$${invoice.totalAmount.toFixed(2)}`, 450, y, { width: 80, align: "right" });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
