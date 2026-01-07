const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
  // Basic org info
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Astronomy','Arts','Biology','Business','Chemistry','Computer science','Community service','Data science',
    'Education','Engineering','Environmental science','History','Law','Literature',
    'Mathematics','Medicine','Neuroscience','Philosophy','Physics','Political science',
    'Psychology','Social work','Sociology','STEM','Technology']
  },
  format: {
    type: String,
    required: true,
    enum: ['Remote', 'In-Person', 'Hybrid']
  },
  description: {
    type: String,
    default: ''
  },
  website: String,
  
  // Location
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: [Number]
  },

  // Social media links
  instagram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  linktree: { type: String, default: "" },
  tiktok: { type: String, default: "" },

  // Submission info (who submitted this org)
  submittedBy: {
    name: {
      type: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
  },

  // Reviews and ratings
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  averageRating: {
    type: Number,
    default: 0
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
OrgSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Org', OrgSchema);