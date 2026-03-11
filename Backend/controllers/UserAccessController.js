const UserAccess = require("../models/UserAccess");
const Response = require("../classes/Response");

const create = async (req, res) => {
  try {
    const existing = await UserAccess.findOne({
      where: { user_id: req.user.id },
    });
    if (existing) {
      return res.status(400).send(
        Response.sendResponse(false, null, "Access already exists for this user.", 400)
      );
    }

    const credits = parseInt(process.env.DEFAULT_CREDITS, 10) || 10;

    const userAccess = await UserAccess.create({
      user_id: req.user.id,
      credits,
    });

    const result = {
      user_id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      accessToken: userAccess.accessKey,
      credits: userAccess.credits,
    };

    return res
      .status(201)
      .send(
        Response.sendResponse(true, result, "User access created successfully", 201)
      );
  } catch (err) {
    console.error("UserAccess create error:", err);
    return res
      .status(500)
      .send(
        Response.sendResponse(false, null, err.message || "Failed to create user access", 500)
      );
  }
};

const getAllUserAccess = async (req, res) => {
  try {
    const list = await UserAccess.findAll({
      where: { user_id: req.user.id },
      attributes: ["id", "user_id", "accessKey", "credits", "createdAt", "updatedAt"],
    });
    const result = list.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      accessToken: row.accessKey,
      credits: row.credits,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
    return res
      .status(200)
      .send(Response.sendResponse(true, result, "Success", 200));
  } catch (err) {
    console.error("getAllUserAccess error:", err);
    return res
      .status(500)
      .send(
        Response.sendResponse(false, null, err.message || "Failed to get user access list", 500)
      );
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userAccess = await UserAccess.findOne({
      where: { id },
    });
    if (!userAccess) {
      return res
        .status(404)
        .send(Response.sendResponse(false, null, "User access not found", 404));
    }
    if (userAccess.user_id !== req.user.id) {
      return res
        .status(403)
        .send(Response.sendResponse(false, null, "Forbidden", 403));
    }
    const result = {
      id: userAccess.id,
      user_id: userAccess.user_id,
      accessToken: userAccess.accessKey,
      credits: userAccess.credits,
      createdAt: userAccess.createdAt,
      updatedAt: userAccess.updatedAt,
    };
    return res
      .status(200)
      .send(Response.sendResponse(true, result, "Success", 200));
  } catch (err) {
    console.error("getUserById error:", err);
    return res
      .status(500)
      .send(
        Response.sendResponse(false, null, err.message || "Failed to get user access", 500)
      );
  }
};

const revoke = async (req, res) => {
  try {
    const { id } = req.params;
    const userAccess = await UserAccess.findOne({
      where: { id },
    });
    if (!userAccess) {
      return res
        .status(404)
        .send(Response.sendResponse(false, null, "User access not found", 404));
    }
    if (userAccess.user_id !== req.user.id) {
      return res
        .status(403)
        .send(Response.sendResponse(false, null, "Forbidden", 403));
    }
    await userAccess.destroy();
    return res
      .status(200)
      .send(Response.sendResponse(true, null, "Access token revoked successfully", 200));
  } catch (err) {
    console.error("revoke error:", err);
    return res
      .status(500)
      .send(
        Response.sendResponse(false, null, err.message || "Failed to revoke access token", 500)
      );
  }
};

module.exports = {
  create,
  getAllUserAccess,
  getUserById,
  revoke,
};
