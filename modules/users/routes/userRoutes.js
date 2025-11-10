const express = require("express");
const router = express.Router();
const { getAllUsers, addUser, deleteUser } = require("../models/userModel");
const { validateUser } = require("../middlewares/userValidation");
const User = require("../models/userSchema");

//To signup
router.post("/signup", validateUser, async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User created", user: newUser});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});


//To get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
} 
);

//To delete users
router.delete("/:email", async (req, res) => {
    try {
        const deleted = await User.findOneAndDelete({ email: req.params.email});
        if (!deleted) return res.status(404).json({ message: "User not found"});
        res.json({ message: "User deleted sucessfullly"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
    

module.exports = router;