const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    tag_name: String,
    date_created: {
        type: Date, default: Date.now
    },
})
exports.TagModel = mongoose.model("tags", schema)

exports.validateTag = (_reqBody) => {
    let joiSchema = Joi.object({
        tag_name: Joi.string().min(2).max(100).required(),
    })
    return joiSchema.validate(_reqBody)
}