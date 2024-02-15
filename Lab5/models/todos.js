const mongoose = require("mongoose");
const User = require("./users");

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Task must have a title'],
        minlength: 5,
        maxlength: 20
    },
    status: {
        type: String,
        default: "to-do",
        enum: ['to-do', 'in progress', 'done']
    },
    tags: {
        type: [String],
        max: 10
    }
},
{
    timestamps:true
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;