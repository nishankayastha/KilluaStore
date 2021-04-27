const express = require("express");
const Router = express.Router();
const {
  getProducts,
  create,
  find,
  update,
  delete: deleteProduct,
} = require("../controllers/ProductController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

Router.route("/products").get(getProducts);
Router.route("/product/:id").get(find);

Router.route("/admin/product/new").post(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  create
);
Router.route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), update)
  .delete(isAuthenticatedUser, deleteProduct);

module.exports = Router;
