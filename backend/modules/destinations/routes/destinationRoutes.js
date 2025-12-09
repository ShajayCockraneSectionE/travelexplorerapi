const express = require("express");
const router = express.Router();
const Destination = require("../../destinations/models/destinationSchema");
const { validateDestination } = require("../../destinations/middlewares/destinationValidation");
const authMiddleware = require("../../../shared/middlewares/authMiddleware");
const roleMiddleware = require("../../../shared/middlewares/roleMiddleware");

// ================================
// GET ALL (PUBLIC) — with filters + pagination
// ================================
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const {
      name,
      country,
      category,
      minPrice,
      maxPrice,
      minRating,
    } = req.query;

    const filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (country) filter.country = { $regex: country, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    if (minPrice) filter.pricePerPerson = { ...(filter.pricePerPerson || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.pricePerPerson = { ...(filter.pricePerPerson || {}), $lte: Number(maxPrice) };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const [destinations, total] = await Promise.all([
      Destination.find(filter).skip(skip).limit(limit),
      Destination.countDocuments(filter),
    ]);

    res.json({
      data: destinations,
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load destinations" });
  }
});

// ================================
// GET BY NAME (PUBLIC)
// ================================
router.get("/:name", async (req, res) => {
  try {
    const dest = await Destination.findOne({ name: req.params.name });
    if (!dest) return res.status(404).json({ message: "Destination not found" });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================================
// ADD DESTINATION (ADMIN ONLY)
// ================================
router.post("/", authMiddleware, roleMiddleware("admin"), validateDestination, async (req, res) => {
  try {
    const newDest = new Destination(req.body);
    await newDest.save();
    res.status(201).json(newDest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ================================
// UPDATE DESTINATION (ADMIN ONLY)
// ================================
router.put("/:name", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const updated = await Destination.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Destination not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ================================
// DELETE DESTINATION (ADMIN ONLY)
// ================================
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
