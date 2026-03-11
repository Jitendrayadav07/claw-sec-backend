const bcrypt = require("bcryptjs");
const User = require("../models/User");
const UserAccess = require("../models/UserAccess");
const Response = require("../classes/Response");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwtTokenKey");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .send(Response.sendResponse(false, null, "Name, email and password are required.", 400));
    }

    if (typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .send(Response.sendResponse(false, null, "Password must be at least 6 characters.", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return res
        .status(400)
        .send(Response.sendResponse(false, null, "An account with this email already exists.", 400));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: passwordHash,
    });

    return res
      .status(201)
      .send(Response.sendResponse(true, { user: { id: user.id, name: user.name, email: user.email } }, "User registered successfully", 201));
  } catch (error) {
    return res
      .status(500)
      .send(Response.sendResponse(false, null, error.message || "Internal server error", 500));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send(Response.sendResponse(false, null, "Email and password are required.", 400));
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      return res
        .status(400)
        .send(Response.sendResponse(false, null, "Invalid email or password.", 400));
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send(Response.sendResponse(false, null, "Invalid email or password.", 400));
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
    return res
      .status(200)
      .send(Response.sendResponse(true, { user: userResponse }, "User logged in successfully", 200));
  } catch (error) {
    return res
      .status(500)
      .send(Response.sendResponse(false, null, error.message || "Internal server error", 500));
  }
};

const getAccessTokenAndCredits = async (req, res) => {
  try {
    let userAccess = await UserAccess.findOne({
      where: { user_id: req.user.id },
    });
    if (!userAccess) {
      const credits = parseInt(process.env.DEFAULT_CREDITS, 10) || 10;
      userAccess = await UserAccess.create({
        user_id: req.user.id,
        credits,
      });
    }
    const payload = Response.sendResponse(
      true,
      {
        user_id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        accessToken: userAccess.accessKey,
        credits: userAccess.credits,
      },
      "Success",
      200
    );
    return res.status(200).send(payload);
  } catch (err) {
    console.error("getAccessTokenAndCredits error:", err);
    return res
      .status(500)
      .send(Response.sendResponse(false, null, err.message || "Failed to get access token and credits", 500));
  }
};

module.exports = {
  register,
  login,
  getAccessTokenAndCredits,
};
