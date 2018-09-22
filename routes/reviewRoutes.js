const express = require("express");
const router = express.Router({mergeParams: true});
const _ = require("lodash");
const {Review} = require("../model/review");
const {Recruit} = require("../model/recruit");

// POST /recruits/:id/reviews
router.post("/", async (req, res) => {
    try {
        const recruit = await Recruit.findById(req.params.id);
        if(!recruit) {
            throw new Error("recruit not found!");
        }
        let body = _.pick(req.body, ["_user", "content", "score"]);
        body = {
            ...body,
            createdAt: new Date().getTime(),
            _recruit: req.params.id
        };
    
        const createdReview = await Review.create(body);
        recruit._reviews.push(createdReview._id);
        await recruit.save();
    
        res.status(200).send(createdReview);   
    } catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;