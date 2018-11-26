const axios = require('axios');
const { User } = require('../../model/user');
const { Reservation } = require('../../model/reservation');
const config = require('../../config');

const buttonNames = ['드리머리 예약페이지', '드리머리 예약관리'];
const urls = ['http://dreamary.net/#/reservations', 'http://dreamary.net/#/designer/reservations'];

const serviceNiceName = {
  cut: '컷트',
  perm: '펌',
  dye: '염색'
};

const alarmTemplates = {
  userReservationInformNow: ['USE0001', buttonNames[0], urls[0], urls[0]],
  userReservationInformAgain: ['USE0002', buttonNames[0], urls[0], urls[0]],
  userCancelInDay: ['USE0003', buttonNames[0], urls[0], urls[0]],
  userCancelAfterDay: ['USE0004', buttonNames[0], urls[0], urls[0]],
  designerCancelInfromUser: ['USE0005', buttonNames[0], urls[0], urls[0]],
  userPleaseReview: ['USE0006', buttonNames[0], urls[0], urls[0]],
  designerReservationInformNow: ['DES0001', buttonNames[1], urls[1], urls[1]],
  designerReservationInformAgain: ['DES0002', buttonNames[1], urls[1], urls[1]],
  userCancelInfromDesigner: ['DES0003', buttonNames[1], urls[1], urls[1]],
  designerCancel: ['DES0004', buttonNames[1], urls[1], urls[1]],
  designerServiceDone: ['DES0005', buttonNames[1], urls[1], urls[1]]
};

const alarmAxios = axios.create({
  baseURL: 'http://api.apistore.co.kr/kko/1/msg/dreamary',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-waple-authorization': config.API_STORE_KEY
  }
});

const alarmTalk = async (template, user_id, designer_id, reservation_id, options) => {
  // options = {
  //   PHONE: '알람톡 보낼 번호',
  //
  // };
  // template: '저 위에 있는 템플릿 key값'
  options.FAILED_TYPE = 'N';
  options.BTN_TYPES = '웹링크';
  [options.TEMPLATE_CODE, options.BTN_TXTS, options.BTN_URLS1, options.BTN_URLS2] = alarmTemplates[template];

  const user = await User.findById(user_id);
  const designer = await User.findById(designer_id);
  const reservation = await Reservation.findById(reservation_id)
    .populate({ path: '_card' })
    .exec();
  const card = reservation._card;
  const dateObj = new Date(reservation.date);
  const dateString = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
  const servicesString = Object.keys(reservation.services)
    .filter(serviceName => reservation.services[serviceName])
    .map(serviceName => serviceNiceName[serviceName])
    .join(', ');

  switch (template) {
    case 'userReservationInformNow':
      options.MSG = `#{${user.name}}님! 드리머리 서비스를 예약해주셔서 감사합니다. 

일시: #{${dateString}}
장소: #{${card.fullAddress}}, #{${card.shop}}
예디명: #{${designer.name}} 예디
서비스종류: #{${servicesString}} 

지참하실 추가비용의 예상금액은 드리머리 예약완료페이지를 참고해주세요:) 

문의사항은 플러스친구 ‘드리머리 고객센터’로 부탁드립니다.`;
      break;
    // case "":
    //   break;
    // case :
    //   break;
    // case :
    //   break;
    // case :
    //   break;
    // case :
    //   break;
    // case :
    //   break;
    // case :
    //   break;
    // case :
    //   break;
    // case :
    //   break;
    default:
      throw new Error('wrong template!!');
      break;
  }
  return alarmAxios.post('/', options);
};

module.exports = { alarmTalk };
