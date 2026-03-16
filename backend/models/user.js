const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Basic auth fields
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  // If user logged in with Google, they don't have a password
  if (this.googleId && !this.password) {
    return false;
  }
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);