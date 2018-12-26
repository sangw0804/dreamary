const mongoose = require('mongoose');
const firebase = require('firebase');

const config = require('../config');

firebase.initializeApp(config.FIREBASE_CONFIG);

mongoose.connect(
  'mongodb://localhost:27017/dreamary',
  { useNewUrlParser: true }
);

const migrate = async () => {
  console.log();
};
