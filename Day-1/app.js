const express = require("express")

const app = express()

app.use(express.json())

// app.use("/", function(req, res) {
//     res.send("hello")
// })

const notes = []

app.post("/notes", (req, res) => {

    console.log(req.body);
    notes.push(req.body)
    res.send("note created")
})

app.get("/notes", (req, res) => {
    res.send(notes)
})



app.listen(4000, () => {
    console.log("Server running on port 4000");
})
