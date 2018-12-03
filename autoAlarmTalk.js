const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017/dreamary',
  { useNewUrlParser: true }
);

// 매일 19:50분에 내일 시술 예정인 취소되지 않은 예약을 찾아 예디 & 유저에게 알림톡 발송

const { alarmTalk } = require('./routes/helpers/alarmTalk');
const { User } = require('./model/user');
const { Reservation } = require('./model/reservation');

const autoAlarmTalk = async () => {
  try {
    const nowTimeStamp = new Date().getTime();
    const reservations = await Reservation.find({
      isCanceled: false,
      date: { $gt: nowTimeStamp, $lt: nowTimeStamp + 54000000 }
    });

    return reservations.map(async reservation => {
      try {
        await alarmTalk('userReservationInformAgain', reservation._user, reservation._designer, reservation._id);
        await alarmTalk('designerReservationInformAgain', reservation._user, reservation._designer, reservation._id);
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
  .catch(e => console.log(e));
