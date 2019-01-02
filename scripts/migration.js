const mongoose = require('mongoose');
const firebase = require('firebase');

const config = require('../config');
const { User } = require('../model/user');

firebase.initializeApp(config.FIREBASE_CONFIG);

mongoose.connect(
  'mongodb://localhost:27017/dreamary',
  { useNewUrlParser: true }
);

const migrate = () => {
  firebase
    .database()
    .ref('/users')
    .once('value', res => {
      Object.values(res.val()).forEach(async user => {
        console.log(user._id);
        console.log(await User.findById(user._id));
      });
    });
};

migrate();
