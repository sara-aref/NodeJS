const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/login", userController.login);

router.get("/:userId/todos", userController.getTodoOfUser);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
