import { useContext, useEffect } from 'react'
import { createPost, getFeed, likePost, unLikedPost } from '../services/post.api'
import { PostContext } from '../post.context'

export const usePost = () => {

    const context = useContext(PostContext)

    const { loading, setLoading, post, setPost, feed, setFeed } = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts.reverse())    /* reverse the array to show latest posts first */
        setLoading(false)
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        const data = await createPost(imageFile, caption)
        setLoading(false)
        return data
    }

    const handleLike = async (postId) => {
        const data = await likePost(postId)
        await handleGetFeed()
    }

    const handleUnLike = async (postId) => {
        const data = await unLikedPost(postId)
        await handleGetFeed()
    }

    useEffect(() => {
        handleGetFeed()
    }, [])

    return { loading, setLoading, post, feed,  handleGetFeed, handleCreatePost, handleLike, handleUnLike } 
}