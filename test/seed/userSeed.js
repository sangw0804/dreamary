const {ObjectID} = require("mongodb");
const {User} = require("../../model/user");

// User
const users = [
    {
        _id: new ObjectID(),
        isD: false,
        name: "오상우",
        phone: "01087623725",
        locations: null,
        _uid: "123",
        tickets: [],
        reservations: []
    },{
        _id: new ObjectID(),
        isD: true,
        name: "안운장",
        phone: "01012345678",
        locations: [
            {
                region: "성북구",
                shop: "준오헤어",
                address: "성북구 안암로 12길 234 2층"
            }
        ],
        _uid: "456",
        tickets: [],
        reservations: []
    },{
        _id: new ObjectID(),
        isD: true,
        name: "신한결",
        phone: "01033424232",
        locations: [
            {
                region: "강서구",
                shop: "바른헤어",
                address: "강서구 강서로 45길 97"
            }
        ],
        _uid: "789",
        tickets: [],
        reservations: []
    }
]

const populateUsers = async (done) => {
    try {
        await User.deleteMany({});
        await User.insertMany(users);
        done();
    } catch(e) {
        done(e);
    }
}


module.exports = {users, populateUsers};