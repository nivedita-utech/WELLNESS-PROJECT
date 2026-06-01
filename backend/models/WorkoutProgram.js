import mongoose from 'mongoose';

const workoutProgramSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Fat Loss', 'Muscle Gain', 'Fitness'],
      default: 'Fitness'
    },
    mode: {
      type: String,
      enum: ['Home', 'Gym', 'Both'],
      default: 'Gym'
    },
    schedule: [
      {
        dayNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String },
        videoIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WorkoutVideo'
          }
        ],
        completed: { type: Boolean, default: false }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const WorkoutProgram = mongoose.model('WorkoutProgram', workoutProgramSchema);
export default WorkoutProgram;
