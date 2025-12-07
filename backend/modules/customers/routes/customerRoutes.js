const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../shared/middlewares/authMiddleware");
const roleMiddleware = require("../../../shared/middlewares/roleMiddleware");

const Destination = require("../../destinations/models/destinationSchema");
const User = require("../../users/models/userSchema");

// -------------------------
// CUSTOMER: GET ALL DESTINATIONS
// -------------------------
router.get("/destinations", authMiddleware, roleMiddleware("customer"), async (req, res) => {
  try {
    const list = await Destination.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// CUSTOMER: FILTER DESTINATIONS
// name / country / category / rating
// -------------------------
router.get("/destinations/filter", authMiddleware, roleMiddleware("customer"), async (req, res) => {
  try {
    const { name, country, category, rating } = req.query;

    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (country) query.country = { $regex: country, $options: "i" };
    if (category) query.category = category;
    if (rating) query.rating = { $gte: Number(rating) };

    const results = await Destination.find(query);
    res.json(results);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// CUSTOMER: RATE DESTINATION
// -------------------------
router.put("/destinations/:id/rate", authMiddleware, roleMiddleware("customer"), async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating) return res.status(400).json({ message: "Rating required" });

    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });

    destination.rating = rating;
    await destination.save();

    res.json(destination);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// CUSTOMER: ADD TO FAVORITES
// -------------------------
router.post("/favorites/:destId", authMiddleware, roleMiddleware("customer"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(req.params.destId)) {
      user.favorites.push(req.params.destId);
      await user.save();
    }

    res.json({ message: "Added to favorites" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// CUSTOMER: GET FAVORITES
// -------------------------
router.get("/favorites", authMiddleware, roleMiddleware("customer"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// CUSTOMER: SEARCH BY NAME
// -------------------------
router.get("/destinations/search", authMiddleware, roleMiddleware("customer"), async (req, res) => {
  try {
    const { name } = req.query;

    const result = await Destination.find({
      name: { $regex: name, $options: "i" },
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
