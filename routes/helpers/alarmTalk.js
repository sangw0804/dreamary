const axios = require('axios');
const firebase = require('firebase');
const querystring = require('querystring');
const { User } = require('../../model/user');
const { Reservation } = require('../../model/reservation');
const config = require('../../config');
const { sendMailPromise } = require('./mailer');
const logger = process.env.NODE_ENV !== 'test' ? require('../../log') : false;

const buttonNames = ['드리머리 예약페이지', '드리머리 예약관리'];
const urls = ['http://dreamary.net/#/reservations', 'http://dreamary.net/#/designer/reservations'];

const serviceNiceName = {
  cut: '컷트',
  perm: '펌',
  dye: '염색'
};

const alarmTemplates = {
  userReservationInformNow: ['USER001', buttonNames[0], urls[0], urls[0]],
  userReservationInformAgain: ['USER002', buttonNames[0], urls[0], urls[0]],
  userCancelInDay: ['USER003', buttonNames[0], urls[0], urls[0]],
  userCancelAfterDay: ['USER004', buttonNames[0], urls[0], urls[0]],
  designerCancelInformUser: ['USER005', buttonNames[0], urls[0], urls[0]],
  userPleaseReview: ['USER006', buttonNames[0], urls[0], urls[0]],
  designerReservationInformNow: ['DESI007', buttonNames[1], urls[1], urls[1]],
  designerReservationInformAgain: ['DESI002', buttonNames[1], urls[1], urls[1]],
  userCancelInformDesigner: ['DESI003', buttonNames[1], urls[1], urls[1]],
  designerCancel: ['DESI004', buttonNames[1], urls[1], urls[1]],
  designerServiceDone: ['DESI005', buttonNames[1], urls[1], urls[1]]
};

const alarmAxios = axios.create({
  baseURL: 'http://api.apistore.co.kr/kko/1/msg/dreamary',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-waple-authorization': config.API_STORE_KEY
  }
});

const alarmTalk = async (template, user_id, designer_id, reservation_id, options = {}) => {
  try {
    // options = {
    //   PHONE: '알람톡 보낼 번호',
    //
    // };
    // template: '저 위에 있는 템플릿 key값'
    options.FAILED_TYPE = 'N';
    options.BTN_TYPES = '웹링크';
    options.CALLBACK = '01041112486';
    [options.TEMPLATE_CODE, options.BTN_TXTS, options.BTN_URLS1, options.BTN_URLS2] = alarmTemplates[template];

    const user = await User.findById(user_id);
    const designer = await User.findById(designer_id);
    const reservation = await Reservation.findById(reservation_id)
      .populate({ path: '_card' })
      .exec();
    const card = reservation._card;
    const dateObj = new Date(reservation.date);
    const dateString = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
    const startTimeString = `${Math.floor(reservation.time.since / 60)}:${reservation.time.since % 60}`;
    const servicesString = Object.keys(reservation.services)
      .filter(serviceName => reservation.services[serviceName])
      .map(serviceName => serviceNiceName[serviceName])
      .join(', ');

    switch (template) {
      // 고객 예약 바로안내 * * * * * * * * * * * * * * * *
      case 'userReservationInformNow':
        options.MSG = `${user.name}님! 드리머리 서비스를 예약해주셔서 감사합니다. 

  일시: ${dateString}, ${startTimeString}
  장소: ${card.fullAddress}, ${card.shop}
  예디명: ${designer.name} 예디
  서비스종류: ${servicesString}

  문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  아울러, 예디님들께서 메시지로 구체적인 장소 및 상담 진행을 도와드리고자 하시는 경우가 많으니 홈페이지 우측 상단의 메시지 확인부탁드립니다^^

  www.dreamary.net`;
        break;

      // 고객 예약 전날 재안내 * * * * * * * * * * * * * * * *
      case 'userReservationInformAgain':
        options.MSG = `${user.name}님! 내일은 서비스가 예약되어 있는 날입니다. 

  일시: ${dateString}, ${startTimeString}
  장소: ${card.fullAddress}, ${card.shop}
  예디명: ${designer.name} 예디
  서비스종류: ${servicesString} 

  혹, 개인 사정으로 내일 서비스를 받기 어려우신 경우 필히 드리머리에 접속해서 미리 ‘예약취소’ 를 클릭해주세요. 

  노쇼는 누군가의 시간과 정성에 대한 결례입니다.

  문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      // 고객 24시간이전 취소 안내 * * * * * * * * * * * * * * * *
      case 'userCancelInDay':
        options.MSG = `${user.name}님! ${dateString}에 예약된 서비스를 취소하셨습니다. 

  서비스 24시간 이전에 취소하셨으므로 5,000P가 계정으로 환급되었습니다.

  이의신청/문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      // 고객 24시간이내 취소 안내 * * * * * * * * * * * * * * * *
      case 'userCancelAfterDay':
        options.MSG = `${user.name}님! ${dateString}에 예약된 서비스를 취소하셨습니다.

  서비스가 24시간이 남지 않은 시점에 취소가 이루어 졌으므로 포인트는 환급되지 않습니다.

  당일 취소 3회 시 서비스 사용이 영구적으로 제한됩니다.

  이의신청/문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      // 디자이너로 인한 고객예약 취소 안내 * * * * * * * * * * * * * * * *
      case 'designerCancelInformUser':
        options.MSG = `${user.name}님, 대단히 죄송합니다.

  예약하신 아래의 서비스는 예디님의 사정으로 인해 취소되었습니다.

  일시: ${dateString} ${startTimeString}
  장소: ${card.fullAddress} ${card.shop} 
  예디명: ${designer.name} 예디
  서비스종류: ${servicesString} 

  취소사유: ${reservation.cancelReason} 

  드리머리는 노쇼/당일취소 방지를 위해 당사자들에 대해 서비스 영구사용 제한 등의 조치를 취하고 있습니다. 

  다시는 이런 사례가 없도록 더욱 발전하는 드리머리가 되겠습니다. 다시 한 번 고개숙여 사과드립니다.

  ${user.name}님의 계정에 5,000P가 환급되었습니다.

  문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      // 고객 서비스리뷰 부탁 안내 * * * * * * * * * * * * * * * * * *
      case 'userPleaseReview':
        options.MSG = `${user.name}님! 오늘 서비스는 어떠셨나요?

  ${designer.name} 예디님의 서비스에 만족하셨다면 꿈을 응원하는 의미로 정성스런 리뷰를 작성해주세요!

  www.dreamary.net

  혹시 서비스가 정상적으로 이루어지지 않았거나 문의사항이 있으시다면 플러스친구 ‘드리머리’로 부탁드립니다.`;
        break;

      // 디자이너 예약 바로안내 * * * * * * * * * * * * * * * * * * * *
      case 'designerReservationInformNow':
        options.MSG = `${designer.name}님! 새로운 예약이 있습니다.

  일시: ${dateString} ${startTimeString}
  장소: ${card.fullAddress} ${card.shop}
  모델명: ${user.name}님
  서비스종류: ${servicesString} 

  고객님과의 구체적인 상담을 위해 페이지 우측 상단의 메시지 기능을 활용해주시기 바랍니다.

  문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      // 디자이너 연락 전날 재안내 * * * * * * * * * * * * * * * * * *
      case 'designerReservationInformAgain':
        options.MSG = `${designer.name}님! 내일은 서비스가 예약되어 있는 날입니다. 

  일시: ${dateString} ${startTimeString}
  장소: ${card.fullAddress}, ${card.shop}
  모델명: ${user.name}님
  서비스종류: ${servicesString} 

  개인 사정으로 서비스가 어려운 경우 필히 드리머리에 접속해서 미리 ‘예약취소’ 를 클릭해주세요.
 
  노쇼는 누군가의 시간과 정성에 대한 결례입니다.

  문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      // 고객으로 인한 디자이너 연락 취소 안내 * * * * * * * * * * * * * * * * *
      case 'userCancelInformDesigner':
        options.MSG = `${designer.name}님, 대단히 죄송합니다.

  예약하신 아래의 서비스는 고객님의 사정으로 인해 취소되었습니다.

  일시: ${dateString} ${startTimeString}
  장소: ${card.fullAddress} ${card.shop}
  모델명: ${user.name}님
  서비스종류: ${servicesString} 

  취소사유: ${reservation.cancelReason} 

  드리머리는 노쇼/당일취소 방지를 위해 당사자들에 대해 서비스 영구사용 제한 등의 조치를 취하고 있습니다. 

  다시는 이런 사례가 없도록 더욱 발전하는 드리머리가 되겠습니다. 다시 한 번 고개숙여 사과드립니다.

  문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      // 디자이너가 취소한 경우 알림톡 * * * * * * * * * * * * * * * *
      case 'designerCancel':
        options.MSG = `${designer.name}님! ${dateString}에 예약된 서비스를 취소하셨습니다.

  합당한 사유 없이 예약을 취소하신 경우 향후 불이익이 발생할 수 있습니다.

  이의신청/문의사항은 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      // 디자이너가 서비스 완료했어야 할 시점에 보내는 알림톡 * * * * * * * * * * *
      case 'designerServiceDone':
        options.MSG = `${designer.name}님! ${dateString}에 예약된 서비스는 순조롭게 진행 되었나요?

  “예약관리”탭에서 “서비스 완료” 버튼을 눌러주셔야 고객분께서 리뷰를 작성해주실 수 있으니, 지금 바로 클릭해주세요!

  혹시 서비스가 정상적으로 이루어지지 않았거나 문의사항이 있으시다면 플러스친구 ‘드리머리’로 부탁드립니다.

  www.dreamary.net`;
        break;

      default:
        throw new Error('wrong template!!');
        break;
    }

    const snapshot = await firebase
      .database()
      .ref(`/users/${alarmTemplates[template][0].includes('USE') ? user._uid : designer._uid}`)
      .once('value');
    const { phoneNumber } = snapshot.val();

    options.PHONE = phoneNumber;

    const { data } = await alarmAxios.post('/', querystring.stringify(options));
    if (data.result_code !== '200') throw new Error(data);
  } catch (e) {
    if (logger) logger.error('alarmTalk Error : %o', e);
    if (logger) logger.error('alarmTalk Error : %o', options);
    try {
      await sendMailPromise(e, options);
    } catch (err) {
      if (logger) logger.error('alarmTalk Error - Send Mail : %o', err);
    }
  }
};

module.exports = { alarmTalk };
