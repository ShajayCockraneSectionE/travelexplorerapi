const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Import route files
const destinationRoutes = require("./modules/destinations/routes/destinationRoutes");
console.log("Destination Routes:", destinationRoutes);

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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
