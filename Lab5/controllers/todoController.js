const Todo = require("../models/todos");

exports.getAlltodos = async (req, res) => {
  try {
    const { status, limit = 10, skip = 0 } = req.query;

    const query = status ? { status } : {};

    const todos = await Todo.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.status(200).json({
      status: "success",
      results: todos.length,
      data: {
        todos,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (todo.userId == req.user.id) {
      return res.status(200).json({
        status: "success",
        data: {
          todo,
        },
      });
    } else {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to this Todo",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (todo.userId == req.user.id) {
      const deletedtodo = await Todo.findByIdAndDelete(req.params.id);

      return res.status(204).json({
        status: "success",
        message: "Task deleted succefully",
      });
    } else {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to delete this Todo",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        Todo: newTodo,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (todo.userId == req.user.id) {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        status: "success",
        data: {
          updatedTodo,
        },
      });
    } else {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to update this Todo",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
