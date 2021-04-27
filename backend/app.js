const express = require("express");
const errorMiddleware = require("./middlewares/errors");
const app = express();
const cookieParser = require("cookie-parser");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);

// middleware to handle errors
app.use(errorMiddleware);
module.exports = app;
