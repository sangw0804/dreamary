const express = require("express");
const router = express.Router({mergeParams: true});
const _ = require("lodash");
const {User} = require("../model/user");
const {Ticket} = require("../model/ticket");

// GET /users/:id/tickets
router.get("/", async (req, res) => {
    try {
        const foundUser = await User.findOne({_id: req.params.id});
        if(!foundUser) {
            throw new Error("user not found!");
        }
        const foundTickets = await Ticket.find({_user: foundUser._id});
        res.status(200).send(foundTickets);
    } catch(e) {
        res.status(400).send(e);
    }
});

// POST /users/:id/tickets
router.post("/", async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id});
        if(!user) {
            throw new Error("user not found!!");
        }
        let data = _.pick(req.body, ["isD", "price"]);
        data._user = req.params.id;
        data.purchasedAt = new Date().getTime();

        const createdTicket = await Ticket.create(data);

        user._tickets.push(createdTicket._id);

        await user.save();

        res.status(200).send(createdTicket);
    } catch(e) {
        // console.log(e);
        res.status(400).send(e);
    }
});

// PATCH /users/:id/tickets/:ticket_id
router.patch("/:ticket_id", async (req, res) => {
    try {
        const foundUser = await User.findOne({_id:req.params.id});
        if(!foundUser) {
            throw new Error("user not found!!");
        }
        let body = _.pick(req.body, ["expiredAt"]);
        body.expiredAt = new Date().getTime();
        const updatedTicket = await Ticket.findOneAndUpdate({_id:req.params.ticket_id}, {$set: body}, {new: true});

        res.status(200).send(updatedTicket);
    } catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;