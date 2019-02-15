const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const firebase = require('firebase');
const cors = require('cors');

// const logger = require('./log');
const config = require('./config');
const userRoutes = require('./routes/userRoutes');
const recruitRoutes = require('./routes/recruitRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const kakaoRoutes = require('./routes/kakaoRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cardRoutes = require('./routes/cardRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const withdrawRoutes = require('./routes/withdrawRoutes');

const { logging } = require('./middlewares/log');
const { auth } = require('./middlewares/auth');

// connect to db
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });

// app config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

firebase.initializeApp(config.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(config.FIREBASE_ADMIN_CONFIG),
  databaseURL: config.FIREBASE_CONFIG.databaseURL
});

// routes
if (process.env.NODE_ENV !== 'test') app.use(logging);
if (process.env.NODE_ENV !== 'test') app.use(auth);
app.use('/users/:id/tickets', ticketRoutes);
app.use('/users/:user_id/reservations', reservationRoutes);
app.use('/users', userRoutes);
app.use('/recruits/:recruit_id/reviews', reviewRoutes);
app.use('/recruits', recruitRoutes);
app.use('/coupons', couponRoutes);
app.use('/kakao_login', kakaoRoutes);
app.use('/inquiries', inquiryRoutes);
app.use('/', cardRoutes);
app.use('/certification', certificationRoutes);
app.use('/notices', noticeRoutes);
app.use('/events', eventRoutes);
app.use('/withdraws', withdrawRoutes);

module.exports = { app };
