const express = require("express");
const router = express.Router();
const UserAccessController = require("../controllers/UserAccessController");
const verifyToken = require("../middlewares/verifyToken");

/**
 * @openapi
 * /user-access:
 *   post:
 *     summary: Create user access (accessToken and credits)
 *     description: User hits API with JWT only. Backend creates record with user_id from token, default credits (10), and generated accessKey. No body required.
 *     tags: [UserAccess]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User access created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     user_id: { type: string, format: uuid }
 *                     email: { type: string }
 *                     name: { type: string }
 *                     accessToken: { type: string }
 *                     credits: { type: integer }
 *       400:
 *         description: Access already exists for this user or validation error
 *       401:
 *         description: A token is required / Invalid Token
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, UserAccessController.create);

/**
 * @openapi
 * /user-access:
 *   get:
 *     summary: Get all user access for current user
 *     description: Returns list of user_access records for the authenticated user.
 *     tags: [UserAccess]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, format: uuid }
 *                       user_id: { type: string, format: uuid }
 *                       accessToken: { type: string }
 *                       credits: { type: integer }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *       401:
 *         description: A token is required / Invalid Token
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, UserAccessController.getAllUserAccess);

/**
 * @openapi
 * /user-access/{id}:
 *   get:
 *     summary: Get user access by id
 *     description: Returns a single user_access record by its id. User can only get their own record.
 *     tags: [UserAccess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     user_id: { type: string, format: uuid }
 *                     accessToken: { type: string }
 *                     credits: { type: integer }
 *                     createdAt: { type: string, format: date-time }
 *                     updatedAt: { type: string, format: date-time }
 *       403:
 *         description: Forbidden - not your record
 *       404:
 *         description: User access not found
 *       401:
 *         description: A token is required / Invalid Token
 *       500:
 *         description: Server error
 */
router.get("/:id", verifyToken, UserAccessController.getUserById);

/**
 * @openapi
 * /user-access/{id}/revoke:
 *   delete:
 *     summary: Revoke access token
 *     description: Deletes the user_access record by id. The accessToken will no longer be valid. User can only revoke their own record.
 *     tags: [UserAccess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Access token revoked successfully
 *       403:
 *         description: Forbidden - not your record
 *       404:
 *         description: User access not found
 *       401:
 *         description: A token is required / Invalid Token
 *       500:
 *         description: Server error
 */
router.delete("/:id/revoke", verifyToken, UserAccessController.revoke);

module.exports = router;
