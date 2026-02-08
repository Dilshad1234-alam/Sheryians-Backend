const express = require("express")
const app = express()

app.use(express.json())

const notes = []

// app.use("/", (req, res) => {
//     res.send("Hello world.....")
// })

//  POST /notes
app.post("/notes", (req, res) => {

    notes.push(req.body)

    res.status(201).json({
        message: "Note created successfully"
    })
})

// GET /notes
app.get("/notes", (req, res) => {
    res.status(200).json({
        notes: notes
    })
})

// DELETE /notes
app.delete("/notes/:index", (req, res) => {
    delete notes[ req.params.index ]

    res.status(204).json({
        message: "Note delete successfully"
    })
})

// PATCH /notes
app.patch("/notes/:index", (req, res) => {
    notes[req.params.index].description = req.body.description

    res.status(200).json({
        message: "Note Updated Successfully"
    })
})




module.exports = app