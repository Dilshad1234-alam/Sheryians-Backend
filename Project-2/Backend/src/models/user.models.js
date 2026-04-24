const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "Username is required"],
        unique: [ true, "Username must be unique"]
    },
    email: {
        type: String,
        require: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        require: [true, "Password is required"],
        select: false
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel