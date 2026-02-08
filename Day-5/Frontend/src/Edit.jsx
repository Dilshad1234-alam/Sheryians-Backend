import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [description, setDescription] = useState("")

  useEffect(() => {

    axios.get(`http://localhost:3000/api/notes/${id}`)
      .then(res => {
        setDescription(res.data.description)
      })

  }, [id])

  function handleUpdate(e) {
    e.preventDefault()

    axios.patch(`http://localhost:3000/api/notes/${id}`, {
      description
    })
    .then(() => navigate("/"))
  }

  return (
    <div className='edit-note'>
      <h2>Edit Note</h2>

      <form className='edit-note-form' onSubmit={handleUpdate}>
        <input className='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className='update'>Update</button>

        <button className='delete' type="button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </form>
    </div>
  )
}

export default Edit
