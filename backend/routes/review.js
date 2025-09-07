const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const User = require('../models/user');
const Organization = require('../routes/orgs');

// Get all reviews for a specific org
router.get('/orgs/:orgId', async (req, res) => {
  try {
    const reviews = await Review.find({ organization: req.params.orgId }).populate('reviewer', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orgs/:id/average', async (req, res) => {
  try {
    const reviews = await Review.find({ org: req.params.id });
    if (!reviews.length) return res.json({ average: 0 });

    const avg = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
    res.json({ average: avg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error calculating average' });
  }
});


// Create a new review
router.post('/org/:orgId', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const reviewer = await User.findById(decoded.id);
    if (!reviewer) return res.status(404).json({ message: 'User not found' });

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating' });
    }

    const newReview = new Review({
      organization: req.params.orgId,
      reviewer: reviewer._id,
      rating,
      comment,
    });

    await newReview.save();
    res.json({ message: 'Review submitted successfully', review: newReview });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;