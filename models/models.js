const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  message: [
    {
      sms: String,
      phoneNumber: Number,
    },
    {
      email: String,
      emailAddress: String,
    },
    {
      push: String,
      deviceType: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
  },
  status: {
    type: String,
    default: "Pending"
  },
  retryCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);