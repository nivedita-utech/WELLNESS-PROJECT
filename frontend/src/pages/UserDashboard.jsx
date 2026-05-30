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
  Compass as CalmIcon
} from 'lucide-react';

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
  
  // Hydration state
  const [tempWater, setTempWater] = useState(0);

  // Meal Log State
  const [mealCategory, setMealCategory] = useState('breakfast');
  const [mealName, setMealName] = useState('');
  const [mealCal, setMealCal] = useState(0);
  const [mealProt, setMealProt] = useState(0);
  const [mealCarbs, setMealCarbs] = useState(0);
  const [mealFat, setMealFat] = useState(0);

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
  }, [date]);

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
      setWorkouts(data);
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

  // Log water increments
  const addWater = async (amount) => {
    const updatedWater = tempWater + amount;
    setTempWater(updatedWater);
    
    try {
      const res = await authFetch('/api/wellness/daily-log', {
        method: 'POST',
        body: JSON.stringify({
          date,
          waterIntake: updatedWater,
          waterGoal: dailyLog?.waterGoal || 2500,
          sleepHours: dailyLog?.sleepHours || 0,
          meditationMinutes: dailyLog?.meditationMinutes || 0,
          stepCount: dailyLog?.stepCount || 0,
          mealsLogged: dailyLog?.mealsLogged,
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
  const updateStepsSleep = async (steps, sleep, meditation) => {
    try {
      const res = await authFetch('/api/wellness/daily-log', {
        method: 'POST',
        body: JSON.stringify({
          date,
          waterIntake: dailyLog?.waterIntake || 0,
          waterGoal: dailyLog?.waterGoal || 2500,
          sleepHours: sleep !== undefined ? sleep : dailyLog?.sleepHours || 0,
          meditationMinutes: meditation !== undefined ? meditation : dailyLog?.meditationMinutes || 0,
          stepCount: steps !== undefined ? steps : dailyLog?.stepCount || 0,
          mealsLogged: dailyLog?.mealsLogged,
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
          stepCount: dailyLog?.stepCount || 0,
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

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Upper Quick Metrics Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="progress-ring-section">
            <Calendar size={18} color="var(--accent-emerald)" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
              style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-primary)', fontSize: '0.85rem' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Aura Score</p>
            <h3 style={{ color: aiInsights?.riskIndicator === 'Green' ? 'var(--status-green)' : aiInsights?.riskIndicator === 'Yellow' ? 'var(--status-yellow)' : 'var(--status-red)' }}>
              {aiInsights?.healthScore || 70}/100
            </h3>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Wellness Level</p>
            <span className="status-pill status-green-tag" style={{ marginTop: '0.2rem' }}>{user.wellnessLevel}</span>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ecosystem Points</p>
            <h3 style={{ color: 'var(--accent-gold)' }}>{user.points} XP</h3>
          </div>
        </div>
      </div>

      {/* Primary Dashboard Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button onClick={() => setSelectedTab('overview')} className={`btn ${selectedTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Activity size={16} /> Overview
        </button>
        <button onClick={() => setSelectedTab('nutrition')} className={`btn ${selectedTab === 'nutrition' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Flame size={16} /> Nutrition & Water
        </button>
        <button onClick={() => setSelectedTab('workouts')} className={`btn ${selectedTab === 'workouts' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Tv size={16} /> Workout Streaming
        </button>
        <button onClick={() => setSelectedTab('transformation')} className={`btn ${selectedTab === 'transformation' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Camera size={16} /> Transformation
        </button>
        <button onClick={() => setSelectedTab('healthdocs')} className={`btn ${selectedTab === 'healthdocs' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <FileText size={16} /> Health Locker
        </button>
        <button onClick={() => setSelectedTab('community')} className={`btn ${selectedTab === 'community' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Users size={16} /> Social & Leaderboard
        </button>
      </div>

      {/* DASHBOARD TAB CONTENTS */}
      
      {/* 1. OVERVIEW TAB */}
      {selectedTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Digital Membership ID Card */}
          <div className="card membership-card" style={{ gridColumn: 'span 4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Ecosystem Identity</p>
                <h3 style={{ margin: '0.2rem 0' }}>{user.name}</h3>
                <code style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>ID: {user.membershipId}</code>
              </div>
              <span className="status-pill status-green-tag">ACTIVE MEMBER</span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              {/* Dynamic QR Code — encodes membershipId as a grid pattern using modular arithmetic */}
              <div className="qr-placeholder">
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <rect width="100" height="100" fill="white" />
                  {/* Position Detection Patterns */}
                  <rect x="5" y="5" width="25" height="25" fill="black" />
                  <rect x="8" y="8" width="19" height="19" fill="white" />
                  <rect x="11" y="11" width="13" height="13" fill="black" />
                  <rect x="70" y="5" width="25" height="25" fill="black" />
                  <rect x="73" y="8" width="19" height="19" fill="white" />
                  <rect x="76" y="11" width="13" height="13" fill="black" />
                  <rect x="5" y="70" width="25" height="25" fill="black" />
                  <rect x="8" y="73" width="19" height="19" fill="white" />
                  <rect x="11" y="76" width="13" height="13" fill="black" />
                  {/* Data modules — encoded from membershipId character codes */}
                  {user.membershipId && Array.from(user.membershipId).map((char, i) => {
                    const code = char.charCodeAt(0);
                    const col = (code % 7) * 5 + 35;
                    const row = Math.floor(i / 7) * 5 + 35;
                    return (code % 2 === 0) ? null : (
                      <rect key={i} x={col} y={row} width="4" height="4" fill="black" />
                    );
                  })}
                  {/* Extra data fill modules */}
                  {[38,43,48,53,58,38,48,58,43,53].map((x, i) => (
                    <rect key={`d${i}`} x={x} y={38 + (i % 3) * 10} width="4" height="4" fill="black" />
                  ))}
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Level Tag</p>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', border: '1px solid var(--accent-emerald)', padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.25rem' }}>
                  {user.wellnessLevel}
                </div>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Scan QR at Franchise check-in</p>
              </div>
            </div>
          </div>

          {/* Daily Challenges */}
          <div className="card" style={{ gridColumn: 'span 4' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckSquare size={20} color="var(--accent-emerald)" />
              Daily Challenges
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Complete tasks to earn +10 points each.</p>
            
            <div className="checklist-item">
              <div className={`checkbox-custom ${dailyLog?.challengesCompleted?.includes('water') ? 'checked' : ''}`}>
                ✓
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', textDecoration: dailyLog?.challengesCompleted?.includes('water') ? 'line-through' : 'none' }}>Hydration Target (2.5L)</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tempWater}ml / 2500ml logged</span>
              </div>
            </div>

            <div className="checklist-item">
              <div className={`checkbox-custom ${dailyLog?.challengesCompleted?.includes('steps') ? 'checked' : ''}`}>
                ✓
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', textDecoration: dailyLog?.challengesCompleted?.includes('steps') ? 'line-through' : 'none' }}>Steps Target (10,000 steps)</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{dailyLog?.stepCount || 0} / 10000 steps</span>
              </div>
            </div>

            <div className="checklist-item">
              <div className={`checkbox-custom ${dailyLog?.challengesCompleted?.includes('sleep') ? 'checked' : ''}`}>
                ✓
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', textDecoration: dailyLog?.challengesCompleted?.includes('sleep') ? 'line-through' : 'none' }}>Rest Target (7+ Hours)</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{dailyLog?.sleepHours || 0} hours logged</span>
              </div>
            </div>

            <div className="checklist-item">
              <div className={`checkbox-custom ${dailyLog?.challengesCompleted?.includes('meal') ? 'checked' : ''}`}>
                ✓
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', textDecoration: dailyLog?.challengesCompleted?.includes('meal') ? 'line-through' : 'none' }}>Macro Logging Completion</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Log Breakfast, Lunch, and Dinner</span>
              </div>
            </div>
          </div>

          {/* Gamified Achievements Badges */}
          <div className="card" style={{ gridColumn: 'span 4' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Award size={20} color="var(--accent-gold)" />
              Earned Achievements
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your digital reward recognition badges:</p>
            <div className="badges-grid">
              {user.badges && user.badges.map((badge, i) => (
                <div key={i} className="badge-item">
                  <Award size={12} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Daily Motivation Quote</h4>
              {quote ? (
                <>
                  <p style={{ fontStyle: 'italic', fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    "{quote.text}"
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: '0.4rem', textAlign: 'right' }}>— {quote.author}</p>
                </>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Loading today's quote...</p>
              )}
            </div>
          </div>

          {/* Health Score & AI Intelligence Report */}
          <div className="card card-glowing-violet" style={{ gridColumn: 'span 8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={20} color="var(--accent-violet)" />
                  AI Health Intelligence Insights
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Generated comparison analysis between checkups</p>
              </div>
              <span className={`status-pill ${aiInsights?.riskIndicator === 'Green' ? 'status-green-tag' : aiInsights?.riskIndicator === 'Yellow' ? 'status-yellow-tag' : 'status-red-tag'}`}>
                Risk Level: {aiInsights?.riskIndicator || 'Normal'}
              </span>
            </div>

            {aiInsights?.comparisonAvailable ? (
              <div className="ai-insight-box">
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--accent-violet)' }}>Trending Parameters Summary:</h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  {aiInsights.insights.map((insight, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{insight}</li>
                  ))}
                </ul>

                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--accent-emerald)' }}>AI Actionable Coaching Advice:</h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {aiInsights.recommendations.map((rec, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {aiInsights?.summary || 'No analysis logs available. Please ask coach to fill Body Analysis or Medical Reports.'}
              </p>
            )}
          </div>

          {/* Quick Metrics Log Forms */}
          <div className="card" style={{ gridColumn: 'span 4' }}>
            <h3 style={{ marginBottom: '1rem' }}>Daily Habits Log</h3>
            <div className="form-group">
              <label className="form-label">Step Count</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 8000"
                  value={dailyLog?.stepCount || ''}
                  onChange={(e) => updateStepsSleep(Number(e.target.value), undefined, undefined)}
                  style={{ flexGrow: 1 }}
                />
                <span className="btn btn-secondary" style={{ padding: '0.5rem' }}>steps</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Sleep (Hours)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  step="0.5"
                  className="form-control"
                  placeholder="e.g. 7.5"
                  value={dailyLog?.sleepHours || ''}
                  onChange={(e) => updateStepsSleep(undefined, Number(e.target.value), undefined)}
                  style={{ flexGrow: 1 }}
                />
                <span className="btn btn-secondary" style={{ padding: '0.5rem' }}>hours</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Meditation (Minutes)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 15"
                  value={dailyLog?.meditationMinutes || ''}
                  onChange={(e) => updateStepsSleep(undefined, undefined, Number(e.target.value))}
                  style={{ flexGrow: 1 }}
                />
                <span className="btn btn-secondary" style={{ padding: '0.5rem' }}>mins</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. NUTRITION & WATER TAB */}
      {selectedTab === 'nutrition' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Daily Tracker Rings */}
          <div className="card" style={{ gridColumn: 'span 4' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Droplet size={20} color="var(--accent-emerald)" />
              Smart Water Hydration
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem 0' }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--accent-emerald)' }}>{tempWater} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>ml</span></h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Goal: {dailyLog?.waterGoal || 2500} ml</p>
              </div>
              <div className="progress-track" style={{ height: '12px' }}>
                <div className="progress-bar" style={{ width: `${Math.min(100, (tempWater / (dailyLog?.waterGoal || 2500)) * 100)}%` }}></div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button onClick={() => addWater(250)} className="btn btn-secondary" style={{ flexGrow: 1, padding: '0.5rem' }}>+250ml (Glass)</button>
                <button onClick={() => addWater(500)} className="btn btn-secondary" style={{ flexGrow: 1, padding: '0.5rem' }}>+500ml (Bottle)</button>
                <button onClick={() => addWater(1000)} className="btn btn-secondary" style={{ flexGrow: 1, padding: '0.5rem' }}>+1.0L (Shaker)</button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>*Streak targets reset daily. Maintain 2500ml+ for streak rewards.</p>
            </div>
          </div>

          {/* Calorie & Macro Target Progress */}
          <div className="card" style={{ gridColumn: 'span 8' }}>
            <h3>Calorie & Macronutrient Intake</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Calories logged</p>
                <h2>{loggedTotals.cal} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>kcal</span></h2>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Protein</p>
                <h2 style={{ color: 'var(--accent-emerald)' }}>{loggedTotals.prot}g</h2>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Carbohydrates</p>
                <h2 style={{ color: 'var(--accent-gold)' }}>{loggedTotals.carbs}g</h2>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fat</p>
                <h2 style={{ color: 'var(--status-red)' }}>{loggedTotals.fat}g</h2>
              </div>
            </div>

            {/* List logged meals */}
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Meal Category</th>
                    <th>Meal Items Name</th>
                    <th>Calories</th>
                    <th>Macros (P / C / F)</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyLog?.mealsLogged && Object.keys(dailyLog.mealsLogged).map((key) => {
                    const meal = dailyLog.mealsLogged[key];
                    return meal.logged ? (
                      <tr key={key}>
                        <td style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</td>
                        <td>{meal.name}</td>
                        <td>{meal.calories} kcal</td>
                        <td>{meal.protein}g / {meal.carbs}g / {meal.fat}g</td>
                      </tr>
                    ) : (
                      <tr key={key} style={{ color: 'var(--text-muted)' }}>
                        <td style={{ textTransform: 'capitalize' }}>{key}</td>
                        <td>Not logged yet</td>
                        <td>--</td>
                        <td>--</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Meal Entry */}
          <div className="card" style={{ gridColumn: 'span 7' }}>
            <h3>Log Daily Meal Entry</h3>
            <form onSubmit={handleMealSubmit} style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Meal Category</label>
                  <select value={mealCategory} onChange={(e) => setMealCategory(e.target.value)} className="form-control">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Meal Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Scrambled eggs + rye toast"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Calories</label>
                  <input type="number" className="form-control" value={mealCal} onChange={(e) => setMealCal(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Protein (g)</label>
                  <input type="number" className="form-control" value={mealProt} onChange={(e) => setMealProt(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Carbs (g)</label>
                  <input type="number" className="form-control" value={mealCarbs} onChange={(e) => setMealCarbs(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fat (g)</label>
                  <input type="number" className="form-control" value={mealFat} onChange={(e) => setMealFat(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Meal to Log</button>
            </form>
          </div>

          {/* Dynamic Personalized Wellness Recommendations */}
          <div className="card card-glowing-emerald" style={{ gridColumn: 'span 5' }}>
            <h3>Personalized Wellness Tips</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Based on your latest health data & daily logs.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendations.length > 0 ? (
                recommendations.map((rec, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', marginBottom: '0.2rem' }}>{rec.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec.body}</p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading personalized tips...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. WORKOUT VIDEO STREAMING */}
      {selectedTab === 'workouts' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['All', 'Fat Loss', 'Muscle Gain', 'Yoga & Breathing', 'Meditation'].map((cat) => (
              <button key={cat} onClick={() => setVideoCategory(cat)} className={`btn ${videoCategory === cat ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div key={workout._id} className="card card-glowing-emerald">
                  <div style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '56.25%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <iframe
                      title={workout.title}
                      src={workout.videoUrl}
                      style={{ position: 'absolute', width: '100%', height: '100%', left: '0', top: '0', border: 'none' }}
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="status-pill status-green-tag">{workout.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{workout.duration} mins • {workout.mode} • Day {workout.day}</span>
                    </div>
                    <h3 style={{ margin: '0.5rem 0' }}>{workout.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{workout.description}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <span className="badge-item" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none' }}>
                        {workout.level} Program
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No workouts found in this category.</p>
            )}
          </div>
        </div>
      )}

      {/* 4. TRANSFORMATION TAB */}
      {selectedTab === 'transformation' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Historical progression charts */}
          <div className="card" style={{ gridColumn: 'span 7' }}>
            <h3>Weight Tracking & Dimension Trends</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Tracking your bi-weekly changes:</p>
            
            <div className="custom-chart-container">
              {transformations.length > 0 ? (
                transformations.map((trans, idx) => {
                  const maxWeight = 100; // rough scale
                  const barHeight = (trans.weight / maxWeight) * 100;
                  return (
                    <div key={idx} className="chart-bar-wrapper">
                      <div className="chart-bar" style={{ height: `${barHeight}%` }} data-value={`${trans.weight} kg`}></div>
                      <span className="chart-label">{new Date(trans.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem' }}>No transformation logs. Enter weight below to draw chart.</p>
              )}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h4>Transformation History Entries</h4>
              <div className="custom-table-container" style={{ marginTop: '0.5rem' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight</th>
                      <th>Chest / Waist / Hips / Biceps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transformations.map((trans, i) => (
                      <tr key={i}>
                        <td>{new Date(trans.date).toLocaleDateString()}</td>
                        <td>{trans.weight} kg</td>
                        <td>{trans.chest || '--'}" / {trans.waist || '--'}" / {trans.hips || '--'}" / {trans.biceps || '--'}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add progression details */}
          <div className="card" style={{ gridColumn: 'span 5' }}>
            <h3>Record Weight & Body Specs</h3>
            <form onSubmit={handleTransformationSubmit} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Body Weight (kg)</label>
                <input type="number" className="form-control" placeholder="e.g. 78.5" value={weight} onChange={(e) => setWeight(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Chest (inches)</label>
                  <input type="number" className="form-control" placeholder="e.g. 40" value={chest} onChange={(e) => setChest(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Waist (inches)</label>
                  <input type="number" className="form-control" placeholder="e.g. 32" value={waist} onChange={(e) => setWaist(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hips (inches)</label>
                  <input type="number" className="form-control" placeholder="e.g. 38" value={hips} onChange={(e) => setHips(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Biceps (inches)</label>
                  <input type="number" className="form-control" placeholder="e.g. 14.5" value={biceps} onChange={(e) => setBiceps(e.target.value)} />
                </div>
              </div>

              {/* Photo Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Before Photo</label>
                  <input type="file" onChange={(e) => setBeforePhoto(e.target.files[0])} accept="image/*" style={{ fontSize: '0.8rem' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">After Photo</label>
                  <input type="file" onChange={(e) => setAfterPhoto(e.target.files[0])} accept="image/*" style={{ fontSize: '0.8rem' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Progress Notes</label>
                <textarea className="form-control" placeholder="Describe muscle soreness or diet adherence details..." value={transNotes} onChange={(e) => setTransNotes(e.target.value)}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Progress Log</button>
            </form>
          </div>
        </div>
      )}

      {/* 5. HEALTH DOCS LOCKER */}
      {selectedTab === 'healthdocs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Documents Upload Panel */}
          <div className="card" style={{ gridColumn: 'span 5' }}>
            <h3>Upload Health Documents</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Upload medical lab reports, X-rays, sugar levels, or thyroid sheets.</p>
            <form onSubmit={handleDocSubmit}>
              <div className="form-group">
                <label className="form-label">Report Category</label>
                <select value={docCategory} onChange={(e) => setDocCategory(e.target.value)} className="form-control">
                  <option value="Blood Report">Blood Report</option>
                  <option value="Full Body Checkup">Full Body Checkup</option>
                  <option value="X-Ray / ECG">X-Ray / ECG</option>
                  <option value="Vitamin Report">Vitamin Report</option>
                  <option value="Sugar / BP / Thyroid">Sugar / BP / Thyroid</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Lab File (PDF or Image)</label>
                <input type="file" onChange={(e) => setDocFile(e.target.files[0])} required style={{ fontSize: '0.85rem' }} />
              </div>
              <div className="form-group">
                <label className="form-label">File Description Notes</label>
                <textarea className="form-control" placeholder="e.g. Lab checkup report from City Labs." value={docNotes} onChange={(e) => setDocNotes(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Upload size={16} /> Upload Securely
              </button>
            </form>
          </div>

          {/* Files List Locker */}
          <div className="card" style={{ gridColumn: 'span 7' }}>
            <h3>Secure Health Locker Files</h3>
            <div className="custom-table-container" style={{ marginTop: '1rem' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Uploaded Date</th>
                    <th>Report Category</th>
                    <th>Document Filename</th>
                    <th>Description Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length > 0 ? (
                    documents.map((doc, idx) => (
                      <tr key={idx}>
                        <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                        <td>
                          <span className="status-pill status-green-tag">{doc.fileCategory}</span>
                        </td>
                        <td>
                          <a href={doc.filePath} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-emerald)', textDecoration: 'underline' }}>
                            {doc.fileName}
                          </a>
                        </td>
                        <td>{doc.notes || '--'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        No files in secure storage.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Scrolling Feed posting */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Create Post */}
            <div className="card">
              <h3>Share Progress / Motivation</h3>
              <form onSubmit={handlePostSubmit} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    placeholder="Inspire the community! e.g. Just completed my day 3 push training!"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <select value={postType} onChange={(e) => setPostType(e.target.value)} className="form-control" style={{ width: '180px', padding: '0.4rem' }}>
                    <option value="Post">Regular Post</option>
                    <option value="SuccessStory">Success Story</option>
                    <option value="MotivationalQuote">Motivational Quote</option>
                  </select>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Share Post</button>
                </div>
              </form>
            </div>

            {/* Scrolling Feed list */}
            {feed.map((post) => (
              <div key={post._id} className="card card-glowing-emerald">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)' }}>{post.authorName}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.authorRole.toUpperCase()}</span>
                  </div>
                  <span className={`status-pill ${post.postType === 'SuccessStory' ? 'status-green-tag' : post.postType === 'MotivationalQuote' ? 'status-yellow-tag' : 'status-red-tag'}`}>
                    {post.postType}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                  {post.content}
                </p>
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', alignItems: 'center' }}>
                  <button onClick={() => handleLike(post._id)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)' }}>
                    ❤ Like ({post.likes?.length || 0})
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.comments?.length || 0} comments</span>
                </div>
                
                {/* Render comments */}
                {post.comments && post.comments.length > 0 && (
                  <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                    {post.comments.map((comment, idx) => (
                      <p key={idx} style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <strong>{comment.userName}:</strong> {comment.content}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Gamified Leaderboard */}
          <div className="card" style={{ gridColumn: 'span 4' }}>
            <h3>Wellness Leaderboard</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Rankings by points & streaks:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {leaderboard.map((usr, i) => (
                <div key={usr._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: usr._id === user._id ? 'var(--accent-emerald-glow)' : 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: usr._id === user._id ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', width: '20px', color: i === 0 ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>#{i + 1}</span>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{usr.name}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{usr.wellnessLevel}</span>
                    </div>
                  </div>
                  <strong style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}>{usr.points} XP</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
