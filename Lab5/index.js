const mongoose = require("mongoose");
const express = require("express");

const todoRouter = require("./routes/todosRouter");
const userRouter = require("./routes/usersRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const env = require('dotenv').config();



const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/iti_osad_44")
  .then(console.log("connected succefully"));

app.use(express.json());

app.use("/todos", todoRouter);
app.use("/users", userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const port = 3000;

app.listen(port, () => {
  console.log(`App on port ${port}`);
});
