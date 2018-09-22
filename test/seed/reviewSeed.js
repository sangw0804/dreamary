const {ObjectID} = require("mongodb");
const {Review} = require("../../model/review");
const {Recruit} = require("../../model/recruit");
const {recruits} = require("./recruitSeed");
const {users} = require("../seed/userSeed");

const reviews = [
    {
        _id: new ObjectID(),
        _recruit: recruits[0]._id,
        _user: users[0]._id,
        score: 4.0,
        content: "상당히 잘 자르시네요",
        createdAt: new Date().getTime()
    }
];

const populateReview = async (done) => {
    try {
        await Review.remove({});
        await Review.insertMany(reviews);
        done();
    } catch(e) {
        done(e);
    }
}

module.exports = {reviews, populateReview};