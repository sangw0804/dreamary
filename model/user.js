const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  isD: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  male: Boolean,
  email: String,
  birthDate: Date,
  locations: [
    {
      region: {
        type: String
      },
      shop: {
        type: String
      },
      address: {
        type: String
      }
    }
  ],
  _uid: {
    type: String,
    required: true
  },
  _tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  ],
  _reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation'
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
