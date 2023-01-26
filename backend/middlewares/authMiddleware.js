const Auth = require("../models/authModel");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login first to acces this resource",
    });
  }
  const decoded = jwt.verify(
    token.split(" ")[1],
    process.env.ACCESS_TOKEN_SECRET,
    async (err, payload) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorised access",
        });
      } else {
        req.user = await Auth.findOne({ email: payload.email });
        next();
      }
    }
  );
};

exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    next();
  };
};
