import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: true,
    },
    waterIntake: {
      type: Number, // in ml
      default: 0,
    },
    waterGoal: {
      type: Number, // in ml
      default: 2500,
    },
    sleepHours: {
      type: Number,
      default: 0,
    },
    meditationMinutes: {
      type: Number,
      default: 0,
    },
    stepCount: {
      type: Number,
      default: 0,
    },
    stepGoal: {
      type: Number,
      default: 10000,
    },
    challengesCompleted: [
      {
        type: String, // 'workout', 'meal', 'water', 'steps'
      },
    ],
    mealsLogged: {
      breakfast: {
        name: { type: String, default: '' },
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        logged: { type: Boolean, default: false },
      },
      lunch: {
        name: { type: String, default: '' },
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        logged: { type: Boolean, default: false },
      },
      dinner: {
        name: { type: String, default: '' },
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        logged: { type: Boolean, default: false },
      },
      snacks: {
        name: { type: String, default: '' },
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        logged: { type: Boolean, default: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a single log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);
export default DailyLog;
