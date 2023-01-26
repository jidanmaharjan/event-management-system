const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  getAllCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  isAuthenticated,
  authorizedRoles,
} = require("../middlewares/authMiddleware");

router.route("/all").get(getAllCategory);
router
  .route("/new")
  .post(isAuthenticated, authorizedRoles("admin"), createCategory);
router
  .route("/action/:id")
  .put(isAuthenticated, authorizedRoles("admin"), updateCategory)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteCategory);

module.exports = router;
