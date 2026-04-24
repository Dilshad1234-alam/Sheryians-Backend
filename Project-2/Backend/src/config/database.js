const mongoose = require("mongoose");

function connectToDB() {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Connected to DB")
        })
        .catch(err => {
            console.log("Error Connected to DB", err);
        })

}


module.exports = connectToDB