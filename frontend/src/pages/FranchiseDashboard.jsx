import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Landmark, TrendingUp, Users, DollarSign, PlusCircle } from 'lucide-react';

const FranchiseDashboard = () => {
  const { user, authFetch } = useContext(AuthContext);

  // States
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add Staff form state
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  useEffect(() => {
    fetchFranchiseData();
  }, []);

  const fetchFranchiseData = async () => {
    try {
      const res = await authFetch(`/api/business/franchise-dashboard/${user._id}`);
      const result = await res.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffPassword) return;

    try {
      const res = await authFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: staffName,
          email: staffEmail,
          password: staffPassword,
          role: 'staff',
          franchiseId: user._id, // link staff to this franchise
        }),
      });

      if (res.ok) {
        alert('Staff onboarded and registered successfully!');
        setStaffName('');
        setStaffEmail('');
        setStaffPassword('');
        fetchFranchiseData(); // reload
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading Franchise Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-teal/10 rounded-2xl flex items-center justify-center">
          <Landmark size={24} className="text-brand-teal" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Franchise Operation Center</h2>
          <p className="text-sm text-slate-500">Managing operations for: <span className="font-semibold text-brand-teal">{user.name}</span></p>
        </div>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="glass-card premium-gradient text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Branch Total Revenue</p>
            <h1 className="text-3xl font-black flex items-center gap-1 mt-2 tracking-tight">
              <DollarSign size={28} className="text-white/80" />
              {data?.totalRevenue || 0}
            </h1>
            <span className="text-[10px] text-white/60 uppercase tracking-wider block mt-4">Accumulated sales volume</span>
          </div>
        </div>

        <div className="glass-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden group border-none">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Earned Commission</p>
            <h1 className="text-3xl font-black flex items-center gap-1 mt-2 tracking-tight">
              <DollarSign size={28} className="text-white/80" />
              {data?.totalCommission || 0}
            </h1>
            <span className="text-[10px] text-white/60 uppercase tracking-wider block mt-4">25% standard contract split</span>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
            <Users size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Active Coaching Staff</p>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2 mt-2 tracking-tight">
              {data?.staff?.length || 0}
            </h1>
            <span className="text-[10px] text-slate-400 font-medium block mt-4">Assigned to this branch</span>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
            <TrendingUp size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Registered Clients</p>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2 mt-2 tracking-tight">
              {data?.clients?.length || 0}
            </h1>
            <span className="text-[10px] text-slate-400 font-medium block mt-4">Active platform members</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Branch Team Onboarding */}
        <div className="glass-card lg:col-span-4 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Onboard Coaching Staff</h3>
          <p className="text-xs text-slate-500 mb-6">Register new coaches directly under this branch.</p>
          <form onSubmit={handleAddStaffSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all" placeholder="e.g. Coach Alexander" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
              <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all" placeholder="staff@branch.com" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all" placeholder="••••••••" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <PlusCircle size={18} /> Onboard Staff Account
            </button>
          </form>
        </div>

        {/* Branch Staff List */}
        <div className="glass-card lg:col-span-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Branch Team Roster</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Coach Name</th>
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Assignment Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data?.staff && data.staff.length > 0 ? (
                  data.staff.map((st, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal text-xs font-bold uppercase shrink-0">
                          {st.name.charAt(0)}
                        </div>
                        {st.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{st.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${st.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {st.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-slate-500">
                      <Users size={48} className="text-slate-200 mx-auto mb-3" />
                      No staff members assigned to this franchise.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Transactions ledger */}
        <div className="glass-card lg:col-span-12">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-teal" />
            Branch Sales Ledger & Commissions Log
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Transaction Description</th>
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Sale Amount</th>
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Franchise Split (25%)</th>
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Assigned Ledger</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data?.sales && data.sales.length > 0 ? (
                  data.sales.map((sale, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-slate-700">{sale.description}</td>
                      <td className="py-4 px-4 font-bold text-slate-800">${sale.amount}</td>
                      <td className="py-4 px-4 font-bold text-brand-teal">+ ${sale.commissionAmount}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                          {sale.assignedTo}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500">
                      <Landmark size={48} className="text-slate-200 mx-auto mb-3" />
                      No branch sales recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FranchiseDashboard;
