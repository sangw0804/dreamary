import axios from 'axios';

const alarmTemplates = {
  userReservationInformNow: ['USE0001'],
  userReservationInformAgain: ['USE0002'],
  userCancelInDay: ['USE0003'],
  userCancelAfterDay: ['USE0004'],
  designerCancelInfromUser: ['USE0005'],
  userPleaseReview: ['USE0006'],
  designerReservationInformNow: ['DES0001'],
  designerReservationInformAgain: ['DES0002'],
  userCancelInfromDesigner: ['DES0003'],
  designerCancel: ['DES0004']
};

const alarmAxios = axios.create({
  baseURL: 'http://api.apistore.co.kr/kko/1/msg/{client_id}',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    charset: 'UTF-8',
    'x-waple-authorization': '구매시 발급받은 Key의 코드값'
  }
});

const alarmTalk = options => {
  options = {
    PHONE: '알람톡 보낼 번호',
    MSG: '전송할 메세지 - 뭔말이징',
    template: '저 위에 있는 템플릿 key값'
  };
  options.FAILED_TYPE = 'N';
  options.BTN_TYPES = '웹링크';
  options.TEMPLATE_CODE = alarmTemplates[options.template];
  if (!options.TEMPLATE_CODE) return 'template 변수값이 잘못되었습니다.';
  alarmAxios.post('/', options);
};
