const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // <-- points to User
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
