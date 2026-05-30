import mongoose from 'mongoose';

const workoutVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Fat Loss', 'Muscle Gain', 'Fitness', 'Yoga & Breathing', 'Meditation'],
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    mode: {
      type: String,
      enum: ['Home', 'Gym'],
      default: 'Gym',
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    day: {
      type: Number, // Day 1, Day 2 for structured tracking
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutVideo = mongoose.model('WorkoutVideo', workoutVideoSchema);
export default WorkoutVideo;
