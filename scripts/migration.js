const mongoose = require('mongoose');
const firebase = require('firebase');

const config = require('../config');
const { User } = require('../model/user');

firebase.initializeApp(config.FIREBASE_CONFIG);

mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

const migrate = () => {
  firebase
    .database()
    .ref('/users')
    .once('value', res => {
      Object.values(res.val()).forEach(async (user, index) => {
        // let mongoUser = await User.findByIdAndUpdate(user._id, { $set: { ...user } }, { new: true });
        console.log(mongoUser);
      });
    });
};

migrate();
