const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['student', 'organization'] },
  category: String,
  format: String,
  instagram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  linktree: { type: String, default: "" },
  tiktok: { type: String, default: "" },
  location: {
    city: String,
    state: String,
    country: String,
    description: String
  }
});

module.exports = mongoose.model('User', UserSchema);
