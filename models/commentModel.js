const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    text: String,
    user_id: String,
    post_id: String,
    date_created: {
        type: Date, default: Date.now
    },
})
exports.CommentModel = mongoose.model("comments", schema)

exports.validateComment = (_reqBody) => {
    let joiSchema = Joi.object({
        text: Joi.string().min(2).max(400).required()
    })
    return joiSchema.validate(_reqBody)
}