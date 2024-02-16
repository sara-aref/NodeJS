const express = require("express");
const todoController = require("./../controllers/todoController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, todoController.getAlltodos)
  .post(todoController.createTodo);

router
  .route("/:id")
  .get(authController.protect, todoController.getTodo)
  .patch(authController.protect, todoController.updateTodo)
  .delete(authController.protect, todoController.deleteTodo);

module.exports = router;
