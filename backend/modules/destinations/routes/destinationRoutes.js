const express = require("express");
const router = express.Router();
const Destination = require("../models/destinationSchema");
const { validateDestination } = require("../middlewares/destinationValidation");


const {
    getAllDestinations,
    getDestinationByName,
    addDestination,
    updateDestination,
    deleteDestination,
} = require("../models/destinationModel");

//To get all destinations
router.get("/", async (req, res) => {
    try {
        const { search, sort, page = 1, limit = 5 } = req.query;
        const query = search ? {name: new RegExp(search, "i") } : {};
        const results = await Destination.find(query)
        .sort(sort ? {[sort]: 1 } : {})
        .skip((page -1) * limit)
        .limit(Number(limit));

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }

});

//Get destination by name
router.get("/:name", async (req, res) => {
    try {
    const dest = await Destination.findOne({ name: req.params.name});
    if (!dest) return res.status(404).json({ message: "Destination not found"});
    res.json(dest);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});

//To add new destination
router.post("/", validateDestination, async (req, res) => {
    try {
    const newDest = new Destination (req.body);
    await newDest.save();
    res.status(201).json(newDest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//To update destination
router.put("/:name", async (req, res) => {
    try {
        const updated = await Destination.findOneAndUpdate(
            {name: req.params.name},
            req.body,
            {new: true }
        );
        if (!updated) return res.status(404).json({ message: "Destination not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
    
});

//To delete destination
router.delete("/:name", async (req, res) => {
    try {
        const deleted = await Destination.findOneAndDelete({ name: req.params.name});
        if (!deleted) return res.status(404).json({message: "Destination not found" });
        res.json({ message: "Destination deleted successfully"});
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});
    

module.exports = router;