import axios from 'axios';

const buttonNames = ['드리머리 예약페이지', '드리머리 예약관리'];
const urls = ['http://dreamary.net/#/reservations', 'http://dreamary.net/#/designer/reservations'];

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
  designerCancel: ['DES0004', buttonNames[1], urls[1], urls[1]]
};

const alarmAxios = axios.create({
  baseURL: 'http://api.apistore.co.kr/kko/1/msg/{client_id}', // client_id 필요
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-waple-authorization': '구매시 발급받은 Key의 코드값'
  }
});

const alarmTalk = options => {
  // options = {
  //   PHONE: '알람톡 보낼 번호',
  //   MSG: '전송할 메세지 - 뭔말이징',
  //   template: '저 위에 있는 템플릿 key값'
  // };
  options.FAILED_TYPE = 'N';
  options.BTN_TYPES = '웹링크';
  [options.TEMPLATE_CODE, options.BTN_TXTS, options.BTN_URLS1, options.BTN_URLS2] = alarmTemplates[options.template];
  return alarmAxios.post('/', options);
};

return { alarmTalk };
