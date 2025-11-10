const mongoose = require("mongoose");

const connectDB = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDB Atlas connected");
        }
        next();
    } catch (err) {
        console.error("Database connection failed:", err.message);
        res.status(500).json({ message: "Database connection failed"});
    }
};

module.exports = connectDB;

