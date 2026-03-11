const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/jwtTokenKey");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", (req, res, next) => {
  const baseUrl = process.env.REDIRECT_URL || "http://localhost:5001";
  const loginPage = `${baseUrl}/google-login.html`;

  passport.authenticate("google", { session: false }, async (err, profile, info) => {
    if (err) {
      return res.redirect(`${loginPage}?error=${encodeURIComponent(err.message || "Google login failed.")}`);
    }
    if (!profile) {
      const message = (info && info.message) || "Google login failed.";
      return res.redirect(`${loginPage}?error=${encodeURIComponent(message)}`);
    }

    try {
      const email = (profile.emails && profile.emails[0] && profile.emails[0].value || "").trim().toLowerCase();
      const name = (profile.displayName || (profile.emails && profile.emails[0] && profile.emails[0].value) || "User").trim();
      const googleId = profile.id;

      let user = await User.findOne({ where: { email } });
      if (user) {
        // User with this email already exists — treat as success and log them in
      } else {
        user = await User.findOne({ where: { google_id: googleId } });
        if (!user) {
          user = await User.create({
            name,
            email,
            google_id: googleId,
          });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.redirect(
        `${loginPage}?token=${encodeURIComponent(token)}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`
      );
    } catch (dbErr) {
      console.error("Google callback error:", dbErr);
      return res.redirect(
        `${loginPage}?error=${encodeURIComponent(dbErr.message || "Something went wrong.")}`
      );
    }
  })(req, res, next);
});

module.exports = router;
