const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwtTokenKey");
const Response = require("../classes/Response");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  if (req.headers["authorization"] == null || req.headers["authorization"] === undefined) {
    return res
      .status(401)
      .send(Response.sendResponse(false, null, "A token is required for authentication", 401));
  }

  const parts = req.headers["authorization"].split(" ");
  const token = parts[0] === "Bearer" && parts[1] ? parts[1] : parts[0];

  if (!token) {
    return res
      .status(401)
      .send(Response.sendResponse(false, null, "A token is required for authentication", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ["id", "name", "email"],
    });

    if (!user) {
      return res
        .status(400)
        .send(Response.sendResponse(false, null, "Account not found, please register", 400));
    }

    req.user = { id: user.id, name: user.name, email: user.email };
    return next();
  } catch (err) {
    return res.status(401).send(Response.sendResponse(false, null, "Invalid Token", 401));
  }
};

module.exports = verifyToken;
