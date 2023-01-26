const express = require("express");
const router = express.Router();

const {
  loginUser,
  verifyOtp,
  getProfile,
  refreshToken,
  registerUser,
  sendOtp,
  changePassword,
  getAllUsers,
  deleteUser,
  sendResetPassword,
  verifyResetPassword,
} = require("../controllers/authController");

const {
  isAuthenticated,
  authorizedRoles,
} = require("../middlewares/authMiddleware");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/sendotp").post(sendOtp);
router.route("/verifyotp").post(verifyOtp);
router.route("/renew").post(refreshToken);
router.route("/resetpassword").post(sendResetPassword);
router.route("/verifyresetpassword").post(verifyResetPassword);

//Loggedin routes
router.route("/profile").get(isAuthenticated, getProfile);
router.route("/changepassword").put(isAuthenticated, changePassword);

router
  .route("/admin/getallusers")
  .get(isAuthenticated, authorizedRoles("admin"), getAllUsers);
router
  .route("/admin/action/:id")
  .delete(isAuthenticated, authorizedRoles("admin"), deleteUser);

module.exports = router;
