import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const SubscriptionsPage = () => {
  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: '₹29',
      interval: '/month',
      icon: <Star className="w-6 h-6 text-sky-500" />,
      features: ['Access to community', 'Basic health tracking', 'Standard support', 'Monthly wellness report'],
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-500'
    },
    {
      id: 2,
      name: 'Pro',
      price: '₹79',
      interval: '/month',
      icon: <Zap className="w-6 h-6 text-teal-500" />,
      isPopular: true,
      features: ['Everything in Basic', 'Personalized meal plans', '1-on-1 coaching call per month', 'Advanced body analytics', 'Priority support'],
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-500'
    },
    {
      id: 3,
      name: 'Elite',
      price: '₹199',
      interval: '/month',
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      features: ['Everything in Pro', 'Weekly 1-on-1 coaching', 'Custom workout programs', 'Daily check-ins', 'Free physical supplements box'],
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`glass-card relative hover:-translate-y-1 ${plan.isPopular ? 'border-brand-teal shadow-brand-teal/20' : ''}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${plan.bgColor}`}>
                {plan.icon}
              </div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>

            <div className="mb-6 flex items-baseline text-slate-900">
              <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
              <span className="text-slate-500 ml-1 font-medium">{plan.interval}</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className={`w-5 h-5 mr-3 shrink-0 ${plan.iconColor}`} />
                  <span className="text-slate-600 text-sm leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 px-4 rounded-xl font-bold transition-all ${plan.isPopular ? 'bg-brand-teal text-white hover:opacity-90 shadow-md hover:shadow-lg' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
