import Community from '../models/Community.js';
import User from '../models/User.js';

// @desc    Get community feed posts
// @route   GET /api/community/feed
// @access  Private
export const getFeed = async (req, res) => {
  try {
    const posts = await Community.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a community post / quote / story
// @route   POST /api/community/post
// @access  Private
export const createPost = async (req, res) => {
  const { content, postType, mediaUrl } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const post = await Community.create({
      authorId: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      postType: postType || 'Post',
      content,
      mediaUrl: mediaUrl || '',
      likes: [],
      comments: [],
    });

    // Reward points for posting motivational content or success stories (once in a while)
    if (postType === 'SuccessStory') {
      const user = await User.findById(req.user._id);
      if (user) {
        user.points += 20;
        if (!user.badges.includes('Inspirer')) {
          user.badges.push('Inspirer');
        }
        await user.save();
      }
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like / Unlike a post
// @route   POST /api/community/like/:id
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/community/comment/:id
// @access  Private
export const commentPost = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      userId: req.user._id,
      userName: req.user.name,
      content,
    };

    post.comments.push(newComment);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get wellness leaderboard sorted by points
// @route   GET /api/community/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    // Only display clients/users on the leaderboard
    const users = await User.find({ role: 'user' })
      .select('name wellnessLevel points badges avatar')
      .sort({ points: -1 })
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
