const express = require("express");
const { PostModel, validatePost } = require("../models/postModel");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 5;
    const page = req.query.page - 1 || 0;
    try {
        const data = await PostModel.find({})
            .limit(perPage)
            .skip(perPage * page)
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})
router.get("/reported", async (req, res) => {
    const perPage = req.query.perPage || 5;
    const page = req.query.page - 1 || 0;
    try {
        const data = await PostModel.find({ report: true })
            .limit(perPage)
            .skip(perPage * page)
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/single/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await PostModel.findOne({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.post("/", async (req, res) => {
    const validBody = validatePost(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details)
    }
    try {
        const newPost = new PostModel(req.body)
        await newPost.save();
        res.status(200).json(newPost);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const validBody = validatePost(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details)
    }
    try {
        const data = await PostModel.updateOne({ _id: id }, req.body)
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.patch("/addLike/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await PostModel.updateOne({ _id: id }, { $inc: { likes: 1 } })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.patch("/confirmPost/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await PostModel.updateOne({ _id: id }, { report: false })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.patch("/reportPost/:id/:report", async (req, res) => {
    try {
        const id = req.params.id;
        const report = req.params.report == "true" ? false : true;
        const data = await PostModel.updateOne({ _id: id }, { report: report })
        return res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await PostModel.deleteOne({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;