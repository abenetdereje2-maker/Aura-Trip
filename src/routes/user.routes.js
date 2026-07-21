const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Profile retrieved successfully",
    user: req.user,
  });
});

module.exports = router;