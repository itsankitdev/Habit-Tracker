const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Protected route — returns logged-in user's info
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;    