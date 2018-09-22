let express = require("express");
let router = express.Router();
let {User} = require("../model/user");
let _ = require("lodash");

// GET /users
router.get("/", async (req, res) => {
    try {
        const foundUsers = await User.find();
        res.status(200).send(foundUsers);
    } catch(e) {
        res.send(400).send(e);
    }
});

// POST /users
router.post("/", async (req, res) => {
    try {
        let body = _.pick(req.body, ["_uid", "isD","phone","name"]); // 더 추가하면 됨
        body._tickets = [];
        body._reservations = [];
        const createdUser = await User.create(body);

        res.status(200).send(createdUser);        
    } catch(e) {
        res.status(400).send(e);
    }
})

module.exports = router;