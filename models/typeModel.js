const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    type_name: String,
    date_created: {
        type: Date, default: Date.now
    },
})
exports.TypeModel = mongoose.model("types", schema)

exports.validateType = (_reqBody) => {
    let joiSchema = Joi.object({
        type_name: Joi.string().min(2).max(100).required(),
    })
    return joiSchema.validate(_reqBody)
}