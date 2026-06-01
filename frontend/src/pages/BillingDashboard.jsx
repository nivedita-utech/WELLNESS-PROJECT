import React, { useState, useEffect, useContext } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { CreditCard, FileText, TrendingUp, AlertCircle, DollarSign, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BillingDashboard = ({ setActiveTab }) => {
  const { authFetch } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    pendingPayments: 0,
    paidInvoicesCount: 0,
    overdueInvoicesCount: 0,
    monthlyRevenue: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authFetch('/api/billing/dashboard');
        if (res.ok) {
          const data = await res.json();
          // Ensure arrays are initialized if empty
          setStats({
            ...data,
            monthlyRevenue: data.monthlyRevenue || [],
            recentTransactions: data.recentTransactions || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch billing stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authFetch]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedChartData = stats.monthlyRevenue.map(item => ({
    name: item._id?.month ? monthNames[item._id.month - 1] : 'Unknown',
    Revenue: item.revenue
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          trend="+12%" 
          icon={<DollarSign className="w-5 h-5 text-brand-teal dark:text-brand-sky" />} 
          trendUp={true} 
        />
        <StatCard 
          title="Today's Revenue" 
          value={`$${stats.todayRevenue.toLocaleString()}`} 
          trend="+5%" 
          icon={<TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />} 
          trendUp={true} 
        />
        <StatCard 
          title="Pending Payments" 
          value={`$${stats.pendingPayments.toLocaleString()}`} 
          trend="-2%" 
          icon={<AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />} 
          trendUp={false} 
        />
        <StatCard 
          title="Overdue Invoices" 
          value={stats.overdueInvoicesCount.toString()} 
          trend="Action required" 
          icon={<FileText className="w-5 h-5 text-rose-600 dark:text-rose-400" />} 
          trendUp={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="glass-card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Revenue Trends (Last 6 Months)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="Revenue" fill="#14B8A6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="glass-card flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button onClick={() => setActiveTab('payments')} className="text-sm text-brand-teal dark:text-brand-sky hover:opacity-80 font-medium flex items-center">
              View all <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((tx) => (
                <div key={tx._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${tx.status === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.customer?.name || 'Guest'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${tx.amount.toLocaleString()}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tx.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No recent transactions.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, trend, icon, trendUp }) => (
  <div className="glass-card group flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'}`}>
        {trend}
      </span>
    </div>
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default BillingDashboard;
