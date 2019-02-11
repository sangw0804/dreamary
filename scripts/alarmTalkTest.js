const mongoose = require('mongoose');

const config = require('../config');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });

const { alarmTalk } = require('../routes/helpers/alarmTalk');
const { User } = require('../model/user');
const { Reservation } = require('../model/reservation');

alarmTalk(
  'userReservationInformNow',
  '5bc3451087da35075e78c588',
  '5bc3451087da35075e78c589',
  '5bc3451087da35075e78c590'
)
  .then(res => console.log(res))
  .catch(e => console.log(e));
