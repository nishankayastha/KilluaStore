const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const app = express();
const errorMiddleware = require("./middlewares/errors");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const paymentRoutes = require('./routes/payment');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(fileUpload())
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", orderRoutes);
// middleware to handle errors
app.use(errorMiddleware);
module.exports = app;
