const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  full_name: String,
  img_url: String,
  phone: Number,
  email: String,
  password: String,
  location: String,
  nickname: String,
  date_created: {
    type: Date, default: Date.now
  },
  role: {
    type: String, default: "user"
  }
})
exports.UserModel = mongoose.model("users", schema)

exports.createToken = (user_id) => {
  let token = jwt.sign({ _id: user_id }, config.tokenSecret, { expiresIn: "600mins" });
  return token;
}

exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    full_name: Joi.string().min(2).max(150).required(),
    img_url: Joi.string().min(2).max(400).allow(null, ""),
    phone: Joi.number().min(1).max(25).required(),
    email: Joi.string().min(2).max(400).email().required(),
    password: Joi.string().min(2).max(400).required(),
    location: Joi.string().min(2).max(400).required(),
    nickname: Joi.string().min(2).max(100).required(),
  })
  return joiSchema.validate(_reqBody)
}
exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(1).max(300).email().required(),
    password: Joi.string().min(1).max(100).required(),
  })
  return joiSchema.validate(_reqBody)
}

