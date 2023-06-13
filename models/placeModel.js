const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    img_url: String,
    name: String,
    type: String,
    city: String,
    phone: String,
    location: Object,
    description: String,
    open_hours: Object,
    area: String,
    tags_name: Array,
    categories_code: Array,
    date_created: {
        type: Date, default: Date.now
    }
})
exports.PlaceModel = mongoose.model("places", schema)

exports.validatePlace = (_reqBody) => {
    let joiSchema = Joi.object({
        img_url: Joi.string().min(2).max(400).allow(null, ""),
        name: Joi.string().min(2).max(100).required(),
        type: Joi.string().min(2).max(100).required(),
        city: Joi.string().min(2).max(100).required(),
        phone: Joi.string().min(4).max(25).allow(null, ""),
        location: Joi.object().min(2).max(25).required(),
        description: Joi.string().min(2).max(1500).required(),
        open_hours: Joi.object().min(1).max(7).required(),
        area: Joi.string().min(2).max(100).required(),
        tags_name: Joi.array().min(0).max(100).allow(null, ""),
        categories_code: Joi.array().min(0).max(99).allow(null, ""),
    })
    return joiSchema.validate(_reqBody)
}