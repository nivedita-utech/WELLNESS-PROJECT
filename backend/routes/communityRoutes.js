import express from 'express';
import { getFeed, createPost, likePost, commentPost, getLeaderboard } from '../controllers/communityController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/feed', protect, getFeed);
router.post('/post', protect, createPost);
router.post('/like/:id', protect, likePost);
router.post('/comment/:id', protect, commentPost);
router.get('/leaderboard', protect, getLeaderboard);

export default router;
