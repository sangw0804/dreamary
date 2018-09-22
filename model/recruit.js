const mongoose = require("mongoose");

const recruitSchema = new mongoose.Schema({
    _designer: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        required: true,
        type: String
    },
    ableDates: [
        {
            since: {
                type: Number,
                required: true
            },
            until: {
                type: Number,
                required: true
            }
        }
    ],
    portfolios: [
        {
            type: String
        }
    ],
    introduction: {
        type: String
    },
    requirement: {
        type: String
    },
    _reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

let Recruit = mongoose.model("Recruit", recruitSchema);

module.exports = {Recruit};