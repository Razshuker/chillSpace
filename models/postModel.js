const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    img_url: String,
    title: String,
    description: String,
    place_url: String,
    likes: Array,
    user_id: String,
    report: {
        type: Boolean, default: false
    },
    date_created: {
        type: Date, default: Date.now
    },
})
exports.PostModel = mongoose.model("posts", schema)

exports.validatePost = (_reqBody) => {
    let joiSchema = Joi.object({
        img_url: Joi.string().min(2).max(400).allow(null, ""),
        title: Joi.string().min(2).max(100).required(),
        description: Joi.string().min(2).max(400).required(),
        place_url: Joi.string().min(2).max(400).allow(null, ""),
        user_id: Joi.string().min(2).max(400).required(),
    })
    return joiSchema.validate(_reqBody)
}