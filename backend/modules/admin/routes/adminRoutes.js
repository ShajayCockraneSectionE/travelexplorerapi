const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../shared/middlewares/authMiddleware");
const roleMiddleware = require("../../../shared/middlewares/roleMiddleware");

const User = require("../../users/models/userSchema");
const Destination = require("../../destinations/models/destinationSchema");

// -------------------------
// ADMIN: GET ALL USERS
// -------------------------
router.get("/users", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const allUsers = await User.find({}, "-password -otp -otpExpires");
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// ADMIN: DELETE USER BY EMAIL
// -------------------------
router.delete("/users/:email", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ email: req.params.email });
    if (!result) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// ADMIN: ADD DESTINATION
// -------------------------
router.post("/destinations", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const newDestination = new Destination(req.body);
    await newDestination.save();
    res.status(201).json(newDestination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// ADMIN: EDIT DESTINATION
// -------------------------
router.put("/destinations/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Destination not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// ADMIN: DELETE DESTINATION
// -------------------------
router.delete("/destinations/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Destination not found" });

    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
