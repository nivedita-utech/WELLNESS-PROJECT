import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user, updateProfileLocal } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = () => {
    if (updateProfileLocal) {
      updateProfileLocal({ name, email });
    }
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>

      <div className="glass-card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
            >
              Save Changes
            </button>
            {message && <p className="text-brand-teal text-sm mt-2 font-medium">{message}</p>}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Preferences</h2>
        <div className="space-y-4 text-slate-600">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded text-brand-teal focus:ring-brand-teal" />
            <span>Enable Email Notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded text-brand-teal focus:ring-brand-teal" />
            <span>Enable SMS Alerts</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded text-brand-teal focus:ring-brand-teal" />
            <span>Dark Mode (Coming Soon)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
