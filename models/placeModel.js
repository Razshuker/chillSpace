const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    img_url: String,
    name: String,
    type: String,
    categories_code: Array,
    city: String,
    phone: String,
    location: Object,
    description: String,
    open_hours: Object,
    area: String,
    date_created: {
        type: Date, default: Date.now
    },
    tags_name: Array
})
exports.PlaceModel = mongoose.model("places", schema)

exports.validatePlace = (_reqBody) => {
    let joiSchema = Joi.object({
        img_url: Joi.string().min(2).max(400).allow(null, ""),
        name: Joi.string().min(2).max(100).required(),
        phone: Joi.string().min(4).max(25).allow(null, ""),
        type: Joi.string().min(2).max(100).required(),
        categories_id: Joi.array().min(0).max(99).allow(null, ""),
        city: Joi.string().min(2).max(100).required(),
        location: Joi.object().min(2).max(2).required(),
        description: Joi.string().min(2).max(1500).required(),
        open_hours: Joi.object().min(1).max(7).required(),
        area: Joi.string().min(2).max(100).required(),
        tags_id: Joi.array().min(0).max(100).allow(null, ""),
    })
    return joiSchema.validate(_reqBody)
}