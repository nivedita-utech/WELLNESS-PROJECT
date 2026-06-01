import React, { useState, useEffect, useContext } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const CreateInvoiceModal = ({ isOpen, onClose, onInvoiceCreated }) => {
  const { authFetch } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      // Set default due date to 14 days from now
      const defaultDue = new Date();
      defaultDue.setDate(defaultDue.getDate() + 14);
      setDueDate(defaultDue.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await authFetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = Number(newItems[index].quantity) * Number(newItems[index].unitPrice);
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const total = subtotal - Number(discountAmount) + Number(taxAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer) return alert("Please select a customer");
    if (items.some(i => !i.description || i.amount <= 0)) return alert("Please provide valid item details");

    setIsSubmitting(true);
    try {
      const res = await authFetch('/api/billing/invoices', {
        method: 'POST',
        body: JSON.stringify({
          customer,
          items,
          discountAmount: Number(discountAmount),
          taxAmount: Number(taxAmount),
          dueDate,
          notes
        })
      });

      if (res.ok) {
        onInvoiceCreated();
        onClose();
        // Reset state
        setCustomer('');
        setItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
        setDiscountAmount(0);
        setTaxAmount(0);
      } else {
        const error = await res.json();
        alert(`Failed to create invoice: ${error.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Create New Invoice</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                <select 
                  required
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all text-sm"
                >
                  <option value="">Select a customer...</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-800">Line Items</h3>
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">Description</label>
                      <input 
                        type="text" required placeholder="e.g. Wellness Plan"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-slate-500 mb-1">Qty</label>
                      <input 
                        type="number" min="1" required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs text-slate-500 mb-1">Price ($)</label>
                      <input 
                        type="number" min="0" step="0.01" required
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs text-slate-500 mb-1">Amount ($)</label>
                      <div className="bg-slate-100 border border-transparent rounded-lg px-3 py-2 text-sm text-slate-700 font-medium">
                        {item.amount.toFixed(2)}
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors mb-0.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                type="button" 
                onClick={addItem}
                className="mt-3 text-sm text-brand-teal hover:text-teal-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </button>
            </div>

            <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Terms</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all text-sm resize-none"
                  placeholder="Thank you for your business..."
                ></textarea>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm gap-4">
                  <span className="text-slate-500">Discount ($)</span>
                  <input 
                    type="number" min="0" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-24 bg-white border border-slate-200 rounded px-2 py-1 text-right outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                  />
                </div>
                <div className="flex justify-between items-center text-sm gap-4">
                  <span className="text-slate-500">Tax ($)</span>
                  <input 
                    type="number" min="0" step="0.01" value={taxAmount} onChange={(e) => setTaxAmount(e.target.value)}
                    className="w-24 bg-white border border-slate-200 rounded px-2 py-1 text-right outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                  />
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
                  <span className="text-slate-900">Total</span>
                  <span className="text-brand-teal text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="invoice-form"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-white bg-brand-teal hover:opacity-90 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
