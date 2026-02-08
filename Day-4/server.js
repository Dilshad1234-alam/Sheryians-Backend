// server ko start krna
// database se connect krna

require("dotenv").config()   /* env file */
const app = require("./src/app")

const connectToDb = require("./src/config/database")   /* data base */

connectToDb()


app.listen(3000, ()=> {
    console.log("Server is running on port 3000");  
})