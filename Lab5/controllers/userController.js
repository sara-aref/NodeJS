const AppError = require("../utils/appError");
const User = require("./../models/users");
const Todo = require("./../models/todos");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, "secret-and-secure-and-long-passwd", {
    expiresIn: "6d",
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("This user doesn't exist", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Please enter valid ID",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError("This user doesn't exist", 404));
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Please enter valid ID",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        Todo: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user._id == req.user.id) {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        return next(new AppError("This user doesn't exist", 404));
      }

      return res.status(200).json({
        status: "success",
        data: {
          updatedUser,
        },
      });
    } else {
      console.log(updatedUser._id);
      console.log(req.user.id);
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to update this user",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Please enter valid ID",
    });
  }
};

exports.login = async (req, res, next) => {
  const { userName, password } = req.body;

  //check if the userName and pass exist
  if (!userName || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //check if the userName exist and pass is correct
  const user = await User.findOne({ userName });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
