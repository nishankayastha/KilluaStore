const ErrorHandler = require("../utils/error-handler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (err.name === "CastError") {
    const message = `Resource not found: Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handling mongoose duplicate errors
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  if ((err.name = "JsonWebTokenError")) {
    const message = "Json web token is invalid";
    err = new ErrorHandler(message, 400);
  }

  if ((err.name = "TokenExpired")) {
    const message = "Json web token is expired";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
