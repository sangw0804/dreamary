# Dreamary

<br>

## 1. 실행 환경(Environment)

---

- node 8.11.2
- mongo 4.0.0

## 2. 설치 및 세팅방법(Install)

---

1. config/ 디렉토리 밑에 development.json , test.json 파일들은 credentials 정보를 담고 있으므로 따로 전달하겠습니다.
2. git clone || git pull 을 한다.
3. npm install 로 패키지들을 설치한다.
4. mongodb 를 27017 번 포트에 실행한다.
5. node seeds.js 로 development db 에 더미데이터를 심을 수 있다.

## 3. 실행방법(Run, Test)

---

1. npm run start 를 통해 3030 번 포트에 서버를 켤 수 있다.
2. npm run test 를 통해 테스트를 돌릴 수 있다.
3. npm run test-cover 를 통해 테스트 커버리지를 확인 할 수 있다.

<br><br>

## RESTful API 명세

---

- users

  > GET /users
  > POST /users

- recruits

  > GET /recruits <br>
  > GET /recruits/:id <br>
  > PATCH /recruits/:id <br>
  > POST /recruits <br>
  > DELETE /recruits/:id

- cards

> GET /cards <br>
> GET /recruits/:recruit_id/cards <br>
> POST /recruits/:recruit_id/cards <br>
> DELETE /recruits/:recruit_id/cards/:id

- reservations

> GET /users/:user_id/reservations/all <br>
> GET /users/:user_id/reservations <br>
> POST /users/:user_id/reservations <br>
> DELETE /users/:user_id/reservations/:id

- tickets (사용 X)
  > GET /users/:id/tickets <br>
  > POST /users/:id/tickets --body {isD: 구매유저 디자이너 여부 불린값} <br>
  > PATCH /users/:id/tickets/:ticket_id
