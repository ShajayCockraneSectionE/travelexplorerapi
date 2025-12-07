const express = require("express");
const router = express.Router();
const Destination = require("../../destinations/models/destinationSchema");
const { validateDestination } = require("../../destinations/middlewares/destinationValidation");
const authMiddleware = require("../../../shared/middlewares/authMiddleware");
const roleMiddleware = require("../../../shared/middlewares/roleMiddleware");

// Public list & search
router.get("/", async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 5 } = req.query;
    const query = search ? { name: new RegExp(search, "i") } : {};
    const results = await Destination.find(query)
      .sort(sort ? { [sort]: 1 } : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get by name - public
router.get("/:name", async (req, res) => {
  try {
    const dest = await Destination.findOne({ name: req.params.name });
    if (!dest) return res.status(404).json({ message: "Destination not found" });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected: add - logged-in users (admin or customer)
router.post("/", authMiddleware, validateDestination, async (req, res) => {
  try {
    const newDest = new Destination(req.body);
    await newDest.save();
    res.status(201).json(newDest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Protected: update - admin only
router.put("/:name", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const updated = await Destination.findOneAndUpdate({ name: req.params.name }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Destination not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Protected: delete - admin only
router.delete("/:name", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const deleted = await Destination.findOneAndDelete({ name: req.params.name });
    if (!deleted) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
