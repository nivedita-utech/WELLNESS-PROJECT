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
    return <div style={{ padding: '2rem', color: 'var(--accent-emerald)' }}>Loading Franchise Metrics...</div>;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Title */}
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Landmark size={24} color="var(--accent-emerald)" />
        Franchise Operation Center: <span style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
      </h2>

      {/* Grid boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="card card-glowing-emerald">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Branch Total Revenue</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
            <DollarSign size={24} color="var(--accent-emerald)" />
            {data?.totalRevenue || 0}
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Accumulated sales volume</span>
        </div>

        <div className="card card-glowing-violet">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Earned Commission</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: 'var(--accent-violet)' }}>
            <DollarSign size={24} />
            {data?.totalCommission || 0}
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>25% standard contract split</span>
        </div>

        <div className="card">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Coaching Staff</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Users size={24} color="var(--accent-gold)" />
            {data?.staff?.length || 0}
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Assigned to this branch</span>
        </div>

        <div className="card">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Registered Clients</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Users size={24} color="var(--accent-emerald)" />
            {data?.clients?.length || 0}
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active platform members</span>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        
        {/* Branch Team Onboarding */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3>Onboard Coaching Staff</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Register new coaches directly under this branch.</p>
          <form onSubmit={handleAddStaffSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="e.g. Coach Alexander" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="staff@branch.com" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="••••••••" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <PlusCircle size={16} /> Onboard Staff Account
            </button>
          </form>
        </div>

        {/* Branch Staff List */}
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <h3>Branch Team Roster</h3>
          <div className="custom-table-container" style={{ marginTop: '1rem' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Coach Name</th>
                  <th>Email</th>
                  <th>Assignment Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.staff && data.staff.length > 0 ? (
                  data.staff.map((st, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{st.name}</td>
                      <td>{st.email}</td>
                      <td>
                        <span className={`status-pill ${st.status === 'Active' ? 'status-green-tag' : 'status-yellow-tag'}`}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No staff members assigned to this franchise.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Transactions ledger */}
        <div className="card" style={{ gridColumn: 'span 12' }}>
          <h3>Branch Sales Ledger & Commissions Log</h3>
          <div className="custom-table-container" style={{ marginTop: '1rem' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction Description</th>
                  <th>Sale Amount</th>
                  <th>Franchise Split (25%)</th>
                  <th>Assigned Ledger</th>
                </tr>
              </thead>
              <tbody>
                {data?.sales && data.sales.length > 0 ? (
                  data.sales.map((sale, i) => (
                    <tr key={i}>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                      <td>{sale.description}</td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>${sale.amount}</td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-violet)' }}>${sale.commissionAmount}</td>
                      <td>
                        <span className="status-pill status-green-tag">{sale.assignedTo}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
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
