const express = require("express");
const { validatePlace, PlaceModel } = require("../models/placeModel");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 6;
    const page = req.query.page - 1 || 0;
    try {
        const data = await PlaceModel.find({})
            .limit(perPage)
            .skip(page * perPage)
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
        const data = await PlaceModel.findOne({ _id: id });
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.post("/", async (req, res) => {
    let validBody = validatePlace(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details)
    }
    try {
        let newPlace = new PlaceModel(req.body);
        await newPlace.save();
        res.status(200).json(newPlace);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", authAdmin, async (req, res) => {
    const id = req.params.id;
    let validBody = validatePlace(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details)
    }
    try {
        let updatePlace = await PlaceModel.updateOne({ _id: id }, req.body);
        res.status(200).json(updatePlace);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:id", authAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        let data = await PlaceModel.deleteOne({ _id: id });
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


module.exports = router;