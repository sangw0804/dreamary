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

// connect to db
mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

// app config
app.use(bodyParser.json());
app.use(cors());

firebase.initializeApp(config.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(config.FIREBASE_ADMIN_CONFIG),
  databaseURL: config.FIREBASE_CONFIG.databaseURL
});

// routes
app.use('/users/:id/tickets', ticketRoutes);
app.use('/users', userRoutes);
app.use('/recruits/:id/cards/:card_id/reservations', reservationRoutes);
app.use('/recruits/:id/cards', cardRoutes);
app.use('/recruits/:id/reviews', reviewRoutes);
app.use('/recruits', recruitRoutes);
app.use('/kakao_login', kakaoRoutes);

module.exports = { app };
