import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, DollarSign, Users, PlusCircle, ClipboardList, TrendingUp, Activity, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const mockChartData = [
  { name: 'Jan', revenue: 4000, members: 2400 },
  { name: 'Feb', revenue: 3000, members: 1398 },
  { name: 'Mar', revenue: 2000, members: 9800 },
  { name: 'Apr', revenue: 2780, members: 3908 },
  { name: 'May', revenue: 1890, members: 4800 },
  { name: 'Jun', revenue: 2390, members: 3800 },
  { name: 'Jul', revenue: 3490, members: 4300 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="glass-card flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
          <TrendingUp size={14} className={trendUp ? '' : 'rotate-180'} />
          <span className="font-medium">{trend}</span>
        </div>
      )}
    </div>
    <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center">
      <Icon size={24} className="text-brand-teal" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const { authFetch } = useContext(AuthContext);

  const [control, setControl] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [sales, setSales] = useState([]);

  const [activeTab, setActiveTab] = useState('overview');

  // Franchise Onboarding Form State
  const [franName, setFranName] = useState('');
  const [franEmail, setFranEmail] = useState('');
  const [franPassword, setFranPassword] = useState('');

  // Sales Simulator State
  const [simAmount, setSimAmount] = useState('');
  const [simClientEmail, setSimClientEmail] = useState('');
  const [simDesc, setSimDesc] = useState('');
  const [simOverride, setSimOverride] = useState(''); 

  // Edit User State
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRole, setEditRole] = useState('user');
  const [editStatus, setEditStatus] = useState('Active');
  const [editFranchiseId, setEditFranchiseId] = useState('');

  useEffect(() => {
    fetchBusinessControl();
    fetchAuditLogs();
    fetchUsers();
    fetchFranchises();
    fetchSales();
  }, []);

  const fetchBusinessControl = async () => {
    try {
      const res = await authFetch('/api/business/control');
      const data = await res.json();
      setControl(data);
    } catch (err) { console.error(err); }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await authFetch('/api/business/audit-logs');
      const data = await res.json();
      setAuditLogs(data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await authFetch('/api/users');
      const data = await res.json();
      setUsers(data.data || data);
    } catch (err) { console.error(err); }
  };

  const fetchFranchises = async () => {
    try {
      const res = await authFetch('/api/business/franchises');
      const data = await res.json();
      setFranchises(data);
    } catch (err) { console.error(err); }
  };

  const fetchSales = async () => {
    try {
      const res = await authFetch('/api/business/sales');
      const data = await res.json();
      setSales(data);
    } catch (err) { console.error(err); }
  };

  const handleToggleFranchiseMode = async () => {
    if (!control) return;
    const updatedMode = !control.franchiseMode;
    await saveBusinessControl({ franchiseMode: updatedMode });
  };

  const handleDropdownChange = async (field, value) => {
    await saveBusinessControl({ [field]: value });
  };

  const saveBusinessControl = async (payload) => {
    try {
      const res = await authFetch('/api/business/control', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setControl(data);
      fetchAuditLogs();
    } catch (err) { console.error(err); }
  };

  const handleFranchiseOnboard = async (e) => {
    e.preventDefault();
    if (!franName || !franEmail || !franPassword) return;

    try {
      const res = await authFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: franName,
          email: franEmail,
          password: franPassword,
          role: 'franchise',
        }),
      });

      if (res.ok) {
        alert('Franchise onboarded successfully!');
        setFranName(''); setFranEmail(''); setFranPassword('');
        fetchFranchises(); fetchUsers();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) { console.error(err); }
  };

  const handleSimulateSale = async (e) => {
    e.preventDefault();
    if (!simAmount || !simClientEmail || !simDesc) return;

    try {
      const res = await authFetch('/api/business/sale', {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(simAmount),
          clientEmail: simClientEmail,
          description: simDesc,
          manualAssignment: simOverride || undefined,
        }),
      });

      if (res.ok) {
        alert('Simulated sales transaction executed successfully!');
        setSimAmount(''); setSimClientEmail(''); setSimDesc(''); setSimOverride('');
        fetchSales(); 
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) { console.error(err); }
  };

  const handleUserEditSubmit = async (id) => {
    try {
      const res = await authFetch(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          role: editRole,
          status: editStatus,
          franchiseId: editFranchiseId || null,
        }),
      });

      if (res.ok) {
        setEditingUserId(null);
        fetchUsers();
        alert('User profile settings updated!');
      }
    } catch (err) { console.error(err); }
  };

  const startEditing = (usr) => {
    setEditingUserId(usr._id);
    setEditRole(usr.role);
    setEditStatus(usr.status);
    setEditFranchiseId(usr.franchiseId || '');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'controls', label: 'Business Controls', icon: Shield },
    { id: 'sales', label: 'Sales Ledger', icon: DollarSign },
    { id: 'users', label: 'Directory', icon: Users },
    { id: 'onboard', label: 'Onboard Franchise', icon: PlusCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage business logic, users, and analyze metrics.</p>
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

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value="$45,231" icon={DollarSign} trend="+12.5% from last month" trendUp={true} />
            <StatCard title="Active Members" value="1,240" icon={Users} trend="+5.2% from last month" trendUp={true} />
            <StatCard title="Franchises" value={franchises.length.toString()} icon={Activity} trend="Stable" trendUp={true} />
            <StatCard title="System Status" value="Healthy" icon={CheckCircle2} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Growth</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-card col-span-1">
              <h3 className="text-lg font-bold text-slate-800 mb-4">User Acquisition</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="members" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BUSINESS CONTROLS */}
      {activeTab === 'controls' && control && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="glass-card lg:col-span-1">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Routing Controls</h3>
            <p className="text-sm text-slate-500 mb-6">Configure system-wide transactional revenue allocation logic.</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-700">Franchise Mode</p>
                  <p className="text-xs text-slate-500 mt-0.5">Route transactions to franchises</p>
                </div>
                <button 
                  onClick={handleToggleFranchiseMode}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${control.franchiseMode ? 'bg-brand-teal' : 'bg-slate-300'}`}
                >
                  <span className={`w-5 h-5 bg-white rounded-full absolute transition-transform shadow ${control.franchiseMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sales Assignment Target</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all text-sm"
                  value={control.salesAssignment}
                  onChange={(e) => handleDropdownChange('salesAssignment', e.target.value)}
                >
                  <option value="franchise">Assign to Franchise Account</option>
                  <option value="company">Assign to Company/Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Self-Franchise Default Override</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all text-sm"
                  value={control.selfFranchiseRule}
                  onChange={(e) => handleDropdownChange('selfFranchiseRule', e.target.value)}
                >
                  <option value="franchise">Sales under Franchise</option>
                  <option value="company">Sales under Company</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <ClipboardList size={20} className="text-brand-sky" />
              System Audit Logs
            </h3>
            <p className="text-sm text-slate-500 mb-6">Chronological trail of logic modifications.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 font-semibold text-sm text-slate-500">Timestamp</th>
                    <th className="pb-3 font-semibold text-sm text-slate-500">Changed By</th>
                    <th className="pb-3 font-semibold text-sm text-slate-500">Action Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {auditLogs.map((log, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-3 font-medium text-slate-700">{log.changedByName}</td>
                      <td className="py-3 text-brand-sky">{log.changeDescription}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr><td colSpan="3" className="py-4 text-center text-slate-400">No logs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SALES SIMULATOR & LEDGER */}
      {activeTab === 'sales' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="glass-card lg:col-span-1">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sales Simulator</h3>
            <p className="text-sm text-slate-500 mb-6">Test the live business routing logic manually.</p>
            
            <form onSubmit={handleSimulateSale} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client Email</label>
                <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" placeholder="client@wellness.com" value={simClientEmail} onChange={(e) => setSimClientEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" placeholder="e.g. 5000" value={simAmount} onChange={(e) => setSimAmount(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" placeholder="e.g. Annual Membership" value={simDesc} onChange={(e) => setSimDesc(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Override Rule</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" value={simOverride} onChange={(e) => setSimOverride(e.target.value)}>
                  <option value="">Auto Route (Use System Toggles)</option>
                  <option value="franchise">Force to Franchise</option>
                  <option value="company">Force to Company</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 rounded-xl transition-all mt-2">
                Simulate Transaction
              </button>
            </form>
          </div>

          <div className="glass-card lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Live Sales Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 font-semibold text-sm text-slate-500">Date</th>
                    <th className="pb-3 font-semibold text-sm text-slate-500">Customer</th>
                    <th className="pb-3 font-semibold text-sm text-slate-500">Amount</th>
                    <th className="pb-3 font-semibold text-sm text-slate-500">Commission</th>
                    <th className="pb-3 font-semibold text-sm text-slate-500">Ledger</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {sales.map((sl, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 text-slate-500">{new Date(sl.date).toLocaleDateString()}</td>
                      <td className="py-3 font-medium text-slate-700">{sl.userId?.name || 'Walk-in Client'}</td>
                      <td className="py-3 font-bold text-brand-teal">${sl.amount}</td>
                      <td className="py-3 font-medium text-brand-sky">${sl.commissionAmount || 0}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${sl.assignedTo === 'franchise' ? 'bg-brand-sky/10 text-brand-sky' : 'bg-orange-100 text-orange-600'}`}>
                          {sl.assignedTo}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr><td colSpan="5" className="py-4 text-center text-slate-400">No sales recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: USERS */}
      {activeTab === 'users' && (
        <div className="glass-card animate-in fade-in duration-500">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ecosystem Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 font-semibold text-sm text-slate-500">Name</th>
                  <th className="pb-3 font-semibold text-sm text-slate-500">Email</th>
                  <th className="pb-3 font-semibold text-sm text-slate-500">Role</th>
                  <th className="pb-3 font-semibold text-sm text-slate-500">Status</th>
                  <th className="pb-3 font-semibold text-sm text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((usr) => (
                  <tr key={usr._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-slate-800">{usr.name}</td>
                    <td className="py-3 text-slate-500">{usr.email}</td>
                    <td className="py-3">
                      <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wider">
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${usr.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${usr.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {usr.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {editingUserId === usr._id ? (
                        <div className="flex items-center gap-2">
                          <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="border border-slate-200 rounded px-2 py-1 text-xs">
                            <option value="user">User</option>
                            <option value="staff">Staff</option>
                            <option value="franchise">Franchise</option>
                            <option value="admin">Admin</option>
                          </select>
                          <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="border border-slate-200 rounded px-2 py-1 text-xs">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                          <button onClick={() => handleUserEditSubmit(usr._id)} className="px-3 py-1 bg-brand-teal text-white rounded text-xs font-medium">Save</button>
                          <button onClick={() => setEditingUserId(null)} className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs font-medium">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => startEditing(usr)} className="px-3 py-1 bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-brand-teal hover:border-brand-teal rounded-lg text-xs font-medium transition-colors">
                          Manage
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ONBOARD */}
      {activeTab === 'onboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="glass-card lg:col-span-1">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Register Franchise</h3>
            <form onSubmit={handleFranchiseOnboard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Branch Name</label>
                <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" placeholder="Iron Gym South" value={franName} onChange={(e) => setFranName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Partner Email</label>
                <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" placeholder="partner@gym.com" value={franEmail} onChange={(e) => setFranEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Temporary Password</label>
                <input type="password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" placeholder="••••••••" value={franPassword} onChange={(e) => setFranPassword(e.target.value)} required />
              </div>
              <button type="submit" className="w-full premium-gradient text-white font-medium py-2.5 rounded-xl transition-all shadow-md shadow-brand-teal/20 mt-4">
                Onboard Partner
              </button>
            </form>
          </div>

          <div className="glass-card lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Active Franchise Branches</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 font-semibold text-sm text-slate-500">Branch Name</th>
                    <th className="pb-3 font-semibold text-sm text-slate-500">Contact Email</th>
                    <th className="pb-3 font-semibold text-sm text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {franchises.map((fr, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-medium text-slate-800">{fr.name}</td>
                      <td className="py-3 text-slate-500">{fr.email}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${fr.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${fr.status === 'Active' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                          {fr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {franchises.length === 0 && (
                    <tr><td colSpan="3" className="py-4 text-center text-slate-400">No franchises found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
