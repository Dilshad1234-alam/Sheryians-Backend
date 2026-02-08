import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import Edit from './Edit'
import { useNavigate } from 'react-router-dom'

const App = () => {

  const [notes, setNotes] = useState([])
  const navigate = useNavigate()

  function fetchNotes() {
    axios.get("http://localhost:3000/api/notes")
      .then((res) => {
        setNotes(res.data.notes)
      })
  }

  useEffect(() => {

    fetchNotes()
    
  }, [])
  
 
  function handleSubmit(e) {
    e.preventDefault()

    const { title, description } = e.target.elements 

    console.log(title.value, description.value);

    axios.post("http://localhost:3000/api/notes", {
      title: title.value,
      description: description.value
    })
    .then((res) => {
      console.log(res.data);
      fetchNotes()
    })

    e.target.reset()   // ✅ FORM CLEAR
    
  }

  function handleDeleteNote(noteid) {
    axios.delete(`http://localhost:3000/api/notes/${noteid}`)
      .then((res) => {
        console.log(res.data);
        fetchNotes()
      })
  }


  return (
    <>
    
    <form className="note-create-form" onSubmit={handleSubmit}>
        <input className='title' name='title' type="text" placeholder='Enter title'/>
        <input className='description' name='description' type="text" placeholder='Enter description'/>
        <button className='btn'>Create note</button>
    </form>

      <div className='notes'>
        {
        notes.map(note => {
          return <div className="note">
          <h1>{note.title}</h1>
          <p>{note.description}</p>
          <button className='delete' onClick={() => {handleDeleteNote(note._id)}}>Delete</button>
          
          <button onClick={() => navigate(`/edit/${note._id}`)}>
            Edit
          </button>

          </div>
        })
        }
      </div>
    </>
  )
}

export default App