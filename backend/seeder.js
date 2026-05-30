import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import BodyAnalysis from './models/BodyAnalysis.js';
import MedicalReport from './models/MedicalReport.js';
import HealthDocument from './models/HealthDocument.js';
import DailyLog from './models/DailyLog.js';
import Transformation from './models/Transformation.js';
import BusinessControl from './models/BusinessControl.js';
import Sale from './models/Sale.js';
import Community from './models/Community.js';
import WorkoutVideo from './models/WorkoutVideo.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await BodyAnalysis.deleteMany({});
    await MedicalReport.deleteMany({});
    await HealthDocument.deleteMany({});
    await DailyLog.deleteMany({});
    await Transformation.deleteMany({});
    await BusinessControl.deleteMany({});
    await Sale.deleteMany({});
    await Community.deleteMany({});
    await WorkoutVideo.deleteMany({});

    console.log('Database cleared.');

    // 1. Create Business Controls
    const businessControl = await BusinessControl.create({
      franchiseMode: true,
      salesAssignment: 'franchise',
      selfFranchiseRule: 'company',
      auditLogs: [],
    });
    console.log('Business Controls seeded.');

    // 2. Create Users
    // Admin
    const admin = await User.create({
      name: 'Dr. Evelyn Carter',
      email: 'admin@wellness.com',
      password: 'admin123',
      role: 'admin',
      status: 'Active',
      badges: ['Founder', 'Health Pioneer'],
    });

    // Franchise
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

    // Staff
    const staff1 = await User.create({
      name: 'Coach Marcus Vance',
      email: 'staff1@wellness.com',
      password: 'staff123',
      role: 'staff',
      franchiseId: franchise1._id,
      status: 'Active',
      badges: ['Certified Coach'],
    });

    // Clients
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

    console.log('Users seeded.');

    // Update business log change creator
    businessControl.auditLogs.push({
      changedBy: admin._id,
      changedByName: admin.name,
      changeDescription: 'Initialized system with default franchise sales routing controls.',
    });
    await businessControl.save();

    // 3. Create Workout Videos
    const workouts = await WorkoutVideo.insertMany([
      {
        title: 'Full Body Fat Burning HIIT',
        category: 'Fat Loss',
        level: 'Beginner',
        mode: 'Home',
        duration: 20,
        videoUrl: 'https://www.youtube.com/embed/gC_L9qAHVJ8',
        description: 'No equipment needed. A high-intensity interval training circuit to kickstart metabolism.',
        day: 1,
      },
      {
        title: 'Core Strengthening & Abs Circuit',
        category: 'Fat Loss',
        level: 'Beginner',
        mode: 'Home',
        duration: 15,
        videoUrl: 'https://www.youtube.com/embed/50kH47ZOMHs',
        description: 'Focus on strengthening the transverse abdominis, rectus abdominis, and obliques.',
        day: 2,
      },
      {
        title: 'Hypertrophy Upper Body Push Day',
        category: 'Muscle Gain',
        level: 'Intermediate',
        mode: 'Gym',
        duration: 45,
        videoUrl: 'https://www.youtube.com/embed/yQyF_F9wN40',
        description: 'Gym routine focusing on Chest, Shoulders, and Triceps. Progressive overload exercises.',
        day: 3,
      },
      {
        title: 'Pranayama Yoga & Breath Control',
        category: 'Yoga & Breathing',
        level: 'Beginner',
        mode: 'Home',
        duration: 25,
        videoUrl: 'https://www.youtube.com/embed/v7AYKJD63-0',
        description: 'Gentle stretches combined with deep breathing techniques to reduce stress and cortisol levels.',
        day: 4,
      },
      {
        title: 'Deep Mindful Meditation for Sleep',
        category: 'Meditation',
        level: 'Beginner',
        mode: 'Home',
        duration: 10,
        videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM',
        description: 'Guided audio visualization to relax muscles, lower heart rate, and improve sleep hygiene.',
        day: 5,
      },
    ]);
    console.log('Workout video library seeded.');

    // 4. Create Daily Tracking logs for Client 1
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    await DailyLog.create({
      userId: client1._id,
      date: yesterday,
      waterIntake: 2800,
      waterGoal: 2500,
      sleepHours: 8,
      meditationMinutes: 15,
      stepCount: 11200,
      stepGoal: 10000,
      challengesCompleted: ['water', 'steps', 'sleep', 'meal'],
      mealsLogged: {
        breakfast: { name: 'Oats with Almonds & Banana', calories: 450, protein: 18, carbs: 65, fat: 12, logged: true },
        lunch: { name: 'Grilled Chicken Salad with Quinoa', calories: 600, protein: 45, carbs: 50, fat: 15, logged: true },
        dinner: { name: 'Baked Salmon with Broccoli', calories: 500, protein: 40, carbs: 20, fat: 22, logged: true },
        snacks: { name: 'Whey Shake & Green Tea', calories: 200, protein: 26, carbs: 5, fat: 2, logged: true },
      },
    });

    await DailyLog.create({
      userId: client1._id,
      date: today,
      waterIntake: 1500,
      waterGoal: 2500,
      sleepHours: 6,
      meditationMinutes: 0,
      stepCount: 4200,
      stepGoal: 10000,
      challengesCompleted: [],
      mealsLogged: {
        breakfast: { name: 'Eggs Toast', calories: 350, protein: 20, carbs: 30, fat: 10, logged: true },
        lunch: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
        dinner: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
        snacks: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, logged: false },
      },
    });
    console.log('Daily Logs seeded.');

    // 5. Create Body Analyses (Historic & Recent for client 1)
    const analysisPast = await BodyAnalysis.create({
      userId: client1._id,
      recordedBy: staff1._id,
      date: new Date(Date.now() - 14 * 86400000), // 14 days ago
      weight: 82.5,
      bodyFat: 24.8,
      bmi: 26.9,
      muscleMass: 31.8,
      visceralFat: 9,
      waterPercent: 52.0,
      proteinPercent: 16.0,
      metabolicAge: 35,
      boneMass: 3.2,
      healthScore: 70,
      riskIndicator: 'Yellow',
    });

    const analysisRecent = await BodyAnalysis.create({
      userId: client1._id,
      recordedBy: staff1._id,
      date: new Date(Date.now() - 2 * 86400000), // 2 days ago
      weight: 79.8,
      bodyFat: 22.2,
      bmi: 26.0,
      muscleMass: 33.2,
      visceralFat: 8,
      waterPercent: 54.1,
      proteinPercent: 17.2,
      metabolicAge: 32,
      boneMass: 3.3,
      healthScore: 82,
      riskIndicator: 'Green',
    });
    console.log('Body Analysis records seeded.');

    // 6. Create Medical Reports (Historic & Recent for client 1)
    await MedicalReport.create({
      userId: client1._id,
      recordedBy: staff1._id,
      date: new Date(Date.now() - 14 * 86400000),
      sugar: 112, // elevated
      bpSystolic: 136, // elevated
      bpDiastolic: 89, // elevated
      hemoglobin: 13.2,
      vitamins: {
        vitaminD: 18, // deficient
        vitaminB12: 180,
      },
      riskIndicator: 'Yellow',
    });

    await MedicalReport.create({
      userId: client1._id,
      recordedBy: staff1._id,
      date: new Date(Date.now() - 2 * 86400000),
      sugar: 95, // normal
      bpSystolic: 122, // normal
      bpDiastolic: 81, // normal
      hemoglobin: 14.2,
      vitamins: {
        vitaminD: 32, // normal
        vitaminB12: 245,
      },
      riskIndicator: 'Green',
    });
    console.log('Medical report records seeded.');

    // 7. Create Sales
    await Sale.create({
      amount: 4500,
      userId: client1._id,
      franchiseId: franchise1._id,
      assignedTo: 'franchise',
      commissionAmount: 1125, // 25% of 4500
      description: 'Quarterly Gold Membership & Gym Pass',
      date: new Date(Date.now() - 10 * 86400000),
    });

    await Sale.create({
      amount: 8000,
      userId: client2._id,
      franchiseId: franchise1._id,
      assignedTo: 'franchise',
      commissionAmount: 2000, // 25% of 8000
      description: 'Personal Training Package (12 Sessions)',
      date: new Date(Date.now() - 5 * 86400000),
    });

    await Sale.create({
      amount: 2500,
      userId: client1._id,
      franchiseId: null,
      assignedTo: 'company',
      commissionAmount: 0,
      description: 'Premium Whey Isolate protein powder purchase',
      date: new Date(Date.now() - 3 * 86400000),
    });
    console.log('Sales transactions seeded.');

    // 8. Create Community Feed Posts
    await Community.create({
      authorId: client1._id,
      authorName: client1.name,
      authorRole: client1.role,
      postType: 'SuccessStory',
      content: 'Lost 2.7kg and gained 1.4kg of muscle in 2 weeks! The day-wise structured push day training from Coach Marcus is phenomenal. Water logging and sleep challenges are keeping me hyper-consistent.',
      mediaUrl: '',
      likes: [client2._id, staff1._id],
      comments: [
        {
          userId: staff1._id,
          userName: staff1.name,
          content: 'Outstanding work Rohan! The metabolic age decrease shows your cellular recovery is optimizing nicely. Keep it up!',
        },
      ],
    });

    await Community.create({
      authorId: admin._id,
      authorName: admin.name,
      authorRole: admin.role,
      postType: 'MotivationalQuote',
      content: '"Wellness is not a static state. It is a dynamic, active process of making choices toward a healthy and fulfilling life." Make the right choices today!',
      likes: [client1._id, client2._id, staff1._id],
      comments: [],
    });

    await Community.create({
      authorId: client2._id,
      authorName: client2.name,
      authorRole: client2.role,
      postType: 'Post',
      content: 'Just smashed the Day 4 Pranayama Yoga routines. The breathing exercises are a total game-changer for lowering work stress.',
      likes: [client1._id],
      comments: [],
    });
    console.log('Community feed seeded.');

    // 9. Create Transformations
    await Transformation.create({
      userId: client1._id,
      date: new Date(Date.now() - 14 * 86400000),
      weight: 82.5,
      chest: 41.5,
      waist: 36.2,
      hips: 39.5,
      biceps: 14.1,
      beforePhoto: '/uploads/before_dummy.png',
      notes: 'Starting my wellness journey. Aiming to drop fat and improve aerobic stamina.',
    });

    await Transformation.create({
      userId: client1._id,
      date: new Date(Date.now() - 2 * 86400000),
      weight: 79.8,
      chest: 41.2,
      waist: 34.1,
      hips: 38.6,
      biceps: 14.4,
      afterPhoto: '/uploads/after_dummy.png',
      notes: 'Active fat loss achieved. Muscle definition in arms is improving.',
    });
    console.log('Transformation records seeded.');

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
