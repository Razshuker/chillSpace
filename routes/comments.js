const express = require("express");
const { CommentModel, validateComment } = require("../models/commentModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 5;
    const page = req.query.page - 1 || 0;
    try {
        const data = await CommentModel.find({})
            .limit(perPage)
            .skip(perPage * page)
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})
router.get("/:idPost", async (req, res) => {
    const idPost = req.params.idPost;
    try {
        const data = await CommentModel.find({post_id:idPost})
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
        const data = await CommentModel.findOne({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.post("/", async (req, res) => {
    const validBody = validateComment(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details)
    }
    try {
        const newComment = new CommentModel(req.body)
        await newComment.save();
        res.status(200).json(newComment);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const validBody = validateComment(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details)
    }
    try {
        const data = await CommentModel.updateOne({ _id: id }, req.body)
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await CommentModel.deleteOne({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;