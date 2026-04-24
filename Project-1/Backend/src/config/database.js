const mongoose = require('mongoose')

async function connectToDB() {
    await mongoose.connect(process.env.MONGO_URL)

    console.log("Connected to DB");
    
}

module.exports = connectToDB