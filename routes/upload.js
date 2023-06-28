const express = require("express");
const cloudinary = require("cloudinary").v2;
const { config } = require("../config/secret");
const router = express.Router();
const { auth } = require("../middlewares/auth");

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});


router.get("/", async (req, res) => {
    res.json({ msg: "upload word" });
})

router.post("/uploadCloudUser", auth, async (req, res) => {
    try {
        const data = await cloudinary.uploader.upload(req.body.image, { unique_filename: true });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})
router.post("/uploadCloud", async (req, res) => {
    try {
        const data = await cloudinary.uploader.upload(req.body.image, { unique_filename: true });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;