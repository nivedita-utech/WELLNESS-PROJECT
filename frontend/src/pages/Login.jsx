import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Mail, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setBtnLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBtnLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-sky/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-card w-full max-w-md mx-4 relative z-10 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-teal/10 mb-4">
            <Activity size={32} className="text-brand-teal" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to Aura Wellness Platform</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                placeholder="name@wellness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                id="password"
                type="password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center">
              <input id="remember" type="checkbox" className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-slate-300 rounded" />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-brand-teal hover:text-brand-teal/80">Forgot password?</a>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={btnLoading}
            className="w-full premium-gradient hover:opacity-90 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-brand-teal/20 flex justify-center items-center disabled:opacity-50"
          >
            {btnLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center mb-4">Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button 
              onClick={() => fillCredentials('client1@wellness.com', 'client123')} 
              className="text-xs py-2 px-3 bg-slate-50 hover:bg-brand-teal/5 text-slate-600 hover:text-brand-teal border border-slate-200 hover:border-brand-teal/30 rounded-lg transition-colors font-medium"
            >
              Client Portal
            </button>
            <button 
              onClick={() => fillCredentials('staff1@wellness.com', 'staff123')} 
              className="text-xs py-2 px-3 bg-slate-50 hover:bg-brand-teal/5 text-slate-600 hover:text-brand-teal border border-slate-200 hover:border-brand-teal/30 rounded-lg transition-colors font-medium"
            >
              Staff Portal
            </button>
            <button 
              onClick={() => fillCredentials('franchise1@wellness.com', 'franchise123')} 
              className="text-xs py-2 px-3 bg-slate-50 hover:bg-brand-teal/5 text-slate-600 hover:text-brand-teal border border-slate-200 hover:border-brand-teal/30 rounded-lg transition-colors font-medium"
            >
              Franchise Portal
            </button>
            <button 
              onClick={() => fillCredentials('admin@wellness.com', 'admin123')} 
              className="text-xs py-2 px-3 bg-slate-50 hover:bg-brand-teal/5 text-slate-600 hover:text-brand-teal border border-slate-200 hover:border-brand-teal/30 rounded-lg transition-colors font-medium"
            >
              Admin Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

