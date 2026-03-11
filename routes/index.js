const express = require("express");
const router = express.Router();

const userRoutes = require("./UserRoutes");

router.use("/users", userRoutes);

module.exports = router;