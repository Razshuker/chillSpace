const express = require("express");
const { validatePlace, PlaceModel } = require("../models/placeModel");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 6;
    const page = req.query.page - 1 || 0;
    const s = req.query.s;
    const area = req.query.area;
    const tags = req.query.tags;
    const types = req.query.types;
    const cats = req.query.cats;
    let myFilter = {};
    try {
        let searchExp = new RegExp(s, "i");
        if (s) {
            myFilter = {
                $or: [
                    { name: searchExp },
                    { description: searchExp },
                ],
            };
        }
        if (area) {
            const areasArray = area.split(',');
            myFilter.area = { $in: areasArray };
        }
        if (tags) {
            const tagsArray = tags.split(',');
            myFilter.tags_name = { $in: tagsArray };
        }
        if (types) {
            const typesArray = types.split(',');
            myFilter.type = { $in: typesArray };
        }
        if (cats) {
            const catsArray = cats.split(',');
            myFilter.categories_code = { $in: catsArray };
        }
        const data = await PlaceModel.find(myFilter)
            .limit(perPage)
            .skip(page * perPage);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

router.get("/count", async (req, res) => {
    try {
        const count = await PlaceModel.count();
        res.status(200).json(count);

    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/tagsArr", async (req, res) => {
    let perPage = req.query.perPage || 5;
    let page = req.query.page - 1 || 0;
    try {
        let data = await PlaceModel
            .find({}, { _id: 1, tags_name: 1 })
            .limit(perPage)
            .skip(perPage * page);
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})

router.get("/whereToTravel", async (req, res) => {
    const tags_ar = req.query.tags_ar;
    const members = req.query.members;
    const kind = req.query.kind;
    const query = {
        $and: [{ tags_name: { $in: members } },
        { tags_name: { $in: kind } },
        { tags_name: tags_ar }]
    }
    try {
        let data = await PlaceModel.find(query)
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})

router.get("/category/:catCode", async (req, res) => {
    let perPage = req.query.perPage ? Math.min(req.query.perPage, 10) : 10;
    let page = req.query.page ? req.query.page - 1 : 0;
    let cat = req.params.catCode;
    try {
        let data = await PlaceModel
            .find({ category_code: { $in: [cat] } })
            .limit(perPage)
            .skip(perPage * page);
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})

router.get("/tags/:tagId", async (req, res) => {
    let perPage = req.query.perPage ? Math.min(req.query.perPage, 10) : 10;
    let page = req.query.page ? req.query.page - 1 : 0;
    let tag = req.params.tagId;
    try {
        let data = await PlaceModel
            .find({ tags_id: { $in: [tag] } })
            .limit(perPage)
            .skip(perPage * page);
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
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

// find a place's id by its name (for searching posts by the place's name)
router.get("/placeId/:name", async (req, res) => {
    const name = req.params.name;
    try {
        const data = await PlaceModel.findOne({ name });
        data && res.status(200).send(data._id)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.post("/", authAdmin, async (req, res) => {
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