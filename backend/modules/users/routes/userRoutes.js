const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { validateUser } = require("../middlewares/userValidation");
const { generateOTP } = require("../../../shared/utils/generateOTP");
const  sendEmail = require("../../../shared/email");
const authMiddleware = require("../../../shared/middlewares/authMiddleware");
const roleMiddleware = require("../../../shared/middlewares/roleMiddleware");
const Booking = require("../../../modules/bookings/models/bookingSchema");

// ================================
// SIGNUP — customer by default
// ================================
router.post("/signup", validateUser, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name, role: "customer" });

    await user.save();
    res.status(201).json({ message: "User created", user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ================================
// LOGIN → send OTP
// ================================
// Login - validate credentials then send OTP via email
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    try {
      await sendEmail(
  user.email,
  "Your OTP Code",
  `Your OTP is: <b>${otp}</b>. It expires in 5 minutes.`
);

    } catch (err) {
      console.error("Error sending OTP email:", err);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

// ================================
// VERIFY OTP → issue JWT token
// ================================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "OTP verification failed" });
  }
});

// ================================
// ADMIN — GET ALL USERS with pagination + search
// ================================
router.get("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const filter = search
      ? { email: { $regex: search, $options: "i" } }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter, "-password -otp -otpExpires -refreshToken")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.json({
      data: users,
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
      totalItems: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load users" });
  }
});

// DELETE USER BY EMAIL (ADMIN)
router.delete("/:email", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ email: req.params.email });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ================================
// CUSTOMER — GET PROFILE (WITH POPULATED FAVS + BOOKINGS)
// ================================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -otp -otpExpires -refreshToken")
      .populate("favorites", "name country category pricePerPerson rating")
      .populate({
        path: "bookings",
        populate: {
          path: "destination",
          select: "name country category pricePerPerson rating",
        },
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ================================
// CUSTOMER — FAVOURITES
// ================================
router.post("/me/favourites/:destinationId", authMiddleware, async (req, res) => {
  try {
    const { destinationId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favorites.includes(destinationId)) {
      user.favorites.push(destinationId);
      await user.save();
    }

    res.json({ message: "Added to favourites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update favourites" });
  }
});

// REMOVE all favourites
router.delete("/me/favourites", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { favorites: [] });
    res.json({ message: "Favourites cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove favourites" });
  }
});

// ================================
// CUSTOMER — BOOKINGS
// ================================
router.post("/me/bookings/:destinationId", authMiddleware, async (req, res) => {
  try {
    const { destinationId } = req.params;
    const { fullName, email, numPeople, fromDate, toDate } = req.body;

    if (!fullName || !email || !fromDate || !toDate || !numPeople) {
      return res.status(400).json({ message: "Missing booking information" });
    }

    const booking = await Booking.create({
      destination: destinationId,
      user: req.user.id,
      fullName,
      email,
      numPeople,
      fromDate,
      toDate,
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { bookings: booking._id } });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

// REMOVE all bookings
router.delete("/me/bookings", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Booking.deleteMany({ _id: { $in: user.bookings } });
    user.bookings = [];
    await user.save();

    res.json({ message: "Bookings cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove bookings" });
  }
});

module.exports = router;
