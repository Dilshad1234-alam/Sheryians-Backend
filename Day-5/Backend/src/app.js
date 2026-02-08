const express = require("express");
const noteModel = require("./models/notes.module")
const cors = require("cors")
const path = require("path")

// middle ware
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static("./public"))


// POST /api/notes - Create a new note
// req.body = { title, description }

app.post("/api/notes", async (req, res) => {
    const { title, description } = req.body 

    const note = await noteModel.create({
        title, description
    })

    res.status(201).json({
        message: "Note created successfully",
        note
    })
})

// GET /api/notes - Get all notes
// Fetch all the notes data mongoDB and send them in the response

app.get("/api/notes", async (req, res) => {
    const notes = await noteModel.find()

    res.status(200).json({
        message: "Notes fetched successfully",
        notes
    })
})

// DELETE /api/notes/:id - Delete a notes by ID

app.delete("/api/notes/:id", async (req, res) => {
    const id  = req.params.id

    await noteModel.findByIdAndDelete(id)

    res.status(200).json({
        message: "Note deleted successfully"
    })
})

// PATCH /api/notes/:id - Update a note by ID
// req.body = { description }

app.patch("/api/notes/:id", async (req, res) => {
    const id = req.params.id  
    const { description } = req.body

    await noteModel.findByIdAndUpdate(id, { description })

    res.status(200).json({
        message: "Note updated successfully"
    })
})

// edit note - get a single note by id

app.get("/api/notes/:id", async (req, res) => {
    const note = await noteModel.findById(req.params.id)

    res.json(note)
})

console.log(__dirname);

app.use('*name', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/public/index.html"))
})


module.exports = app;