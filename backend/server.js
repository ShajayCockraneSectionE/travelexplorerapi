const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./shared/middlewares/connect-db");
const cors = require("cors");

dotenv.config();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Import route files
const destinationRoutes = require("./modules/destinations/routes/destinationRoutes");
const userRoutes = require("./modules/users/routes/userRoutes");
const adminRoutes = require("./modules/admin/routes/adminRoutes");
const customerRoutes = require("./modules/customers/routes/customerRoutes");

console.log("Destination routes file loaded");

// Mount routes
app.use("/api/destinations", destinationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
const hostname = "0.0.0.0"
app.listen(PORT, hostname, () => console.log(`Server running on http:// $ {hostname}:{PORT}`));
