const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true },
    favorites: [{ type: String }],
    bookings: [{ type: String }]
});

module.exports = mongoose.model("User", userSchema);