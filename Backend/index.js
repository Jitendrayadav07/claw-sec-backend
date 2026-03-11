// Load .env (copy env_local to .env for local dev)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const routes = require("./routes");
const { swaggerUi, swaggerSpec } = require("./config/swagger");
require("./passport"); // registers Google strategy
const passport = require("passport");

const app = express();

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Sync models with the database
sequelize.sync();

app.use(passport.initialize());
// No passport.session() - we use JWT in the Google callback, not sessions

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  cors({
    origin: "*",
  })
);

// API Routes
app.use("/api", routes);

// Static files (HTML page for testing Google login)
app.use(express.static("public"));

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
