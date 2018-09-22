const {ObjectID} = require("mongodb");
const {User} = require("../../model/user");
const {Reservation} = require("../../model/reservation");
const {users, populateUsers} = require("../seed/userSeed");

const reservations = [
    {
        _id: new ObjectID(),
        _user: users[0]._id,
        _designer: users[1]._id,
        time: {
            since: new Date().getTime(),
            until: new Date().getTime()
        }
    }
];

const populateReservation = async (done) => {
    try {
        await Reservation.deleteMany({});
        await Reservation.insertMany(reservations);
        await User.findByIdAndUpdate(users[0]._id, {$set: {reservations: [reservations[0]._id]}}, {new: true});
        await User.findByIdAndUpdate(users[1]._id, {$set: {reservations: [reservations[0]._id]}}, {new: true});
        done();
    } catch(e) {
        done(e);
    }
}

module.exports = {reservations, populateReservation};