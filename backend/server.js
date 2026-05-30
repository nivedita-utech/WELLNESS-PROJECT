import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
// nodemon-reload: forced restart trigger
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import wellnessRoutes from './routes/wellnessRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

import User from './models/User.js';
import BodyAnalysis from './models/BodyAnalysis.js';
import MedicalReport from './models/MedicalReport.js';
import DailyLog from './models/DailyLog.js';
import Transformation from './models/Transformation.js';
import BusinessControl from './models/BusinessControl.js';
import Sale from './models/Sale.js';
import Community from './models/Community.js';
import WorkoutVideo from './models/WorkoutVideo.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static('uploads'));
// Serve public folder statically (includes seed.html)
app.use(express.static('public'));

app.get('/api', (req, res) => {
  res.send('Wellness Ecosystem API is running...');
});

// ============================================================
// TEMPORARY SEED ENDPOINT — call GET /api/seed to populate DB
// ============================================================
app.get('/api/seed', async (req, res) => {
  try {
    // Clear all collections
    await User.deleteMany({});
    await BodyAnalysis.deleteMany({});
    await MedicalReport.deleteMany({});
    await DailyLog.deleteMany({});
    await Transformation.deleteMany({});
    await BusinessControl.deleteMany({});
    await Sale.deleteMany({});
    await Community.deleteMany({});
    await WorkoutVideo.deleteMany({});

    // Business Control
    const businessControl = await BusinessControl.create({
      franchiseMode: true,
      salesAssignment: 'franchise',
      selfFranchiseRule: 'company',
      auditLogs: [],
    });

    // Users — passwords will be hashed by the User model pre-save hook
    const admin = await User.create({
      name: 'Dr. Evelyn Carter',
      email: 'admin@wellness.com',
      password: 'admin123',
      role: 'admin',
      status: 'Active',
      badges: ['Founder', 'Health Pioneer'],
    });

    const franchise1 = await User.create({
      name: 'Gym-Nexus Franchise East',
      email: 'franchise1@wellness.com',
      password: 'franchise123',
      role: 'franchise',
      status: 'Active',
      badges: ['Business Partner'],
    });

    const franchise2 = await User.create({
      name: 'Vigor-Wellness Franchise West',
      email: 'franchise2@wellness.com',
      password: 'franchise123',
      role: 'franchise',
      status: 'Active',
      badges: ['Business Partner'],
    });

    const staff1 = await User.create({
      name: 'Coach Marcus Vance',
      email: 'staff1@wellness.com',
      password: 'staff123',
      role: 'staff',
      franchiseId: franchise1._id,
      status: 'Active',
      badges: ['Certified Coach'],
    });

    const client1 = await User.create({
      name: 'Rohan Sharma',
      email: 'client1@wellness.com',
      password: 'client123',
      role: 'user',
      membershipId: 'WELL-529048',
      wellnessLevel: 'Beginner',
      points: 240,
      franchiseId: franchise1._id,
      status: 'Active',
      badges: ['Newcomer', 'Water Streak Master', 'Consistent Tracker'],
    });

    const client2 = await User.create({
      name: 'Aanya Patel',
      email: 'client2@wellness.com',
      password: 'client123',
      role: 'user',
      membershipId: 'WELL-882390',
      wellnessLevel: 'Intermediate',
      points: 150,
      franchiseId: franchise1._id,
      status: 'Active',
      badges: ['Newcomer', 'Perfect Day'],
    });

    // Audit log
    businessControl.auditLogs.push({
      changedBy: admin._id,
      changedByName: admin.name,
      changeDescription: 'System initialized with default franchise sales routing controls.',
    });
    await businessControl.save();

    // Workout Videos
    await WorkoutVideo.insertMany([
      { title: 'Full Body Fat Burning HIIT', category: 'Fat Loss', level: 'Beginner', mode: 'Home', duration: 20, videoUrl: 'https://www.youtube.com/embed/gC_L9qAHVJ8', description: 'No equipment. High-intensity circuit to kickstart metabolism.', day: 1 },
      { title: 'Core Strengthening & Abs Circuit', category: 'Fat Loss', level: 'Beginner', mode: 'Home', duration: 15, videoUrl: 'https://www.youtube.com/embed/50kH47ZOMHs', description: 'Strengthen core muscles and obliques.', day: 2 },
      { title: 'Hypertrophy Upper Body Push Day', category: 'Muscle Gain', level: 'Intermediate', mode: 'Gym', duration: 45, videoUrl: 'https://www.youtube.com/embed/yQyF_F9wN40', description: 'Chest, Shoulders, Triceps — progressive overload.', day: 3 },
      { title: 'Pranayama Yoga & Breath Control', category: 'Yoga & Breathing', level: 'Beginner', mode: 'Home', duration: 25, videoUrl: 'https://www.youtube.com/embed/v7AYKJD63-0', description: 'Reduce stress and cortisol with breathwork.', day: 4 },
      { title: 'Deep Mindful Meditation for Sleep', category: 'Meditation', level: 'Beginner', mode: 'Home', duration: 10, videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM', description: 'Lower heart rate and improve sleep quality.', day: 5 },
    ]);

    // Daily Logs
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    await DailyLog.create({
      userId: client1._id, date: yesterday,
      waterIntake: 2800, waterGoal: 2500, sleepHours: 8, meditationMinutes: 15, stepCount: 11200, stepGoal: 10000,
      challengesCompleted: ['water', 'steps', 'sleep', 'meal'],
      mealsLogged: {
        breakfast: { name: 'Oats with Almonds & Banana', calories: 450, protein: 18, carbs: 65, fat: 12, logged: true },
        lunch: { name: 'Grilled Chicken Salad', calories: 600, protein: 45, carbs: 50, fat: 15, logged: true },
        dinner: { name: 'Baked Salmon with Broccoli', calories: 500, protein: 40, carbs: 20, fat: 22, logged: true },
        snacks: { name: 'Whey Shake & Green Tea', calories: 200, protein: 26, carbs: 5, fat: 2, logged: true },
      },
    });

    await DailyLog.create({
      userId: client1._id, date: today,
      waterIntake: 1500, waterGoal: 2500, sleepHours: 6, meditationMinutes: 0, stepCount: 4200, stepGoal: 10000,
      challengesCompleted: [],
      mealsLogged: {
        breakfast: { name: 'Eggs Toast', calories: 350, protein: 20, carbs: 30, fat: 10, logged: true },
        lunch: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
        dinner: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
        snacks: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
      },
    });

    // Body Analysis
    await BodyAnalysis.create({ userId: client1._id, recordedBy: staff1._id, date: new Date(Date.now() - 14 * 86400000), weight: 82.5, bodyFat: 24.8, bmi: 26.9, muscleMass: 31.8, visceralFat: 9, waterPercent: 52.0, proteinPercent: 16.0, metabolicAge: 35, boneMass: 3.2, healthScore: 70, riskIndicator: 'Yellow' });
    await BodyAnalysis.create({ userId: client1._id, recordedBy: staff1._id, date: new Date(Date.now() - 2 * 86400000), weight: 79.8, bodyFat: 22.2, bmi: 26.0, muscleMass: 33.2, visceralFat: 8, waterPercent: 54.1, proteinPercent: 17.2, metabolicAge: 32, boneMass: 3.3, healthScore: 82, riskIndicator: 'Green' });

    // Medical Reports
    await MedicalReport.create({ userId: client1._id, recordedBy: staff1._id, date: new Date(Date.now() - 14 * 86400000), sugar: 112, bpSystolic: 136, bpDiastolic: 89, hemoglobin: 13.2, vitamins: { vitaminD: 18, vitaminB12: 180 }, riskIndicator: 'Yellow' });
    await MedicalReport.create({ userId: client1._id, recordedBy: staff1._id, date: new Date(Date.now() - 2 * 86400000), sugar: 95, bpSystolic: 122, bpDiastolic: 81, hemoglobin: 14.2, vitamins: { vitaminD: 32, vitaminB12: 245 }, riskIndicator: 'Green' });

    // Sales
    await Sale.create({ amount: 4500, userId: client1._id, franchiseId: franchise1._id, assignedTo: 'franchise', commissionAmount: 1125, description: 'Quarterly Gold Membership & Gym Pass', date: new Date(Date.now() - 10 * 86400000) });
    await Sale.create({ amount: 8000, userId: client2._id, franchiseId: franchise1._id, assignedTo: 'franchise', commissionAmount: 2000, description: 'Personal Training Package (12 Sessions)', date: new Date(Date.now() - 5 * 86400000) });
    await Sale.create({ amount: 2500, userId: client1._id, franchiseId: null, assignedTo: 'company', commissionAmount: 0, description: 'Premium Whey Isolate purchase', date: new Date(Date.now() - 3 * 86400000) });

    // Community
    await Community.create({ authorId: client1._id, authorName: client1.name, authorRole: client1.role, postType: 'SuccessStory', content: 'Lost 2.7kg and gained 1.4kg of muscle in 2 weeks! The push day training is phenomenal!', likes: [client2._id, staff1._id], comments: [{ userId: staff1._id, userName: staff1.name, content: 'Outstanding work Rohan! Keep it up!' }] });
    await Community.create({ authorId: admin._id, authorName: admin.name, authorRole: admin.role, postType: 'MotivationalQuote', content: '"Wellness is not a static state. It is a dynamic, active process of making choices toward a healthy and fulfilling life."', likes: [client1._id, client2._id, staff1._id], comments: [] });
    await Community.create({ authorId: client2._id, authorName: client2.name, authorRole: client2.role, postType: 'Post', content: 'Just smashed the Day 4 Pranayama Yoga routines. Breathing exercises are a total game-changer!', likes: [client1._id], comments: [] });

    // Transformations
    await Transformation.create({ userId: client1._id, date: new Date(Date.now() - 14 * 86400000), weight: 82.5, chest: 41.5, waist: 36.2, hips: 39.5, biceps: 14.1, notes: 'Starting my wellness journey.' });
    await Transformation.create({ userId: client1._id, date: new Date(Date.now() - 2 * 86400000), weight: 79.8, chest: 41.2, waist: 34.1, hips: 38.6, biceps: 14.4, notes: 'Active fat loss achieved. Muscle definition improving.' });

    res.json({
      success: true,
      message: '✅ Database seeded successfully! All demo accounts are ready.',
      accounts: {
        admin: 'admin@wellness.com / admin123',
        franchise: 'franchise1@wellness.com / franchise123',
        staff: 'staff1@wellness.com / staff123',
        client: 'client1@wellness.com / client123',
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/community', communityRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
