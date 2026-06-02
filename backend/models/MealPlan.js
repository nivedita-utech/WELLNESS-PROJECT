import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema(
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
    dailyCalorieTarget: {
      type: Number,
      required: true,
    },
    macroSplit: {
      protein: { type: Number, required: true }, // percentage or grams
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
    meals: {
      breakfast: [
        {
          name: String,
          description: String,
          calories: Number,
          protein: Number,
          carbs: Number,
          fat: Number,
        }
      ],
      lunch: [
        {
          name: String,
          description: String,
          calories: Number,
          protein: Number,
          carbs: Number,
          fat: Number,
        }
      ],
      dinner: [
        {
          name: String,
          description: String,
          calories: Number,
          protein: Number,
          carbs: Number,
          fat: Number,
        }
      ],
      detoxDrinks: [
        {
          name: String,
          description: String,
          calories: Number,
          protein: Number,
          carbs: Number,
          fat: Number,
        }
      ],
      snacks: [
        {
          name: String,
          description: String,
          calories: Number,
          protein: Number,
          carbs: Number,
          fat: Number,
        }
      ]
    },
    detoxDrinks: [
      {
        name: String,
        description: String,
        timeToConsume: String // e.g., 'Morning empty stomach'
      }
    ]
  },
  {
    timestamps: true,
  }
);

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
export default MealPlan;
