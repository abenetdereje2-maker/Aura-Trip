const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by auth.middleware.js
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if the user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to perform this action.",
      });
    }

    next();
  };
};

module.exports = authorize;