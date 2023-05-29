const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    img_url: String,
    title: String,
    location: Object,
    description: String,
    place_url: String,
    user_id: string,
    nickname: string,
    date_created: {
        type: Date, default: Date.now
    },
})
exports.PostModel = mongoose.model("posts", schema)

exports.validatePost = (_reqBody) => {
    let joiSchema = Joi.object({
        img_url: Joi.string().min(2).max(400).allow(null, ""),
        title: Joi.string().min(2).max(100).required(),
        location: Joi.object().min(2).max(2).allow(null, ""),
        description: Joi.string().min(2).max(400).required(),
        place_url: Joi.string().min(2).max(400).allow(null, ""),
    })
    return joiSchema.validate(_reqBody)
}