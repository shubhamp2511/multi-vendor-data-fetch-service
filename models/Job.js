const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  payload: { type: Object, required: true },
  vendor: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'complete', 'failed'],
    default: 'pending',
  },
  result: { type: Object, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);