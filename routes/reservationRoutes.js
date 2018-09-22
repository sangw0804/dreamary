const express = require("express");
const router = express.Router({mergeParams: true});
const _ = require("lodash");
const {Reservation} = require("../model/reservation");
const {User} = require("../model/user");

// GET /reservations
router.get("/", async (req, res) => {
    try {
        const foundReservations = await Reservation.find({});
        res.status(200).send(foundReservations);
    } catch(e) {
        res.status(400).send(e);
    }
})

// GET /reservations/:user_id
router.get("/:user_id", async (req, res) => {
    try {
        const foundReservations = await Reservation.find({
            $or: [{_user: req.params.user_id}, {_designer: req.params.user_id}]
        }).populate("_designer").exec();
        console.log(foundReservations);
        res.status(200).send(foundReservations);
    } catch(e) {
        res.status(400).send(e);
    }
})

// POST /reservations
router.post("/", async (req, res) => {
    try {
        let body = _.pick(req.body, ["_user", "_designer", "time"]);
        const user = await User.findById(body._user);
        const designer = await User.findById(body._designer);
        if(!user || !designer) {
            throw new Error("user not found!!");
        }
        const createdReservation = await Reservation.create(body);

        user._reservations.push(createdReservation._id);
        designer._reservations.push(createdReservation._id);

        await user.save();
        await designer.save();

        res.status(200).send(createdReservation);
    } catch(e) {
        res.status(400).send(e);
    }
});

// DELETE /reservations/:id
router.delete("/:id", async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndRemove(req.params.id);
        if(!reservation) {
            throw new Error("reservation not found!!");
        }
        const user = await User.findById(reservation._user);
        user._reservations = user._reservations.filter((reservation) => reservation.toHexString() !== req.params.id)
        const designer = await User.findById(reservation._designer);
        designer._reservations = designer._reservations.filter((reservation) => reservation.toHexString() !== req.params.id);

        await user.save();
        await designer.save();

        res.status(200).send();
    } catch(e) {
        res.status(400).send(e);
    }
})


module.exports = router;