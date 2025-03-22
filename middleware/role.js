const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming role is stored in req.user

    // Leadership team has full access
    const leadershipRoles = ["CEO", "CTO", "CFO", "CMO", "COO", "CHRO","Admin"];
    if (leadershipRoles.includes(userRole) || allowedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
  };
};

export default checkRole;
