const mongoose = require('mongoose');

const { Schema } = mongoose;

const RequestSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  requestId: {
    type: String,

  },
  requester: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
    required: true,
  },
  zipCode: [{
    type: String,
    required: true,
  }],
  description: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  resuorces: [{
    url: String,
    size: Number,
    mimetype: String,
    name: String,
  }],

  status: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'share'],
    default: 'pending',
  },
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = mongoose.model('Request', RequestSchema);
