import React from 'react';
import { X, Download, Printer } from 'lucide-react';

const InvoiceDetailModal = ({ invoice, onClose, onDownload }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Invoice Details</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-10 border-b border-slate-200 pb-8">
              <div>
                <h1 className="text-2xl font-bold text-brand-teal mb-1">WELLNESS ECOSYSTEM</h1>
                <p className="text-sm text-slate-500">123 Wellness Avenue<br/>San Francisco, CA 94107</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900 mb-2">{invoice.invoiceNumber}</p>
                <div className="text-sm text-slate-500 space-y-1">
                  <p>Issue Date: <span className="font-medium text-slate-900">{new Date(invoice.createdAt).toLocaleDateString()}</span></p>
                  <p>Due Date: <span className="font-medium text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</span></p>
                  <p>Status: <span className="font-bold text-brand-teal">{invoice.status}</span></p>
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Billed To</h3>
              <p className="font-medium text-slate-900">{invoice.customer?.name || 'Unknown Customer'}</p>
              <p className="text-slate-500">{invoice.customer?.email}</p>
            </div>

            {/* Mock Items Table for Display Purposes */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3 font-medium">Description</th>
                    <th className="py-3 font-medium text-right">Qty</th>
                    <th className="py-3 font-medium text-right">Price</th>
                    <th className="py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Since our mock might not have items, we render a fallback if empty */}
                  {(invoice.items && invoice.items.length > 0) ? invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-4 text-slate-900 font-medium">{item.description}</td>
                      <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                      <td className="py-4 text-right text-slate-600">₹{item.unitPrice?.toFixed(2)}</td>
                      <td className="py-4 text-right text-slate-900 font-medium">₹{item.amount?.toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="py-4 text-slate-900 font-medium">Premium Wellness Subscription</td>
                      <td className="py-4 text-right text-slate-600">1</td>
                      <td className="py-4 text-right text-slate-600">₹{invoice.totalAmount?.toFixed(2)}</td>
                      <td className="py-4 text-right text-slate-900 font-medium">₹{invoice.totalAmount?.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-1/2 max-w-sm space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{invoice.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (0%)</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total</span>
                  <span>₹{invoice.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button 
            onClick={onDownload}
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-brand-teal hover:opacity-90 rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetailModal;
