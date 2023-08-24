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
    const exclude = req.query.exclude;
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
        if (exclude) {
            myFilter._id = { $ne: exclude };
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
router.get("/placesNames", async (req, res) => {
    try {
        //The id field is mandatory in ReactSearchAutocomplete. 
        let data = await PlaceModel.find({}, { _id: 0, id: '$_id', name: 1 })
        res.status(200).json(data)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/count", async (req, res) => {
    try {
        const s = req.query.s;
        const area = req.query.area;
        const tags = req.query.tags;
        const types = req.query.types;
        const cats = req.query.cats;
        let myFilter = {};
        if (s) {
            let searchExp = new RegExp(s, "i");
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
        const count = await PlaceModel.countDocuments(myFilter);
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
    let query = {};
    if (tags_ar.includes("Air-Conditioner")) {
        query = {
            $or: [
                {
                    $and: [
                        { tags_name: { $in: members } },
                        { tags_name: { $in: kind } },
                        { tags_name: { $in: "Air-Conditioner" } }
                    ]
                },
                { tags_name: { $in: tags_ar } }
            ]
        };
    } else {
        query = {
            $or: [
                {
                    $and: [
                        { tags_name: { $in: members } },
                        { tags_name: { $in: kind } }
                    ]
                },
                { tags_name: { $in: tags_ar } }
            ]
        };
    }
    try {
        let data = await PlaceModel.find(query).limit(3)
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
        if (!name) {
            res.status(400).json({ error: "Place name is required" });
            return;
        }
        const data = await PlaceModel.findOne({ name });
        if (data) {
            res.status(200).send(data._id);
        } else {
            res.status(404).json({ error: "Place not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

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