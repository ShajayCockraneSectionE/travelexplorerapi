const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./shared/middlewares/connect-db");

dotenv.config();

// Middleware
app.use(express.json());
app.use(connectDB);

// Import route files
const destinationRoutes = require("./modules/destinations/routes/destinationRoutes");
console.log("Destination routes file loaded ");

const userRoutes = require("./modules/users/routes/userRoutes");

// Mount routes
app.use("/api/destinations", destinationRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT  = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
