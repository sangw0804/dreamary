Dreamary
========

1. 서버 설정과 기타 credentials는 config/config.json으로 깃헙에 올리지 않고 따로 전달하겠습니다.

2. npm install 로 패키지들을 모두 다운로드 한 뒤 실행해주세요

3. npm run test로 테스트, npm run start 서버를 켤 수 있습니다.

<br><br>

## RESTful API 명세
------------------
- users
> GET /users

- recruits
> GET /recruits  <br>
> GET /recruits/:id <br>
> PATCH /recruits/:id   <br>
> POST /recruits  --body {_designer: "디자이너 유저 id값"} <br>
> DELETE /recruits/:id

- reservations
> GET /reservations <br>
> GET /reservations/:user_id  유저나 디자이너 id에 해당하는 모든 예약을 돌려줌 <br>
> POST /reservations  --body {_user: "일반 유저 id값", _designer: "디자이너 유저 id값"} <br>
> DELETE /reservations/:id

- tickets
> GET /users/:id/tickets <br>
> POST /users/:id/tickets  --body {isD: 구매유저 디자이너 여부 불린값}  <br>
> PATCH /users/:id/tickets/:ticket_id  