import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  Camera,
  CheckSquare,
  Compass,
  Droplet,
  FileText,
  Flame,
  Heart,
  TrendingUp,
  Tv,
  Upload,
  User,
  Users,
  Moon,
  Compass as CalmIcon,
  CheckCircle2,
  ShoppingBag,
  X,
  Bell,
  Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const UserDashboard = () => {
  const { user, authFetch, updateProfileLocal } = useContext(AuthContext);

  // States
  const [selectedTab, setSelectedTab] = useState('overview');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyLog, setDailyLog] = useState(null);
  const [transformations, setTransformations] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [feed, setFeed] = useState([]);
  // Dynamic quote & personalized recommendations
  const [quote, setQuote] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  // Analytics graphs
  const [graphData, setGraphData] = useState(null);
  
  // New features state
  const [programs, setPrograms] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Hydration state
  const [tempWater, setTempWater] = useState(0);
  const [showWaterReminder, setShowWaterReminder] = useState(false);
  
  // Water Reminder Engine
  useEffect(() => {
    const goal = dailyLog?.waterGoal || 2500;
    if (tempWater >= goal) {
      setShowWaterReminder(false);
      return;
    }

    // Remind every 2 hours (7200000 ms)
    const interval = setInterval(() => {
      if (tempWater < goal) {
        setShowWaterReminder(true);
      }
    }, 7200000);

    return () => clearInterval(interval);
  }, [tempWater, dailyLog?.waterGoal]);

  // Meal Log State
  const [mealCategory, setMealCategory] = useState('breakfast');
  const [mealName, setMealName] = useState('');
  const [mealCal, setMealCal] = useState(0);
  const [mealProt, setMealProt] = useState(0);
  const [mealCarbs, setMealCarbs] = useState(0);
  const [mealFat, setMealFat] = useState(0);

  // AI Diet Planner State
  const [aiCurrentWeight, setAiCurrentWeight] = useState('');
  const [aiGoal, setAiGoal] = useState('lose');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Transformation input state
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [biceps, setBiceps] = useState('');
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [transNotes, setTransNotes] = useState('');

  // Document Upload State
  const [docCategory, setDocCategory] = useState('Blood Report');
  const [docNotes, setDocNotes] = useState('');
  const [docFile, setDocFile] = useState(null);

  // Community Post State
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState('Post');

  // Video Workout category
  const [videoCategory, setVideoCategory] = useState('All');

  // Fetch all initial data
  useEffect(() => {
    fetchDailyLog();
    fetchTransformations();
    fetchWorkouts();
    fetchDocuments();
    fetchAIInsights();
    fetchLeaderboard();
    fetchFeed();
    fetchQuote();
    fetchRecommendations();
    fetchGraphData();
    fetchPrograms();
    fetchMealPlans();
    fetchRewards();
    fetchProducts();
  }, [date]);

  const fetchPrograms = async () => {
    try {
      const res = await authFetch('/api/wellness/programs');
      const data = await res.json();
      setPrograms(data);
    } catch (err) { console.error(err); }
  };

  const fetchMealPlans = async () => {
    try {
      const res = await authFetch('/api/wellness/meal-plans');
      const data = await res.json();
      setMealPlans(data);
    } catch (err) { console.error(err); }
  };

  const fetchRewards = async () => {
    try {
      const res = await authFetch('/api/wellness/rewards');
      const data = await res.json();
      setRewards(data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await authFetch('/api/business/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error(err); }
  };

  const fetchQuote = async () => {
    try {
      const res = await authFetch('/api/wellness/quote');
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await authFetch('/api/wellness/recommendations');
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGraphData = async () => {
    try {
      const res = await authFetch('/api/wellness/analytics/graphs');
      const data = await res.json();
      setGraphData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDailyLog = async () => {
    try {
      const res = await authFetch(`/api/wellness/daily-log/${date}`);
      const data = await res.json();
      setDailyLog(data);
      setTempWater(data.waterIntake || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransformations = async () => {
    try {
      const res = await authFetch('/api/wellness/transformation');
      const data = await res.json();
      setTransformations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const res = await authFetch('/api/wellness/workouts');
      const data = await res.json();
      setWorkouts(data.data || data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await authFetch(`/api/health/documents/${user._id}`);
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAIInsights = async () => {
    try {
      const res = await authFetch(`/api/health/ai-insights/${user._id}`);
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await authFetch('/api/community/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFeed = async () => {
    try {
      const res = await authFetch('/api/community/feed');
      const data = await res.json();
      setFeed(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAIDietPlan = async (e) => {
    e.preventDefault();
    if (!aiCurrentWeight) return alert('Please enter your current weight');
    
    setIsGeneratingPlan(true);
    try {
      const res = await authFetch('/api/wellness/ai-diet-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentWeight: aiCurrentWeight, goal: aiGoal })
      });
      
      if (res.ok) {
        await fetchMealPlans(); // Refresh the meal plans list to show the new one
        alert('AI Diet Plan successfully generated!');
      } else {
        const data = await res.json();
        alert(data.message || 'Error generating plan');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while generating plan');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Log water increments
  const addWater = async (amount) => {
    const updatedWater = tempWater + amount;
    setTempWater(updatedWater);
    
    try {
      const res = await authFetch('/api/wellness/daily-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          waterIntake: updatedWater,
          waterGoal: dailyLog?.waterGoal || 2500,
          sleepHours: dailyLog?.sleepHours || 0,
          meditationMinutes: dailyLog?.meditationMinutes || 0,
          yogaMinutes: dailyLog?.yogaMinutes || 0,
          stepCount: dailyLog?.stepCount || 0,
          mealsLogged: dailyLog?.mealsLogged,
          habits: dailyLog?.habits || [],
        }),
      });
      const data = await res.json();
      setDailyLog(data);
      triggerPointsBadgeUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // Log Sleep & Steps
  const updateStepsSleep = async (steps, sleep, meditation, yoga) => {
    try {
      const res = await authFetch('/api/wellness/daily-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          waterIntake: dailyLog?.waterIntake || 0,
          waterGoal: dailyLog?.waterGoal || 2500,
          sleepHours: sleep !== undefined ? sleep : dailyLog?.sleepHours || 0,
          meditationMinutes: meditation !== undefined ? meditation : dailyLog?.meditationMinutes || 0,
          yogaMinutes: yoga !== undefined ? yoga : dailyLog?.yogaMinutes || 0,
          stepCount: steps !== undefined ? steps : dailyLog?.stepCount || 0,
          mealsLogged: dailyLog?.mealsLogged,
          habits: dailyLog?.habits || [],
        }),
      });
      const data = await res.json();
      setDailyLog(data);
      triggerPointsBadgeUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHabit = async (habitName) => {
    const currentHabits = dailyLog?.habits || [];
    let newHabits;
    if (currentHabits.includes(habitName)) {
      newHabits = currentHabits.filter(h => h !== habitName);
    } else {
      newHabits = [...currentHabits, habitName];
    }
    
    try {
      const res = await authFetch('/api/wellness/daily-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          waterIntake: dailyLog?.waterIntake || 0,
          waterGoal: dailyLog?.waterGoal || 2500,
          sleepHours: dailyLog?.sleepHours || 0,
          meditationMinutes: dailyLog?.meditationMinutes || 0,
          yogaMinutes: dailyLog?.yogaMinutes || 0,
          stepCount: dailyLog?.stepCount || 0,
          mealsLogged: dailyLog?.mealsLogged,
          habits: newHabits,
        }),
      });
      const data = await res.json();
      setDailyLog(data);
      triggerPointsBadgeUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // Log Meal Nutrition
  const handleMealSubmit = async (e) => {
    e.preventDefault();
    if (!mealName) return;

    const mealsLogged = { ...dailyLog?.mealsLogged };
    mealsLogged[mealCategory] = {
      name: mealName,
      calories: Number(mealCal),
      protein: Number(mealProt),
      carbs: Number(mealCarbs),
      fat: Number(mealFat),
      logged: true,
    };

    try {
      const res = await authFetch('/api/wellness/daily-log', {
        method: 'POST',
        body: JSON.stringify({
          date,
          waterIntake: dailyLog?.waterIntake || 0,
          waterGoal: dailyLog?.waterGoal || 2500,
          sleepHours: dailyLog?.sleepHours || 0,
          meditationMinutes: dailyLog?.meditationMinutes || 0,
          yogaMinutes: dailyLog?.yogaMinutes || 0,
          stepCount: dailyLog?.stepCount || 0,
          habits: dailyLog?.habits || [],
          mealsLogged,
        }),
      });
      const data = await res.json();
      setDailyLog(data);

      // reset form
      setMealName('');
      setMealCal(0);
      setMealProt(0);
      setMealCarbs(0);
      setMealFat(0);
      triggerPointsBadgeUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Transformation Log
  const handleTransformationSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return;

    const formData = new FormData();
    formData.append('weight', weight);
    formData.append('chest', chest);
    formData.append('waist', waist);
    formData.append('hips', hips);
    formData.append('biceps', biceps);
    formData.append('notes', transNotes);
    if (beforePhoto) formData.append('beforePhoto', beforePhoto);
    if (afterPhoto) formData.append('afterPhoto', afterPhoto);

    try {
      const res = await authFetch('/api/wellness/transformation', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setWeight('');
        setChest('');
        setWaist('');
        setHips('');
        setBiceps('');
        setTransNotes('');
        setBeforePhoto(null);
        setAfterPhoto(null);
        fetchTransformations();
        fetchAIInsights();
        triggerPointsBadgeUpdate();
        alert('Transformation log saved!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Document Upload
  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!docFile) return;

    const formData = new FormData();
    formData.append('fileCategory', docCategory);
    formData.append('notes', docNotes);
    formData.append('file', docFile);

    try {
      const res = await authFetch('/api/health/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setDocNotes('');
        setDocFile(null);
        fetchDocuments();
        alert('Document uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Community Post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent) return;

    try {
      const res = await authFetch('/api/community/post', {
        method: 'POST',
        body: JSON.stringify({
          content: postContent,
          postType,
        }),
      });

      if (res.ok) {
        setPostContent('');
        fetchFeed();
        triggerPointsBadgeUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh profile points / level tags
  const triggerPointsBadgeUpdate = async () => {
    try {
      const res = await authFetch('/api/auth/profile');
      const data = await res.json();
      updateProfileLocal({
        points: data.points,
        badges: data.badges,
        wellnessLevel: data.wellnessLevel,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await authFetch(`/api/community/like/${postId}`, { method: 'POST' });
      fetchFeed();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations for total macronutrients logged today
  const calculateTotalMacros = () => {
    let cal = 0, prot = 0, carbs = 0, fat = 0;
    if (dailyLog?.mealsLogged) {
      Object.keys(dailyLog.mealsLogged).forEach((key) => {
        const meal = dailyLog.mealsLogged[key];
        if (meal.logged) {
          cal += meal.calories;
          prot += meal.protein;
          carbs += meal.carbs;
          fat += meal.fat;
        }
      });
    }
    return { cal, prot, carbs, fat };
  };

  const loggedTotals = calculateTotalMacros();

  // Filter video lists
  const filteredWorkouts = videoCategory === 'All'
    ? workouts
    : workouts.filter(w => w.category === videoCategory);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'nutrition', label: 'Nutrition & Water', icon: Flame },
    { id: 'workouts', label: 'Workout Streaming', icon: Tv },
    { id: 'transformation', label: 'Transformation', icon: Camera },
    { id: 'healthdocs', label: 'Health Locker', icon: FileText },
    { id: 'community', label: 'Social & Leaderboard', icon: Users },
    { id: 'analytics', label: 'Analytics & Graphs', icon: TrendingUp },
    { id: 'shop', label: 'Ecosystem Store', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6">
      
      {/* Upper Quick Metrics Header */}
      <div className="glass-card flex flex-wrap gap-4 justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100/50 px-3 py-2 rounded-xl border border-slate-200">
            <Calendar size={18} className="text-brand-teal" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="flex gap-6 sm:gap-8 flex-wrap">
          <div className="text-center">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Aura Score</p>
            <h3 className={`text-xl font-bold ${aiInsights?.riskIndicator === 'Green' ? 'text-emerald-500' : aiInsights?.riskIndicator === 'Yellow' ? 'text-orange-500' : 'text-red-500'}`}>
              {aiInsights?.healthScore || 70}/100
            </h3>
          </div>
          <div className="text-center pl-6 sm:pl-8 border-l border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Wellness Level</p>
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-sky/10 text-brand-sky">
              {user.wellnessLevel}
            </span>
          </div>
          <div className="text-center pl-6 sm:pl-8 border-l border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Ecosystem Points</p>
            <h3 className="text-xl font-bold text-amber-500">{user.points} XP</h3>
          </div>
        </div>
      </div>

      {/* Primary Dashboard Navigation Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-200/50 p-1 rounded-xl w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedTab === tab.id 
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

      {/* DASHBOARD TAB CONTENTS */}
      
      {/* 1. OVERVIEW TAB */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
          
          {/* Digital Membership ID Card */}
          <div className="glass-card lg:col-span-4 premium-gradient text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-white/70 mb-1">Ecosystem Identity</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">{user.name}</h3>
                <code className="text-xs font-mono text-white/80 mt-1 block">ID: {user.membershipId}</code>
              </div>
              <span className="inline-flex px-2 py-1 rounded bg-white/20 text-white text-[10px] font-bold tracking-wider backdrop-blur-sm">
                ACTIVE MEMBER
              </span>
            </div>
            
            <div className="flex gap-4 items-center mt-6 relative z-10 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              {/* Dynamic QR Code */}
              <div className="w-20 h-20 bg-white p-1 rounded-lg shadow-sm shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="25" height="25" fill="black" />
                  <rect x="8" y="8" width="19" height="19" fill="white" />
                  <rect x="11" y="11" width="13" height="13" fill="black" />
                  <rect x="70" y="5" width="25" height="25" fill="black" />
                  <rect x="73" y="8" width="19" height="19" fill="white" />
                  <rect x="76" y="11" width="13" height="13" fill="black" />
                  <rect x="5" y="70" width="25" height="25" fill="black" />
                  <rect x="8" y="73" width="19" height="19" fill="white" />
                  <rect x="11" y="76" width="13" height="13" fill="black" />
                  {user.membershipId && Array.from(user.membershipId).map((char, i) => {
                    const code = char.charCodeAt(0);
                    const col = (code % 7) * 5 + 35;
                    const row = Math.floor(i / 7) * 5 + 35;
                    return (code % 2 === 0) ? null : (
                      <rect key={i} x={col} y={row} width="4" height="4" fill="black" />
                    );
                  })}
                  {[38,43,48,53,58,38,48,58,43,53].map((x, i) => (
                    <rect key={`d${i}`} x={x} y={38 + (i % 3) * 10} width="4" height="4" fill="black" />
                  ))}
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Level Tag</p>
                <div className="text-sm font-bold text-brand-teal bg-white px-3 py-1 rounded-lg inline-block shadow-sm">
                  {user.wellnessLevel}
                </div>
                <p className="text-[10px] text-white/60 mt-2 leading-tight">Scan QR at Franchise check-in</p>
              </div>
            </div>
          </div>

          {/* Daily Challenges */}
          <div className="glass-card lg:col-span-4">
            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <CheckSquare size={20} className="text-brand-teal" />
              Daily Challenges
            </h3>
            <p className="text-xs text-slate-500 mb-5">Complete tasks to earn +10 points each.</p>
            
            <div className="space-y-3">
              {[
                { key: 'water', label: 'Hydration Target (2.5L)', sub: `${tempWater}ml / 2500ml logged` },
                { key: 'steps', label: 'Steps Target (10,000 steps)', sub: `${dailyLog?.stepCount || 0} / 10000 steps` },
                { key: 'sleep', label: 'Rest Target (7+ Hours)', sub: `${dailyLog?.sleepHours || 0} hours logged` },
                { key: 'meal', label: 'Macro Logging Completion', sub: 'Log Breakfast, Lunch, and Dinner' }
              ].map((challenge) => {
                const isCompleted = dailyLog?.challengesCompleted?.includes(challenge.key);
                return (
                  <div key={challenge.key} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-teal/30 hover:bg-slate-50 transition-colors">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${isCompleted ? 'bg-brand-teal border-brand-teal text-white' : 'bg-slate-100 border-slate-200 text-transparent'}`}>
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{challenge.label}</p>
                      <span className="text-xs text-slate-500 block mt-0.5">{challenge.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gamified Achievements Badges */}
          <div className="glass-card lg:col-span-4">
            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Award size={20} className="text-amber-500" />
              Earned Achievements
            </h3>
            <p className="text-xs text-slate-500 mb-5">Your digital reward recognition badges:</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {user.badges && user.badges.map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-xs font-semibold">
                  <Award size={12} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rewards & Certificates</h4>
              {rewards.length > 0 ? (
                <div className="space-y-2">
                  {rewards.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 bg-amber-50 rounded-xl p-3 border border-amber-100">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-700">{r.title}</p>
                        <p className="text-xs text-amber-600/70">{new Date(r.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No formal certificates yet.</p>
              )}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Daily Motivation Quote</h4>
              {quote ? (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
                  <div className="absolute top-2 left-2 text-3xl text-brand-teal/20 font-serif leading-none">"</div>
                  <p className="text-sm italic text-slate-600 relative z-10 pl-4">{quote.text}</p>
                  <p className="text-xs font-medium text-brand-teal text-right mt-2">— {quote.author}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Loading today's quote...</p>
              )}
            </div>
          </div>

          {/* Health Score & AI Intelligence Report */}
          <div className="glass-card lg:col-span-8 border-l-4 border-l-brand-teal">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <Heart size={20} className="text-brand-teal" />
                  AI Health Intelligence Insights
                </h3>
                <p className="text-xs text-slate-500">Generated comparison analysis between checkups</p>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide ${aiInsights?.riskIndicator === 'Green' ? 'bg-emerald-100 text-emerald-700' : aiInsights?.riskIndicator === 'Yellow' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                Risk: {aiInsights?.riskIndicator || 'Normal'}
              </span>
            </div>

            {aiInsights?.comparisonAvailable ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-brand-sky" /> Trending Parameters
                  </h4>
                  <ul className="space-y-2">
                    {aiInsights.insights.map((insight, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-sky shrink-0 mt-1.5"></span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-brand-teal/5 rounded-xl p-5 border border-brand-teal/10">
                  <h4 className="text-sm font-bold text-brand-teal mb-3 flex items-center gap-2">
                    <Activity size={16} /> Actionable Coaching
                  </h4>
                  <ul className="space-y-2">
                    {aiInsights.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0 mt-1.5"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100 border-dashed">
                <p className="text-sm text-slate-500">
                  {aiInsights?.summary || 'No analysis logs available. Please ask coach to fill Body Analysis or Medical Reports.'}
                </p>
              </div>
            )}
          </div>

          {/* Quick Metrics Log Forms */}
          <div className="glass-card lg:col-span-4">
            <h3 className="text-lg font-bold text-slate-800 mb-5">Daily Habits Log</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Step Count</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                    placeholder="e.g. 8000"
                    value={dailyLog?.stepCount || ''}
                    onChange={(e) => updateStepsSleep(Number(e.target.value), undefined, undefined, undefined)}
                  />
                  <span className="inline-flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 shrink-0">steps</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Sleep (Hours)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                    placeholder="e.g. 7.5"
                    value={dailyLog?.sleepHours || ''}
                    onChange={(e) => updateStepsSleep(undefined, Number(e.target.value), undefined, undefined)}
                  />
                  <span className="inline-flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 shrink-0">hours</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Meditation (Minutes)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                    placeholder="e.g. 15"
                    value={dailyLog?.meditationMinutes || ''}
                    onChange={(e) => updateStepsSleep(undefined, undefined, Number(e.target.value), undefined)}
                  />
                  <span className="inline-flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 shrink-0">mins</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Yoga (Minutes)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                    placeholder="e.g. 30"
                    value={dailyLog?.yogaMinutes || ''}
                    onChange={(e) => updateStepsSleep(undefined, undefined, undefined, Number(e.target.value))}
                  />
                  <span className="inline-flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 shrink-0">mins</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Daily Habits</label>
                <div className="flex flex-wrap gap-2">
                  {['Read 10 Pages', 'No Sugar', 'Cold Shower', 'Journaling'].map(habit => {
                    const isActive = dailyLog?.habits?.includes(habit);
                    return (
                      <button 
                        key={habit}
                        onClick={() => toggleHabit(habit)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isActive ? 'bg-brand-teal text-white border-brand-teal' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-teal'}`}
                      >
                        {habit}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. NUTRITION & WATER TAB */}
      {selectedTab === 'nutrition' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
          
          {/* AI Diet Generator Widget */}
          <div className="glass-card lg:col-span-12 border-brand-teal/30 bg-gradient-to-r from-brand-teal/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-teal text-white p-2 rounded-lg shadow-md">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">AI Diet & Macro Generator</h3>
                <p className="text-sm text-slate-500">Enter your weight and goal. Our AI will mathematically compute your optimal macros and generate a daily plan.</p>
              </div>
            </div>
            
            <form onSubmit={handleGenerateAIDietPlan} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-white/60 p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-full md:w-1/3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Weight (KG)</label>
                <input 
                  type="number" 
                  step="0.1"
                  required
                  placeholder="e.g. 75"
                  className="w-full border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-brand-teal focus:ring-brand-teal"
                  value={aiCurrentWeight}
                  onChange={(e) => setAiCurrentWeight(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fitness Goal</label>
                <select 
                  className="w-full border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-brand-teal focus:ring-brand-teal"
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                >
                  <option value="lose">Weight Loss (Deficit)</option>
                  <option value="maintain">Maintain Current Weight</option>
                  <option value="gain">Muscle Gain (Surplus)</option>
                </select>
              </div>
              <div className="w-full md:w-1/3">
                <button 
                  type="submit" 
                  disabled={isGeneratingPlan}
                  className="w-full premium-gradient text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isGeneratingPlan ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Daily Tracker Rings */}
          <div className="glass-card lg:col-span-4">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Droplet size={20} className="text-brand-sky" />
              Smart Water Hydration
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center bg-brand-sky/5 rounded-full border-[8px] border-slate-50 mb-6 shadow-inner">
                <div className="text-center z-10">
                  <h1 className="text-4xl font-black text-brand-sky tracking-tighter">{tempWater}</h1>
                  <span className="text-sm font-medium text-slate-500">ml / {dailyLog?.waterGoal || 2500}</span>
                </div>
                <svg viewBox="0 0 192 192" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                   <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-sky/20" />
                   <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${Math.min(100, (tempWater / (dailyLog?.waterGoal || 2500)) * 100) * 5.5} 600`} className="text-brand-sky drop-shadow" strokeLinecap="round" />
                </svg>
              </div>
              
              <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Water Streak</p>
                  <p className="text-sm font-medium text-slate-700">Hit target 3 days for a reward!</p>
                </div>
                <Award className={user.badges?.includes('Water Streak Master') ? 'text-brand-sky' : 'text-slate-300'} />
              </div>
              
              <div className="grid grid-cols-3 gap-2 w-full mb-4">
                <button onClick={() => addWater(250)} className="bg-slate-50 hover:bg-brand-sky/10 text-slate-600 hover:text-brand-sky border border-slate-200 rounded-xl py-3 text-xs font-semibold transition-colors flex flex-col items-center gap-1">
                  <Droplet size={14} /> +250ml
                </button>
                <button onClick={() => addWater(500)} className="bg-slate-50 hover:bg-brand-sky/10 text-slate-600 hover:text-brand-sky border border-slate-200 rounded-xl py-3 text-xs font-semibold transition-colors flex flex-col items-center gap-1">
                  <Droplet size={16} /> +500ml
                </button>
                <button onClick={() => addWater(1000)} className="bg-slate-50 hover:bg-brand-sky/10 text-slate-600 hover:text-brand-sky border border-slate-200 rounded-xl py-3 text-xs font-semibold transition-colors flex flex-col items-center gap-1">
                  <Droplet size={18} /> +1.0L
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center uppercase tracking-wider">Streak targets reset daily.</p>
            </div>
          </div>

          {/* Calorie & Macro Target Progress */}
          <div className="glass-card lg:col-span-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Calorie & Macronutrient Intake</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-800/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 relative z-10">Calories</p>
                <h2 className="text-2xl font-black text-slate-800 relative z-10">{loggedTotals.cal} <span className="text-sm font-medium text-slate-400">kcal</span></h2>
              </div>
              <div className="bg-brand-teal/5 rounded-2xl p-4 border border-brand-teal/10 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-teal/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <p className="text-xs font-semibold text-brand-teal/70 uppercase tracking-widest mb-2 relative z-10">Protein</p>
                <h2 className="text-2xl font-black text-brand-teal relative z-10">{loggedTotals.prot}g</h2>
              </div>
              <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <p className="text-xs font-semibold text-amber-600/70 uppercase tracking-widest mb-2 relative z-10">Carbs</p>
                <h2 className="text-2xl font-black text-amber-500 relative z-10">{loggedTotals.carbs}g</h2>
              </div>
              <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/10 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <p className="text-xs font-semibold text-red-600/70 uppercase tracking-widest mb-2 relative z-10">Fat</p>
                <h2 className="text-2xl font-black text-red-500 relative z-10">{loggedTotals.fat}g</h2>
              </div>
            </div>

            {/* My Meal Plan */}
            {mealPlans.length > 0 && (
              <div className="mt-8 bg-brand-teal/5 rounded-2xl p-5 border border-brand-teal/20">
                <h3 className="text-md font-bold text-brand-teal mb-4 flex items-center gap-2">
                  <BookOpen size={18} /> Coach Assigned Meal Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
                    mealPlans[0].meals[meal] && mealPlans[0].meals[meal].length > 0 && (
                      <div key={meal} className="bg-white rounded-xl p-3 border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{meal}</p>
                        {mealPlans[0].meals[meal].map((m, i) => (
                          <div key={i}>
                            <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                            <p className="text-xs text-slate-500">{m.description}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-1">{m.calories} cal | P: {m.protein}g | C: {m.carbs}g | F: {m.fat}g</p>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                  {mealPlans[0].detoxDrinks && mealPlans[0].detoxDrinks.length > 0 && (
                      <div className="bg-white rounded-xl p-3 border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detox Drinks</p>
                        {mealPlans[0].detoxDrinks.map((m, i) => (
                          <div key={i}>
                            <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                            <p className="text-xs text-slate-500">{m.description}</p>
                            <p className="text-[10px] font-mono text-brand-teal mt-1">{m.timeToConsume}</p>
                          </div>
                        ))}
                      </div>
                  )}
                </div>
              </div>
            )}

            {/* List logged meals */}
            <h4 className="text-sm font-bold text-slate-700 mt-8 mb-3">Today's Log</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Meal</th>
                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Items</th>
                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Cals</th>
                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Macros</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {dailyLog?.mealsLogged && Object.keys(dailyLog.mealsLogged).map((key) => {
                    const meal = dailyLog.mealsLogged[key];
                    return meal.logged ? (
                      <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 capitalize">{key}</td>
                        <td className="py-3 px-4 text-slate-600">{meal.name}</td>
                        <td className="py-3 px-4 font-medium text-slate-700">{meal.calories} kcal</td>
                        <td className="py-3 px-4">
                          <span className="text-brand-teal font-medium">{meal.protein}g P</span> <span className="text-slate-300">•</span>{' '}
                          <span className="text-amber-500 font-medium">{meal.carbs}g C</span> <span className="text-slate-300">•</span>{' '}
                          <span className="text-red-500 font-medium">{meal.fat}g F</span>
                        </td>
                      </tr>
                    ) : (
                      <tr key={key} className="border-b border-slate-100 last:border-0 text-slate-400">
                        <td className="py-3 px-4 capitalize font-medium">{key}</td>
                        <td className="py-3 px-4 italic">Not logged</td>
                        <td className="py-3 px-4">--</td>
                        <td className="py-3 px-4">--</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Meal Entry */}
          <div className="glass-card lg:col-span-7">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Log Meal Entry</h3>
            <form onSubmit={handleMealSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Meal Category</label>
                  <select value={mealCategory} onChange={(e) => setMealCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                    <option value="detoxDrinks">Detox Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Meal Description</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                    placeholder="e.g. Scrambled eggs + rye toast"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Cals</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={mealCal} onChange={(e) => setMealCal(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-teal uppercase tracking-wider mb-1.5">Protein(g)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={mealProt} onChange={(e) => setMealProt(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1.5">Carbs(g)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={mealCarbs} onChange={(e) => setMealCarbs(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-red-500 uppercase tracking-wider mb-1.5">Fat(g)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={mealFat} onChange={(e) => setMealFat(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="w-full mt-2 premium-gradient text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                Add Meal to Log
              </button>
            </form>
          </div>

          {/* Dynamic Personalized Wellness Recommendations */}
          <div className="glass-card lg:col-span-5 bg-gradient-to-br from-slate-50 to-brand-teal/5">
            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Compass size={20} className="text-brand-teal" />
              Personalized Tips
            </h3>
            <p className="text-xs text-slate-500 mb-5">Based on your latest health data & logs.</p>
            <div className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((rec, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-brand-teal/10 shadow-sm">
                    <h4 className="text-sm font-bold text-brand-teal mb-1">{rec.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{rec.body}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Activity size={24} className="text-slate-300 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-slate-400">Loading personalized tips...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. WORKOUT VIDEO STREAMING */}
      {selectedTab === 'workouts' && (
        <div className="animate-in fade-in duration-500 space-y-6">
          {programs.length > 0 && (
            <div className="glass-card bg-brand-teal/5 border-brand-teal/20">
              <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Calendar size={20} className="text-brand-teal" />
                Your Structured Program: {programs[0].title}
              </h3>
              <p className="text-xs text-slate-500 mb-4">{programs[0].category} - {programs[0].level} {programs[0].mode ? `(${programs[0].mode})` : ''}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {programs[0].schedule.map((day, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${day.completed ? 'bg-brand-teal/10 border-brand-teal text-brand-teal' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase">Day {day.dayNumber}</span>
                      {day.completed && <CheckCircle2 size={16} />}
                    </div>
                    <p className={`text-sm font-bold ${day.completed ? 'text-brand-teal' : 'text-slate-700'}`}>{day.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Video Library</h3>
            <div className="flex space-x-2 overflow-x-auto pb-4 mb-2">
              {['All', 'Fat Loss', 'Muscle Gain', 'Yoga & Breathing', 'Meditation'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setVideoCategory(cat)} 
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  videoCategory === cat 
                    ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-teal/50 hover:text-brand-teal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div key={workout._id} className="glass-card group overflow-hidden flex flex-col p-0">
                  <div className="relative w-full aspect-video bg-slate-900">
                    <iframe
                      title={workout.title}
                      src={workout.videoUrl}
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex px-2.5 py-1 rounded bg-brand-sky/10 text-brand-sky text-[10px] font-bold uppercase tracking-wider">
                        {workout.category}
                      </span>
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded flex items-center gap-1">
                        <Calendar size={12} /> Day {workout.day}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-brand-teal transition-colors">{workout.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{workout.description}</p>
                    <div className="mt-auto flex items-center gap-4 text-xs font-medium text-slate-400 pt-4 border-t border-slate-100">
                      <span className="flex items-center gap-1"><Tv size={14} /> {workout.duration} mins</span>
                      <span className="flex items-center gap-1"><Activity size={14} /> {workout.level}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full glass-card text-center py-12">
                <Tv size={48} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No workouts found</h3>
                <p className="text-sm text-slate-500">Try selecting a different category.</p>
              </div>
            )}
          </div>
          </div>
        </div>
      )}

      {/* 4. TRANSFORMATION TAB */}
      {selectedTab === 'transformation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
          
          {/* Historical progression charts */}
          <div className="glass-card lg:col-span-7">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Weight Tracking & Dimension Trends</h3>
            <p className="text-xs text-slate-500 mb-6">Tracking your bi-weekly changes.</p>
            
            <div className="h-64 flex items-end gap-2 border-b border-slate-200 pb-2 relative px-4">
              {transformations.length > 0 ? (
                transformations.map((trans, idx) => {
                  const maxWeight = Math.max(...transformations.map(t => t.weight), 100);
                  const barHeight = (trans.weight / maxWeight) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                        {trans.weight} kg
                      </div>
                      <div className="w-full max-w-[40px] bg-brand-teal/80 hover:bg-brand-teal rounded-t-sm transition-all" style={{ height: `${barHeight}%` }}></div>
                      <span className="text-[10px] text-slate-400 mt-2 rotate-45 origin-left whitespace-nowrap">
                        {new Date(trans.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm italic">
                  No transformation logs. Enter weight below to draw chart.
                </div>
              )}
            </div>

            <div className="mt-12">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Transformation History Entries</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Weight</th>
                      <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Measurements (C/W/H/B)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {transformations.map((trans, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-600">{new Date(trans.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-bold text-brand-teal">{trans.weight} kg</td>
                        <td className="py-3 px-4 text-slate-500">{trans.chest || '--'}" / {trans.waist || '--'}" / {trans.hips || '--'}" / {trans.biceps || '--'}"</td>
                      </tr>
                    ))}
                    {transformations.length === 0 && (
                      <tr><td colSpan="3" className="py-4 text-center text-slate-400">No logs found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add progression details */}
          <div className="glass-card lg:col-span-5">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Record Weight & Body Specs</h3>
            <form onSubmit={handleTransformationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Body Weight (kg)</label>
                <div className="relative">
                  <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all font-bold text-brand-teal text-lg" placeholder="e.g. 78.5" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">kg</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Chest (in)</label>
                  <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="40" value={chest} onChange={(e) => setChest(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Waist (in)</label>
                  <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="32" value={waist} onChange={(e) => setWaist(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Hips (in)</label>
                  <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="38" value={hips} onChange={(e) => setHips(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Biceps (in)</label>
                  <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="14.5" value={biceps} onChange={(e) => setBiceps(e.target.value)} />
                </div>
              </div>

              {/* Photo Selectors */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Before Photo</label>
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-100 hover:border-brand-teal cursor-pointer transition-colors overflow-hidden group">
                    {beforePhoto ? (
                      <span className="text-xs text-brand-teal font-medium truncate px-2">{beforePhoto.name}</span>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-brand-teal">
                        <Camera size={20} className="mb-1" />
                        <span className="text-[10px] font-medium">Upload</span>
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={(e) => setBeforePhoto(e.target.files[0])} accept="image/*" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">After Photo</label>
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-100 hover:border-brand-teal cursor-pointer transition-colors overflow-hidden group">
                    {afterPhoto ? (
                      <span className="text-xs text-brand-teal font-medium truncate px-2">{afterPhoto.name}</span>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-brand-teal">
                        <Camera size={20} className="mb-1" />
                        <span className="text-[10px] font-medium">Upload</span>
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={(e) => setAfterPhoto(e.target.files[0])} accept="image/*" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Progress Notes</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all min-h-[80px]" 
                  placeholder="Describe muscle soreness or diet adherence details..." 
                  value={transNotes} 
                  onChange={(e) => setTransNotes(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="w-full premium-gradient text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2 mt-2">
                <Upload size={18} /> Submit Progress Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. HEALTH DOCS LOCKER */}
      {selectedTab === 'healthdocs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
          
          {/* Documents Upload Panel */}
          <div className="glass-card lg:col-span-4">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Upload Health Documents</h3>
            <p className="text-xs text-slate-500 mb-6">Store medical lab reports securely.</p>
            <form onSubmit={handleDocSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Report Category</label>
                <select value={docCategory} onChange={(e) => setDocCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all">
                  <option value="Blood Report">Blood Report</option>
                  <option value="Full Body Checkup">Full Body Checkup</option>
                  <option value="X-Ray / ECG">X-Ray / ECG</option>
                  <option value="Vitamin Report">Vitamin Report</option>
                  <option value="Sugar / BP / Thyroid">Sugar / BP / Thyroid</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Lab File (PDF or Image)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-brand-teal transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-1 text-sm text-slate-500"><span className="font-semibold text-brand-teal">Click to upload</span></p>
                      <p className="text-xs text-slate-400">PDF, PNG, JPG</p>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => setDocFile(e.target.files[0])} required />
                  </label>
                </div>
                {docFile && <p className="text-xs text-brand-teal mt-2 truncate font-medium">Selected: {docFile.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Description Notes</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-teal transition-all" 
                  placeholder="e.g. Lab checkup report from City Labs." 
                  value={docNotes} 
                  onChange={(e) => setDocNotes(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
                <Upload size={16} /> Upload Securely
              </button>
            </form>
          </div>

          {/* Files List Locker */}
          <div className="glass-card lg:col-span-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Secure Health Locker Files</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">File</th>
                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {documents.length > 0 ? (
                    documents.map((doc, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">{doc.fileCategory}</span>
                        </td>
                        <td className="py-3 px-4">
                          <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="text-brand-sky hover:text-brand-sky/80 font-medium flex items-center gap-1">
                            <FileText size={14} /> View Document
                          </a>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">{doc.notes || '--'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center">
                         <FileText size={48} className="text-slate-200 mx-auto mb-3" />
                         <p className="text-slate-500 font-medium">No files in secure storage.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. SOCIAL & LEADERBOARD TAB */}
      {selectedTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
          
          {/* Scrolling Feed posting */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Create Post */}
            <div className="glass-card p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Share Progress / Motivation</h3>
              <form onSubmit={handlePostSubmit}>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all mb-3 min-h-[100px] resize-y"
                  placeholder="Inspire the community! e.g. Just completed my day 3 push training!"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                ></textarea>
                <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3">
                  <select value={postType} onChange={(e) => setPostType(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal text-slate-600 font-medium w-full sm:w-auto">
                    <option value="Post">Regular Post</option>
                    <option value="SuccessStory">Success Story</option>
                    <option value="MotivationalQuote">Motivational Quote</option>
                  </select>
                  <button type="submit" className="premium-gradient text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap w-full sm:w-auto">
                    Share Post
                  </button>
                </div>
              </form>
            </div>

            {/* Scrolling Feed list */}
            <div className="space-y-4">
              {feed.map((post) => (
                <div key={post._id} className="glass-card p-5 hover:border-brand-teal/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-bold uppercase shrink-0">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 leading-tight">{post.authorName}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{post.authorRole}</span>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${post.postType === 'SuccessStory' ? 'bg-emerald-100 text-emerald-700' : post.postType === 'MotivationalQuote' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {post.postType}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 mb-4 whitespace-pre-wrap">{post.content}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <button 
                      onClick={() => handleLike(post._id)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-brand-sky hover:bg-brand-sky/5 transition-colors"
                    >
                      <Heart size={16} className={post.likes?.includes(user._id) ? "fill-brand-sky text-brand-sky" : ""} /> 
                      {post.likes?.length || 0}
                    </button>
                    <span className="text-xs text-slate-400 font-medium">{post.comments?.length || 0} comments</span>
                  </div>
                  
                  {/* Render comments */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {post.comments.map((comment, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="font-bold text-slate-700 text-xs shrink-0">{comment.userName}:</span>
                          <span className="text-slate-600 text-xs">{comment.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {feed.length === 0 && (
                <div className="text-center py-8 text-slate-500 glass-card">
                  No posts yet. Be the first to share!
                </div>
              )}
            </div>
          </div>

          {/* Gamified Leaderboard */}
          <div className="glass-card lg:col-span-4 h-fit">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Award size={20} className="text-amber-500" /> Leaderboard
            </h3>
            <p className="text-xs text-slate-500 mb-5">Rankings by ecosystem points.</p>
            
            <div className="flex flex-col gap-3">
              {leaderboard.map((usr, i) => {
                const isCurrentUser = usr._id === user._id;
                return (
                  <div 
                    key={usr._id} 
                    className={`flex justify-between items-center p-3 rounded-xl border ${
                      isCurrentUser 
                        ? 'bg-brand-teal/5 border-brand-teal shadow-sm shadow-brand-teal/10' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 text-center font-bold text-sm ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-slate-300'}`}>
                        #{i + 1}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase shrink-0">
                        {usr.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isCurrentUser ? 'text-brand-teal' : 'text-slate-700'}`}>{usr.name}</p>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{usr.wellnessLevel}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-amber-500 font-bold">{usr.points}</strong>
                      <span className="text-[10px] text-slate-400 block -mt-1 font-medium">XP</span>
                    </div>
                  </div>
                );
              })}
              {leaderboard.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No rankings available yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 6. ANALYTICS & GRAPHS TAB */}
      {selectedTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weight Progress Graph */}
            <div className="glass-card">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Weight & Fat Loss Progress</h3>
              <div className="h-72 w-full">
                {graphData?.bodyAnalysis?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={graphData.bodyAnalysis} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} domain={['dataMin - 5', 'dataMax + 5']} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={10} domain={['dataMin - 2', 'dataMax + 2']} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                      <Area yAxisId="right" type="monotone" dataKey="bodyFat" name="Body Fat (%)" stroke="#F59E0B" strokeWidth={3} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No body analysis data available.</div>
                )}
              </div>
            </div>

            {/* Medical Metrics Graph */}
            <div className="glass-card">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Blood Pressure & Sugar Trends</h3>
              <div className="h-72 w-full">
                {graphData?.medicalReports?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData.medicalReports} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      <Bar dataKey="bpSystolic" name="BP Systolic" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sugar" name="Fasting Sugar" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No medical reports available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ECOSYSTEM STORE */}
      {selectedTab === 'shop' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {products.map(product => (
            <div key={product._id} className="glass-card flex flex-col p-0 overflow-hidden group">
              <div className="h-40 bg-slate-100 flex items-center justify-center p-6 relative">
                <ShoppingBag size={48} className="text-slate-300 group-hover:text-brand-teal transition-colors" />
                <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-wider shadow-sm">
                  {product.type}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{product.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{product.description}</p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-brand-teal">₹{product.price}</span>
                  <button className="bg-slate-900 hover:bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
             <div className="col-span-full text-center py-12 text-slate-500 glass-card">
               Store is currently empty.
             </div>
          )}
        </div>
      )}

      {/* Water Reminder Toast */}
      {showWaterReminder && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="glass-card premium-gradient text-white p-5 shadow-2xl flex items-start gap-4 border border-white/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Droplet size={20} className="text-white fill-white/50" />
            </div>
            <div className="flex-1 pr-6">
              <h4 className="text-sm font-bold tracking-wide mb-1 flex items-center gap-2">
                <Bell size={14} className="animate-pulse" /> Hydration Reminder
              </h4>
              <p className="text-xs text-white/80 mb-3">
                You're falling behind your {dailyLog?.waterGoal || 2500}ml goal. Time for a quick drink!
              </p>
              <button
                onClick={() => {
                  addWater(250);
                  setShowWaterReminder(false);
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full border border-white/10 text-center"
              >
                +250ml Log Now
              </button>
            </div>
            <button
              onClick={() => setShowWaterReminder(false)}
              className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
