
require("dotenv").config();

exports.config = {
  mongoUser: process.env.DBUSER,
  mongoPass: process.env.DBPASS,
  tokenSecret: process.env.TOKENSECRET,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET

}