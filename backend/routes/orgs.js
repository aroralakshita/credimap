// routes/orgs.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticateToken.js');
const User = require('../models/user.js');

// GET all organizations
// GET all organizations
router.get('/', async (req, res) => {
  try {
    const validOrgRoles = ["organization", "nonprofit", "company", "youthorg"];

    const orgs = await User.find({ role: { $in: validOrgRoles } })
    .select("name location _id format category");
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single organization by ID
router.get("/:id", async (req, res) => {
  try {
    const org = await User.findById(req.params.id);
    if (!org) return res.status(404).json({ error: "Not found" });
    res.json(org);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/orgs.js

// Get the current org's dashboard
router.get('/me/dashboard', authMiddleware, async (req, res) => {
  try {
    const org = await User.findById(req.user.id); // ✅ check this is correct
    if (!org) return res.status(404).json({ message: 'Org not found' });
    res.json(org);
  } catch (err) {
    console.error('Dashboard error:', err); // ✅ should show in terminal
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const orgId = req.user.id;
    const { name, location, category, format, instagram, linkedin, linktree, tiktok  } = req.body;

    // Find the org first
    const org = await User.findById(orgId);
    if (!org) return res.status(404).json({ message: 'Org not found' });

    // Update fields
    if (name) org.name = name;
    if (category) org.category = category;
    if (format) org.format = format;
    if (instagram) org.instagram = instagram;
    if (linkedin) org.linkedin = linkedin;
    if (linktree) org.linktree = linktree;
    if (tiktok) org.tiktok = tiktok;
      



    // 🔧 Properly handle nested update for location.description
    if (location?.description) {
      if (!org.location) org.location = {}; // ensure location exists
      org.location.description = location.description;
    }

    const saved = await org.save();

    res.json({ message: 'Profile updated', user: saved });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;