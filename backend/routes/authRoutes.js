const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken, requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed });
    const token = signToken(user._id);
    res.status(201).json({ user: user.toPublic(), token });
  } catch (err) {
    console.error("[auth/signup]", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password." });

    const token = signToken(user._id);
    res.json({ user: user.toPublic(), token });
  } catch (err) {
    console.error("[auth/signin]", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user.toPublic() });
});

router.put("/update-name", requireAuth, async (req, res) => {
  const { name } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: "Name is required." });
  req.user.name = name.trim();
  await req.user.save();
  res.json({ user: req.user.toPublic() });
});

router.put("/update-target-role", requireAuth, async (req, res) => {
  const { targetRole } = req.body || {};
  if (!targetRole || !targetRole.trim()) return res.status(400).json({ error: "Target role is required." });
  req.user.targetRole = targetRole.trim();
  await req.user.save();
  res.json({ user: req.user.toPublic() });
});

router.put("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters." });
    }

    const user = await User.findById(req.user._id).select("+password");
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: "Current password is incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("[auth/change-password]", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;
