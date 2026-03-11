const express = require("express");
const router = express.Router();

const userRoutes = require("./UserRoutes");
const authRoutes = require("./authRoutes");
const userAccessRoutes = require("./UserAccessRoutes");

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/user-access", userAccessRoutes);

module.exports = router;