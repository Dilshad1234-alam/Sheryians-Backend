import React, { useRef, useState } from 'react'
import "../style/createpost.scss"
import { usePost } from '../hook/usePost'
import { useNavigate } from 'react-router'

const CreatePost = () => {

    const [ caption, setCaption ] = useState("")
    const postImageInputFiledRef = useRef(null)

    const navigate = useNavigate()

    const { loading, handleCreatePost } = usePost()

    async function handleSubmit(e) {
        e.preventDefault()
        const file = postImageInputFiledRef.current.files[ 0 ]

        await handleCreatePost(file, caption)
        
        navigate('/')
    }

    if(loading){
        return (
            <main>
                <h1>creating post...</h1>
            </main>
        )
    }

  return (
    <main className='create-post-page'>
        <div className='form-container'>
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <label className='post-image-label' htmlFor="postImage">Select image</label>
                <input ref={postImageInputFiledRef} hidden type="file" name="postImage" id="postImage" />
                <input 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    type="text" name="caption" id="caption" placeholder='Enter Caption'/>
                <button className='button primary-button'>Create Post</button>
            </form>
        </div>
    </main>
  )
}

export default CreatePost