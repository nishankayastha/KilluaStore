const express = require("express");
const Router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getAuthUser,
  updatePassword,
  updateProfile,
  logout,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/password/forgot").post(forgotPassword);
Router.route("/password/reset/:token").post(resetPassword);
Router.route("/logout").post(logout);

Router.route("/me").get(isAuthenticatedUser, getAuthUser);
Router.route("/me/update").put(isAuthenticatedUser, updateProfile);
Router.route("/password/update").put(isAuthenticatedUser, updatePassword);

Router.route("/admin/users").get(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUsers
);
Router.route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = Router;
