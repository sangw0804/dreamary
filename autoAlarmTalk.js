const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017/dreamary',
  { useNewUrlParser: true }
);

const { alarmTalk } = require('./routes/helpers/alarmTalk');
const { User } = require('./model/user');
const { Reservation } = require('./model/reservation');
