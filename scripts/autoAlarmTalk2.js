const mongoose = require('mongoose');
const firebase = require('firebase');

const config = require('../config');

mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

// 매일 09:05 에 전날에 완료되었어야 하는데 완료되지 않은 예약 찾아서 디자이너에게 알람톡 보내기.

firebase.initializeApp(config.FIREBASE_CONFIG);

const { alarmTalk } = require('../routes/helpers/alarmTalk');
const { Reservation } = require('../model/reservation');

const autoAlarmTalk = async () => {
  try {
    const nowTimeStamp = new Date().getTime();
    const reservations = await Reservation.find({
      isCanceled: false,
      isDone: false,
      date: { $gt: nowTimeStamp - 140000000, $lt: nowTimeStamp - 7200000}
    });
    console.log(reservations);

    return reservations.map(async reservation => {
      try {
        await alarmTalk('designerServiceDone', reservation._user, reservation._designer, reservation._id);
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

autoAlarmTalk()
  .then(promises => Promise.all(promises))
  .then(() => console.log('success!'))
  .catch(e => console.log(e));
