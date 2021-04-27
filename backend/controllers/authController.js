const User = require("../models/user");
const crypto = require("crypto");
const ErrorHandler = require("../utils/error-handler");
const catchAsyncErrors = require("../middlewares/catch-async-errors");
const sendCookieToken = require("../utils/jwt-token");
const sendEmail = require("../utils/sendEmail");

// Register a user => /api/v1/register
exports.register = catchAsyncErrors(async (req, res, next) => {
  const { password, ...rest } = req.body;
  const user = await User.create({
    ...rest,
    password,
    avatar: {
      public_id: "v1618671109/Rakesh-Shrestha_zv3fqh.jpg",
      url:
        "https://res.cloudinary.com/reactlover/image/upload/v1618671109/Rakesh-Shrestha_zv3fqh.jpg",
    },
  });
  const token = user.getJwtToken();
  sendCookieToken(user, 200, res);
});

// Login a user => /api/v1/login
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email | !password) {
    return next(new ErrorHandler("Please enter email and password"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return next(new ErrorHandler("Invalid email address or password"), 401);

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email address or password"), 401);
  }

  const token = user.getJwtToken();

  sendCookieToken(user, 200, res);
});

//forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email"), 404);
  }
  const token = user.resetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${token}`;

  const message = `Your password reset token is as follows \n\n <a href='${resetUrl}'>Reset</a>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Killua store password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Recovery email sent to the user successfully",
    });
  } catch (e) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();
  sendCookieToken(user, 200, res);
});

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// Get current logged in user details => api/v1/me
exports.getAuthUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// Update/change password => api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password doesn't match", 400));
  }
  user.password = req.body.password;
  await user.save();

  sendCookieToken(user, 200, res);
});

// Update profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;
  // update avatar : TODO
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    user,
  });
});

// Get all users => /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Get a user => /api/v1/admin/user/:id
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exit with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update a user => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const { name, role, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, role, email },
    {
      // @todo reasearch this
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({ success: true, user: updatedUser });
});

// Delete a user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exit with id: ${req.params.id}`, 404)
    );
  }
  await user.remove();

  res.status(200).json({
    success: true,
  });
});
