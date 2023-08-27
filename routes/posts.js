const express = require("express");
const { PostModel, validatePost } = require("../models/postModel");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 5;
    const page = req.query.page - 1 || 0;
    const search = req.query.s;
    const user = req.query.user;
    const place = req.query.place;
    const reverse = req.query.reverse == "yes" ? 1 : -1;
    let myFilter = {};
    try {
        if (search) {
            let searchExp = new RegExp(search, "i");
            myFilter = { title: searchExp }
        }
        else if (place) {
            myFilter = { place_url: place }
        }
        if (user) {
            myFilter = { user_id: user };
        }
        const data = await PostModel
            .find(myFilter)
            .limit(perPage)
            .skip(perPage * page)
            .sort({ date_created: reverse })
            .populate("likes","nickname img_url")
            .exec();
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

// router.get("/", async (req, res) => {
//     const perPage = req.query.perPage || 5;
//     const page = req.query.page - 1 || 0;
//     const search = req.query.s;
//     const user = req.query.user;
//     const place = req.query.place;
//     const reverse = req.query.reverse == "yes" ? 1 : -1;
//     let myFilter = {};
//     try {
//         if (search) {
//             let searchExp = new RegExp(search, "i");
//             myFilter = { title: searchExp }
//         }
//         else if (place) {
//             myFilter = { place_url: place }
//         }
//         if (user) {
//             myFilter = { user_id: user };
//         }
//         const data = await PostModel
//             .find(myFilter)
//             .limit(perPage)
//             .skip(perPage * page)
//             .sort({ date_created: reverse })
//         res.status(200).json(data);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(502).json({ err })
//     }
// })

router.get("/count", async (req, res) => {
    try {
        const search = req.query.s;
        const user = req.query.user;
        const place = req.query.place;
        let myFilter = {};
        if (search) {
            let searchExp = new RegExp(search, "i");
            myFilter = { title: searchExp }
        }
        else if (place) {
            myFilter = { place_url: place }
        }
        if (user) {
            myFilter = { user_id: user };
        }
        const count = await PostModel.countDocuments(myFilter);
        res.status(200).json(count);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.get("/reported", authAdmin, async (req, res) => {
    try {
        const data = await PostModel.find({ report: true })
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

router.patch("/changeLike/:idPost", auth, async (req, res) => {
    try {
        const idPost = req.params.idPost;
        const idUser = req.tokenData._id;
        const post = await PostModel.findOne({ _id: idPost })
        if (post.likes.includes(idUser)) {
            const data = await PostModel.updateOne({ _id: idPost }, { $pull: { likes: idUser } })
            res.status(200).json({ data, isAdded: false });
        }
        else {
            const data = await PostModel.updateOne({ _id: idPost }, { $push: { likes: idUser } })
            res.status(200).json({ data, isAdded: true });
        }
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

router.delete("/:id", auth, async (req, res) => {
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