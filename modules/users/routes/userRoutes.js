const express = require("express");
const router = express.Router();
const { getAllUsers, addUser, deleteUser } = require("../models/userModel");
const { validateUser } = require("../middlewares/userValidation");

//To signup
router.post("signup", validateUser, (req, res) => {
    const newUser = addUser(req.body);
    res.status(201).json({ message: "User created", user: newUser });
});

//To get all users
router.get("/", (req, res) => res.json(getAllUsers())
);

//To delete users
router.delete("/:email", (req, res) => {
    const sucess = deleteUser(req.params.email);
    if (!sucess) return res.status(404).json({ message: "User not found"});
    res.json({ message: "User deleted successfully"});
});

module.exports = router;