const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin","customer"], default: "customer" },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination'}],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking'}],

    // OTP fields 
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false},

    //optional: refresh token store for invalidation
    refreshToken: { type: String}
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
