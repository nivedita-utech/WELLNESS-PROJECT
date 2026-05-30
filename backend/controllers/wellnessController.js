import DailyLog from '../models/DailyLog.js';
import Transformation from '../models/Transformation.js';
import WorkoutVideo from '../models/WorkoutVideo.js';
import User from '../models/User.js';
import BodyAnalysis from '../models/BodyAnalysis.js';
import MedicalReport from '../models/MedicalReport.js';

// ============================================================
// WELLNESS QUOTES — curated bank of 20 quotes, returned randomly
// ============================================================
const WELLNESS_QUOTES = [
  { text: "The greatest wealth is health. Invest in your body every single day.", author: "Virgil" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
  { text: "Physical fitness is not only one of the most important keys to a healthy body, it is the basis of dynamic and creative intellectual activity.", author: "John F. Kennedy" },
  { text: "The human body is the best picture of the human soul.", author: "Tony Robbins" },
  { text: "Health is not about the weight you lose, but about the life you gain.", author: "Dr. Josh Axe" },
  { text: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha" },
  { text: "Movement is medicine for creating change in a person's physical, emotional, and mental states.", author: "Carol Welch" },
  { text: "Those who think they have no time for bodily exercise will sooner or later find time for illness.", author: "Edward Stanley" },
  { text: "An early morning walk is a blessing for the whole day.", author: "Henry David Thoreau" },
  { text: "The first wealth is health. Neglect it and everything else falls.", author: "Ralph Waldo Emerson" },
  { text: "Wellness is a journey, not a destination. Every step you take today shapes the you of tomorrow.", author: "Aura Wellness" },
  { text: "The only bad workout is the one that didn't happen. Show up for yourself, every single day.", author: "Aura Wellness" },
  { text: "Strive for progress, not perfection. Every rep, every meal, every night of rest counts.", author: "Aura Wellness" },
  { text: "Your body is capable of far more than your mind believes. Push the limit, embrace the change.", author: "Aura Wellness" },
  { text: "Discipline is the bridge between your fitness goals and your fitness results.", author: "Jim Rohn" },
  { text: "Success is the sum of small efforts repeated day in and day out in your health routine.", author: "Robert Collier" },
  { text: "Your health is an investment, not an expense. Every choice compounds over time.", author: "Aura Wellness" },
  { text: "Sweat is just fat crying. Keep going, the transformation is happening.", author: "Aura Wellness" },
  { text: "Consistency beats intensity. Show up daily, results will follow.", author: "Aura Wellness" },
];

// @desc    Get a random daily wellness quote
// @route   GET /api/wellness/quote
// @access  Private
export const getQuote = async (req, res) => {
  try {
    // Rotate quote based on the day of year so it changes daily but stays consistent within the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const quote = WELLNESS_QUOTES[dayOfYear % WELLNESS_QUOTES.length];
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get personalized wellness recommendations based on user's latest health data
// @route   GET /api/wellness/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
  const userId = req.user._id;
  try {
    const latestBody = await BodyAnalysis.findOne({ userId }).sort({ date: -1 });
    const latestMedical = await MedicalReport.findOne({ userId }).sort({ date: -1 });
    const latestLog = await DailyLog.findOne({ userId }).sort({ date: -1 });

    const recs = [];

    // --- Hydration Tip ---
    const waterToday = latestLog?.waterIntake || 0;
    if (waterToday < 1000) {
      recs.push({
        title: 'Hydration Alert 💧',
        body: 'Your water intake is critically low. Start with 2 glasses immediately on waking. Aim to reach 2500ml by end of day. Dehydration slows metabolism by up to 14%.'
      });
    } else if (waterToday < 2500) {
      recs.push({
        title: 'Stay Hydrated 💧',
        body: `You've logged ${waterToday}ml so far. You need ${2500 - waterToday}ml more to hit your daily 2500ml goal. Try adding lemon slices and electrolyte mineral water.`
      });
    } else {
      recs.push({
        title: 'Excellent Hydration ✅',
        body: `You've achieved your daily hydration target of ${waterToday}ml! Maintain this streak — consistent hydration improves skin, digestion, and energy.`
      });
    }

    // --- Blood Sugar Tip ---
    if (latestMedical?.sugar) {
      if (latestMedical.sugar > 126) {
        recs.push({
          title: 'Blood Sugar Management 🩺',
          body: `Your latest fasting sugar reading of ${latestMedical.sugar} mg/dL is in the pre-diabetic range. Prioritize low-GI foods (oats, lentils, vegetables) and 30 minutes of brisk walking post-dinner.`
        });
      } else if (latestMedical.sugar > 100) {
        recs.push({
          title: 'Sugar Level Attention ⚠️',
          body: `Blood sugar at ${latestMedical.sugar} mg/dL is slightly elevated. Reduce refined carbs and sugar intake. Include chia seeds, cinnamon, and bitter gourd (karela) in your diet.`
        });
      } else {
        recs.push({
          title: 'Healthy Blood Sugar 🍃',
          body: `Great job! Your fasting blood sugar of ${latestMedical.sugar} mg/dL is in the healthy range. Keep up with fiber-rich meals and regular movement.`
        });
      }
    } else {
      recs.push({
        title: 'Ginger Lemon Wellness Detox 🍋',
        body: 'Mix warm water, 1 tbsp ginger juice, lemon slices, and raw honey. Boosts digestion, supports gut health, and naturally regulates blood sugar levels.'
      });
    }

    // --- BMI / Body Composition Tip ---
    if (latestBody?.bmi) {
      if (latestBody.bmi >= 30) {
        recs.push({
          title: 'Weight Management Plan 🏃',
          body: `Your BMI is ${latestBody.bmi} (Obese range). Start with a 300-500 kcal daily deficit and 3x weekly HIIT sessions. Track every meal — the data is your coach.`
        });
      } else if (latestBody.bmi >= 25) {
        recs.push({
          title: 'Fat Loss Phase 🔥',
          body: `Your BMI is ${latestBody.bmi} (Overweight range). Focus on compound movements (squats, deadlifts) 4x weekly and reduce processed carbs. Your body fat goal: achieve <22%.`
        });
      } else if (latestBody.bmi < 18.5) {
        recs.push({
          title: 'Muscle Building Focus 💪',
          body: `Your BMI is ${latestBody.bmi} (Underweight range). Increase calories by 300-500kcal daily from clean sources: eggs, oats, whole milk, and nuts. Resistance train 3-4x weekly.`
        });
      } else {
        recs.push({
          title: 'High-Fiber Maintenance Diet 🥗',
          body: `Your BMI is ${latestBody.bmi} — excellent! Maintain with balanced macros (40% carbs, 30% protein, 30% fat). Include broccoli, oats, and almonds for sustained energy and insulin control.`
        });
      }
    } else {
      recs.push({
        title: 'High-Fiber Dietary Tips 🥗',
        body: 'Include broccoli, oats, and almonds in meals to support insulin regulation and stable blood glucose. Get a body analysis done for personalized recommendations.'
      });
    }

    // --- Sleep & Recovery Tip ---
    const sleepHours = latestLog?.sleepHours || 0;
    if (sleepHours > 0 && sleepHours < 6) {
      recs.push({
        title: 'Critical Sleep Deficit 😴',
        body: `You logged only ${sleepHours} hours of sleep. Chronic sleep deprivation raises cortisol, causes muscle loss, and increases fat storage. Aim for 7-9 hours minimum.`
      });
    } else if (sleepHours >= 7) {
      recs.push({
        title: 'Recovery Optimization ✅',
        body: `Great — ${sleepHours} hours of sleep recorded! Keep this up. Tip: sleep in a dark, cool room (18-20°C) and avoid screens 1 hour before bed for deeper REM cycles.`
      });
    }

    // --- Vitamin D Tip ---
    if (latestMedical?.vitamins?.vitaminD && latestMedical.vitamins.vitaminD < 30) {
      recs.push({
        title: `Vitamin D Deficiency Alert ☀️`,
        body: `Your Vitamin D level is ${latestMedical.vitamins.vitaminD} ng/mL (deficient range, <30). Get 15-20 minutes of morning sunlight daily and consider a D3+K2 supplement under medical supervision.`
      });
    }

    res.json(recs.slice(0, 4)); // Return max 4 recommendations
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Add a new workout video to the library
// @route   POST /api/wellness/workouts
// @access  Private (Admin only)
export const addWorkout = async (req, res) => {
  const { title, category, level, mode, duration, videoUrl, description, day } = req.body;

  try {
    if (!title || !videoUrl || !duration || !day) {
      return res.status(400).json({ message: 'Title, Video URL, Duration, and Day are required.' });
    }

    // Convert standard YouTube watch URL to embed URL if needed
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const vidId = videoUrl.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const vidId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}`;
    }

    const workout = await WorkoutVideo.create({
      title,
      category: category || 'Fat Loss',
      level: level || 'Beginner',
      mode: mode || 'Home',
      duration: Number(duration),
      videoUrl: embedUrl,
      description: description || '',
      day: Number(day),
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Delete a workout video
// @route   DELETE /api/wellness/workouts/:id
// @access  Private (Admin only)
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await WorkoutVideo.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get day-wise structured workout videos
// @route   GET /api/wellness/workouts
// @access  Private
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await WorkoutVideo.find({});
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get daily log for a specific date (YYYY-MM-DD)
// @route   GET /api/wellness/daily-log/:date
// @access  Private
export const getDailyLog = async (req, res) => {
  const { date } = req.params;
  const userId = req.user._id;

  try {
    let log = await DailyLog.findOne({ userId, date });

    if (!log) {
      // Create a default blank log template for client side
      log = {
        userId,
        date,
        waterIntake: 0,
        waterGoal: 2500,
        sleepHours: 0,
        meditationMinutes: 0,
        stepCount: 0,
        stepGoal: 10000,
        challengesCompleted: [],
        mealsLogged: {
          breakfast: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
          lunch: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
          dinner: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
          snacks: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
        },
      };
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Upsert daily log (water, steps, sleep, meditation, meals)
// @route   POST /api/wellness/daily-log
// @access  Private
export const saveDailyLog = async (req, res) => {
  const { date, waterIntake, waterGoal, sleepHours, meditationMinutes, stepCount, stepGoal, mealsLogged } = req.body;
  const userId = req.user._id;

  try {
    let log = await DailyLog.findOne({ userId, date });

    const challengesCompleted = [];
    let pointsToAdd = 0;

    // Check Water challenge
    if (waterIntake >= (waterGoal || 2500)) {
      challengesCompleted.push('water');
    }
    // Check Steps challenge
    if (stepCount >= (stepGoal || 10000)) {
      challengesCompleted.push('steps');
    }
    // Check Sleep challenge
    if (sleepHours >= 7) {
      challengesCompleted.push('sleep');
    }
    // Check Meal logging challenge (if breakfast, lunch, and dinner are logged)
    if (
      mealsLogged &&
      mealsLogged.breakfast?.logged &&
      mealsLogged.lunch?.logged &&
      mealsLogged.dinner?.logged
    ) {
      challengesCompleted.push('meal');
    }

    if (log) {
      // Calculate differences in challenge completions to award new points
      const previousCompletions = log.challengesCompleted || [];
      const newCompletions = challengesCompleted.filter((c) => !previousCompletions.includes(c));
      pointsToAdd = newCompletions.length * 10; // 10 points per challenge

      log.waterIntake = waterIntake ?? log.waterIntake;
      log.waterGoal = waterGoal ?? log.waterGoal;
      log.sleepHours = sleepHours ?? log.sleepHours;
      log.meditationMinutes = meditationMinutes ?? log.meditationMinutes;
      log.stepCount = stepCount ?? log.stepCount;
      log.stepGoal = stepGoal ?? log.stepGoal;
      log.mealsLogged = mealsLogged ?? log.mealsLogged;
      log.challengesCompleted = challengesCompleted;

      await log.save();
    } else {
      pointsToAdd = challengesCompleted.length * 10;

      log = await DailyLog.create({
        userId,
        date,
        waterIntake: waterIntake || 0,
        waterGoal: waterGoal || 2500,
        sleepHours: sleepHours || 0,
        meditationMinutes: meditationMinutes || 0,
        stepCount: stepCount || 0,
        stepGoal: stepGoal || 10000,
        mealsLogged: mealsLogged || {
          breakfast: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
          lunch: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
          dinner: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
          snacks: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
        },
        challengesCompleted,
      });
    }

    // Award points and check badges
    if (pointsToAdd > 0) {
      const user = await User.findById(userId);
      if (user) {
        user.points += pointsToAdd;

        // Badge Award Logic
        if (user.points >= 100 && !user.badges.includes('Fitness Enthusiast')) {
          user.badges.push('Fitness Enthusiast');
        }
        if (user.points >= 300 && !user.badges.includes('Wellness Champion')) {
          user.badges.push('Wellness Champion');
        }
        if (challengesCompleted.length === 4 && !user.badges.includes('Perfect Day')) {
          user.badges.push('Perfect Day');
        }
        if (user.points >= 500 && !user.badges.includes('Elite Health Guru')) {
          user.badges.push('Elite Health Guru');
        }

        await user.save();
      }
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transformation history
// @route   GET /api/wellness/transformation
// @access  Private
export const getTransformations = async (req, res) => {
  try {
    const transformations = await Transformation.find({ userId: req.user._id }).sort({ date: 1 });
    res.json(transformations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add transformation progress
// @route   POST /api/wellness/transformation
// @access  Private
export const addTransformation = async (req, res) => {
  const { weight, chest, waist, hips, biceps, notes } = req.body;
  const userId = req.user._id;

  try {
    let beforePhoto = '';
    let afterPhoto = '';

    if (req.files) {
      if (req.files.beforePhoto) {
        beforePhoto = `/uploads/${req.files.beforePhoto[0].filename}`;
      }
      if (req.files.afterPhoto) {
        afterPhoto = `/uploads/${req.files.afterPhoto[0].filename}`;
      }
    }

    const transformation = await Transformation.create({
      userId,
      weight,
      chest,
      waist,
      hips,
      biceps,
      beforePhoto,
      afterPhoto,
      notes,
    });

    // Update client wellness level tag if they track progress consistently
    const totalLogs = await Transformation.countDocuments({ userId });
    const user = await User.findById(userId);
    if (user) {
      if (totalLogs >= 5 && user.wellnessLevel === 'Beginner') {
        user.wellnessLevel = 'Intermediate';
        user.badges.push('Consistent Tracker');
        await user.save();
      } else if (totalLogs >= 15 && user.wellnessLevel === 'Intermediate') {
        user.wellnessLevel = 'Advanced';
        user.badges.push('Transformation Pro');
        await user.save();
      }
    }

    res.status(201).json(transformation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user analytics data for graphs
// @route   GET /api/wellness/analytics/graphs
// @access  Private
export const getAnalyticsGraphs = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch Body Analysis Data (Weight, Fat, Muscle, etc)
    const bodyData = await BodyAnalysis.find({ userId }).sort({ date: 1 });
    
    // Fetch Medical Report Data (BP, Sugar, Cholesterol, etc)
    const medicalData = await MedicalReport.find({ userId }).sort({ date: 1 });
    
    // Format for Recharts
    const formattedBodyData = bodyData.map(b => ({
      date: new Date(b.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: b.weight,
      bodyFat: b.bodyFat,
      muscleMass: b.muscleMass,
    }));
    
    const formattedMedicalData = medicalData.map(m => ({
      date: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      sugar: m.sugar,
      bpSystolic: m.bpSystolic,
      bpDiastolic: m.bpDiastolic,
    }));
    
    res.json({
      bodyAnalysis: formattedBodyData,
      medicalReports: formattedMedicalData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
