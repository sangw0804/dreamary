require("./config/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require('firebase-admin');
const firebase = require('firebase');
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const recruitRoutes = require("./routes/recruitRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const kakaoRoutes = require("./routes/kakaoRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// connect to db
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

// app config
app.use(bodyParser.json());
app.use(cors());

firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CONFIG)),
    databaseURL: JSON.parse(process.env.FIREBASE_CONFIG).databaseURL
});


// routes
app.use("/users/:id/tickets", ticketRoutes);
app.use("/users", userRoutes);
app.use("/recruits/:id/reviews", reviewRoutes);
app.use("/recruits", recruitRoutes);
app.use("/reservations", reservationRoutes);
app.use("/kakao_login", kakaoRoutes);


module.exports = {app};