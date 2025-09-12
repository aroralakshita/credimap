const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

// REGISTER
router.post('/register', async (req, res) => {
  const { role, name, email, password, category, format, description, location } = req.body;

  if (!name || !email || !password || !role || !location?.city || !location?.country) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (role !== 'student' && (!category || !format || !description)) {
    return res.status(400).json({ message: 'Missing organization details' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      role,
      name,
      email,
      password: hashedPassword,
      location,
      category: role !== 'student' ? category : undefined,
      format: role !== 'student' ? format : undefined,
      description: role !== 'student' ? description : undefined,
    });

    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ message: 'User created', token, user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

  console.log("JWT Secret:", process.env.JWT_SECRET);


    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

const authenticateToken = require('../middleware/authenticateToken');

// ✅ PERSISTENT LOGIN SUPPORT
router.get('/me', authenticateToken, async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Authenticated user ID:', req.user.id);
    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
