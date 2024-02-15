const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User must have a name"],
      unique: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: [true, "User must have a first name"],
      minlength: 3,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: [true, "User must have a last name"],
      minlength: 3,
      maxlength: 15,
    },
    dob: {
      type: Date,
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      minlength: 8,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
    timestamps: true,
  }
);

userSchema.pre("save", function preSave(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
