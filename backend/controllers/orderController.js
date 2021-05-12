const order = require("../models/order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/error-handler");
const catchAsyncErrors = require("../middlewares/catch-async-errors");

// Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const ordered = await order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order: ordered,
  });
});

// Get single order => /api/v1/order/:id
exports.find = catchAsyncErrors(async (req, res, next) => {
  const orderer = await order.findById(req.params.id);

  if (!orderer) {
    return next(new ErrorHandler("Order resource not found"), 404);
  }

  res.status(200).json({
    success: true,
    order: orderer,
  });
});

// Get logged in orders => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const myOrders = await order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders: myOrders,
  });
});

// Get all orders => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await order.find();

  let totalAmount = 0;
  orders.forEach((ord) => {
    totalAmount += ord.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// Update/process order - ADMIN=> /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const currentOrder = await order.findById(req.params.id);

  if (currentOrder.orderStatus === "delivered") {
    return next(new ErrorHandler("order already delivered"), 400);
  }

  currentOrder.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  currentOrder.orderStatus = req.body.status;
  currentOrder.deliveredAt = Date.now();
  currentOrder.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete order => /api/v1/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const orderer = await order.findById(req.params.id);

  if (!orderer) {
    return next(new ErrorHandler("Order resource not found"), 404);
  }

  await orderer.remove();

  res.status(200).json({
    success: true,
    message: "Order removed",
  });
});
