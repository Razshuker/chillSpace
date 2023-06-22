const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    name: String,
    description: String,
    category_code: String,
    img_url: String,
    date_created: {
        type: Date, default: Date.now
    },
})
exports.CategoryModel = mongoose.model("categories", schema)

exports.validateCategory = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        img_url: Joi.string().min(2).max(250).allow(null, ""),
        description: Joi.string().min(2).max(400).required(),
        category_code: Joi.string().min(2).max(50).required()
    })
    return joiSchema.validate(_reqBody)
}