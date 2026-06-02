import React, { useState } from 'react';
import { FileText, CreditCard, Crown } from 'lucide-react';
import InvoicesPage from './InvoicesPage';
import PaymentsPage from './PaymentsPage';
import SubscriptionsPage from './SubscriptionsPage';

const Billing = () => {
  const [activeTab, setActiveTab] = useState('invoices');

  const tabs = [
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'payments', label: 'Payments Ledger', icon: CreditCard },
    { id: 'subscriptions', label: 'Plans & Subscriptions', icon: Crown },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Billing Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Monitor revenue, invoices, transactions, and manage subscription plans.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl w-full max-w-3xl overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white text-brand-teal shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === 'invoices' && <InvoicesPage />}
        {activeTab === 'payments' && <PaymentsPage />}
        {activeTab === 'subscriptions' && <SubscriptionsPage />}
      </div>
    </div>
  );
};

export default Billing;
