const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // User Logged In?
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    // Role Check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource.",
      });
    }

    next();
  };
};

export default authorizeRoles;