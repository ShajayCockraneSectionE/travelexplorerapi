const express = require("express");
const router = express.Router();

const {
    getAllDestinations,
    getDestinationByName,
    addDestination,
    updateDestination,
    deleteDestination,
} = require("../models/destinationModel");
const { validateDestination } = require("../middlewares/destinationValidation");

//To get all destinations
router.get("/", (req, res) => {
    const data = getAllDestinations();
    res.status(200).json(data);
});

//Get destination by name
router.get("/:name", (req, res) => {
    const dest = getDestinationByName(req.params.name);
    if (!dest) return res.status(404).json({ message: "Destination not found"});
    res.status(200).json(dest);
});

//To add new destination
router.post("/", validateDestination, (req, res) => {
    const newDest = addDestination(req.body);
    res.status(201).json(newDest);
});

//To update destination
router.put("/:name", (req, res) => {
    const updated = updateDestination(req.params.name, req.body);
    if (!updated) return res.status(404).json({ message: "Destination not found"});
    res.status(200).json(updated);
});

//To delete destination
router.delete("/:name", (req, res) => {
    const sucess = deleteDestination(req.params.name);
    if (!sucess) return res.status(404).json({ message: "Destination not found"});
    res.status(200).json({ message: "Destination deleted succesfully"});
});

module.exports = router;