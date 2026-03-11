const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const JoiMiddleWare = require("../middlewares/joi/joiMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const userValidation = require("../validations/userValidation");

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, format: uuid }
 *                 name: { type: string }
 *                 email: { type: string }
 *       400:
 *         description: Validation error or email already exists
 *       500:
 *         description: Server error
 */
router.post("/register", JoiMiddleWare(userValidation.registerSchema, "body"), UserController.register);


/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, format: uuid }
 *                 name: { type: string }
 *                 email: { type: string }
 *       400: 
 *         description: Validation error or email or password is incorrect
 *       500:
 *         description: Server error
 */
router.post("/login", JoiMiddleWare(userValidation.loginSchema, "body"), UserController.login);

router.get("/access-token-credits", verifyToken, UserController.getAccessTokenAndCredits);

module.exports = router;
