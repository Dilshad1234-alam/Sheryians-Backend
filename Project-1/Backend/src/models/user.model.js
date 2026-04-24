const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "Username already exists" ],
        required: [ true, "Username is required" ]
    },
    email: {
        type: String,
        unique: [ true, "Email already exists" ],
        required: [ true, "Email is required" ]
    },
    password: {
        type: String,
        required: [ true, "Password is required" ],
        select: false       /* password hide  */
    },
    bio: String,
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/Dilshad/vector-flat-illustration-grayscale-avatar-600nw-2281862025.webp"
    },
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel
