const jwt = require("jsonwebtoken");
const User = require("./../models/users");
const AppError = require("./../utils/appError");
const { promisify } = require("util");

exports.protect = async (req, res, next) => {
  //Getting token and check if it's there
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
  } else {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //Verification token
  try {
    const decoded = await promisify(jwt.verify)(
      token,
      "secret-and-secure-and-long-passwd"
    );

    //Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(new AppError("The user does no longer exist.", 401));
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError")
      return next(new AppError("Invalid token. Please log in again.", 401));
    if (err.name === "TokenExpiredError")
      return next(new AppError("Token has expired. Please log in again."), 401);
  }

  next();
};
