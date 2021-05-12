const express = require("express");
const Router = express.Router();
const {
  newOrder,
  find,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

Router.route("/order/new").post(isAuthenticatedUser, newOrder);
Router.route("/order/:id").get(isAuthenticatedUser, find);
Router.route("/orders/me").get(isAuthenticatedUser, myOrders);
Router.route("/admin/orders").get(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  allOrders
);
Router.route("/admin/order/:id").put(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateOrder
);
Router.route("/admin/order/:id").delete(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteOrder
);
module.exports = Router;
