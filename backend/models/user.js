const mongoose = require('mongoose');

const CreatedBySchema = new mongoose.Schema({
  name: String,
  instagram: String,
  submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const ClaimSchema = new mongoose.Schema({
  tokenHash: String,       // SHA256 of the numeric code
  email: String,           // email we sent the code to
  expiresAt: Date,
  attempts: { type: Number, default: 0 }
}, { _id: false });

const ClaimedBySchema = new mongoose.Schema({
  email: String,
  verifiedAt: Date
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { 
    type: String, 
    enum: ['student', 'nonprofit', 'company', 'youthorg'],
    required: true
  },
  category: String,   // e.g. cs, psych, stem
  format: String,     // hybrid, remote, in-person
  instagram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  linktree: { type: String, default: "" },
  tiktok: { type: String, default: "" },
  location: {
    city: String,
    state: String,
    country: String,
    description: String
  },

  // 👇 Claim system fields
  createdBy: { type: CreatedBySchema, default: null }, // set if submitted by random user
  claimed: { type: Boolean, default: false },
  claim: { type: ClaimSchema, default: null },
  claimedBy: { type: ClaimedBySchema, default: null }

});

module.exports = mongoose.model('User', UserSchema);
