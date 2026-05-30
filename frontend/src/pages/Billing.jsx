import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';

const Billing = () => {
  const { authFetch } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (searchParams.get('success')) {
      setStatusMessage({ type: 'success', text: 'Payment successful! Your subscription is now active.' });
    }
    if (searchParams.get('canceled')) {
      setStatusMessage({ type: 'error', text: 'Payment was canceled.' });
    }
  }, [searchParams]);

  const handleSubscribe = async (planId, planName, amount) => {
    setLoadingPlan(planId);
    try {
      const res = await authFetch('/api/billing/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ planId, planName, amount })
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to initiate checkout.' });
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: 'An error occurred during checkout initiation.' });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Billing & Subscriptions</h1>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {statusMessage.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card premium-gradient text-white">
          <h3 className="text-lg font-medium text-white/90">Current Balance</h3>
          <p className="text-3xl font-bold mt-2">$0.00</p>
        </div>
        <div className="glass-card">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Next Billing Date</h3>
          <p className="text-xl font-bold text-slate-800 mt-2">Not Scheduled</p>
        </div>
        <div className="glass-card">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Plan</h3>
          <p className="text-xl font-bold text-brand-teal mt-2">Free Tier</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Upgrade Your Wellness Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Basic Plan */}
          <div className="glass-card flex flex-col hover:border-brand-sky/50 transition-colors">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-800">Basic Membership</h3>
              <p className="text-slate-500 text-sm mt-1">Essential tools for your health journey.</p>
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-slate-800">$19</span>
              <span className="text-slate-500 font-medium">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {['Access to Beginner Workouts', 'Standard Macro Tracking', 'Basic Analytics', 'Community Forum Access'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check size={16} className="text-brand-sky" />
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSubscribe('basic_plan', 'Basic Membership', 19)}
              disabled={loadingPlan !== null}
              className="w-full py-3 rounded-xl border-2 border-brand-sky text-brand-sky font-bold hover:bg-brand-sky hover:text-white transition-all disabled:opacity-50"
            >
              {loadingPlan === 'basic_plan' ? 'Processing...' : 'Choose Basic'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="glass-card flex flex-col border-2 border-brand-teal relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <div className="mb-4 mt-2">
              <h3 className="text-xl font-bold text-brand-teal">Premium Elite</h3>
              <p className="text-slate-500 text-sm mt-1">Full AI access and personalized coaching.</p>
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-slate-800">$49</span>
              <span className="text-slate-500 font-medium">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {['Advanced AI Health Intelligence', 'Full Workout Library (Gym + Home)', 'Personalized Meal Recommendations', 'Detailed Progress Graphs', 'Priority Support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check size={16} className="text-brand-teal" />
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSubscribe('premium_plan', 'Premium Elite', 49)}
              disabled={loadingPlan !== null}
              className="w-full py-3 rounded-xl premium-gradient text-white font-bold hover:opacity-90 shadow-lg shadow-brand-teal/20 transition-all disabled:opacity-50"
            >
              {loadingPlan === 'premium_plan' ? 'Processing...' : 'Upgrade to Premium'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Billing;
