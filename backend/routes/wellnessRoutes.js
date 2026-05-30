import express from 'express';
import { getWorkouts, getDailyLog, saveDailyLog, getTransformations, addTransformation, getQuote, getRecommendations, addWorkout, deleteWorkout } from '../controllers/wellnessController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Dynamic Quote of the Day
router.get('/quote', protect, getQuote);

// Personalized Recommendations based on health data
router.get('/recommendations', protect, getRecommendations);

// Workout Videos
router.get('/workouts', protect, getWorkouts);
router.post('/workouts', protect, authorize('admin'), addWorkout);
router.delete('/workouts/:id', protect, authorize('admin'), deleteWorkout);

// Daily Logs
router.get('/daily-log/:date', protect, getDailyLog);
router.post('/daily-log', protect, saveDailyLog);

// Transformation
router.route('/transformation')
  .get(protect, getTransformations)
  .post(
    protect,
    upload.fields([
      { name: 'beforePhoto', maxCount: 1 },
      { name: 'afterPhoto', maxCount: 1 },
    ]),
    addTransformation
  );

export default router;
