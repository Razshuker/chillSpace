const express = require("express");
const { TypeModel, validateType } = require("../models/typeModel");
const { authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 5;
    const page = req.query.page - 1 || 0;
    try {
        const data = await TypeModel.find({})
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
        const data = await TypeModel.findOne({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/count", async (req, res) => {
    try {
        const count = await TypeModel.count();
        res.status(200).json(count);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.post("/", authAdmin, async (req, res) => {
    let validBody = validateType(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details)
    }
    try {
        let newType = new TypeModel(req.body);
        await newType.save();
        res.status(201).json(newType);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", authAdmin, async (req, res) => {
    const id = req.params.id;
    const validBody = validateType(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details)
    }
    try {
        const data = await TypeModel.updateOne({ _id: id }, req.body)
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
        const data = await TypeModel.deleteOne({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;