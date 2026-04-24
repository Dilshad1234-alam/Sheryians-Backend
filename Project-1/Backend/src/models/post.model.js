const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        require: [true, "imgUrl is required for caption for creating an post"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: [true, "user is required for creatting an post"]
    }
})

const postModel = mongoose.model("post", postSchema)

module.exports = postModel 