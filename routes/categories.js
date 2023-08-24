const express = require("express");
const { CategoryModel, validateCategory } = require("../models/categoryModel");
const { required } = require("joi");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 6;
    const page = req.query.page - 1 || 0;
    try {
        const data = await CategoryModel.find({})
            .limit(perPage)
            .skip(perPage * page)
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/count", async (req, res) => {
    try {
        const count = await CategoryModel.count();
        res.status(200).json(count);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/single/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await CategoryModel.findOne({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.post("/", authAdmin, async (req, res) => {
    let validBody = validateCategory(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details);
    }
    try {
        const newCat = new CategoryModel(req.body)
        await newCat.save();
        res.status(200).json(newCat);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", authAdmin, async (req, res) => {
    const id = req.params.id;
    let validBody = validateCategory(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details);
    }
    try {
        const data = await CategoryModel.updateOne({ _id: id }, req.body)
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:id", authAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const data = await CategoryModel.deleteOne({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;