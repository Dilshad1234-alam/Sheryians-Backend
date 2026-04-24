const postModel = require('../models/post.model')
const ImageKit = require('@imagekit/nodejs/index.js')
const { toFile } = require("@imagekit/nodejs/index.js")
const jwt = require('jsonwebtoken')
const { rawListeners } = require('../app')
const likeModel = require("../models/like.models")

const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY 
})

// 

async function createPostController(req, res) {

    console.log(req.body, req.file);    

    // upload file to imagekit and get the url of the file

    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "cohort-2-insta-clone-posts"
    })  
    
    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id    /* middle ware -> req.user */
    })

    res.status(201).json({
        message: "Post created successfully",
        post
    })
}


async function  getPostContoller(req, res) {

    const userId =  req.user.id      /* middle ware -> req.user */

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })
}

async function getPostDetailsController(req, res) {

    const userId = req.user.id      /* middle ware -> req.user  */

    const postId = req.params.postId 

    const post = await postModel.findById(postId)

    if(!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content."
        })
    }

    return res.status(200).json({
        message: "Post fetched successfully",
        post
    })
}


async function likePostController(req, res) {

    try { 

        //  Safety Check: Kya user login hai?
        if (!req.user || !req.user.username) {
            return res.status(401).json({ message: "Unauthorized: User info missing" });
        }
    
        const username = req.user.username 
        const postId = req.params.postId

        const post = await postModel.findById(postId)

        if(!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

        const existingLike = await likeModel.findOne({ post: postId, user: username });
        if (existingLike) {
            return res.status(400).json({ message: "You already liked this post" });
        }

        const like = await likeModel.create({
            post: postId,
            user: username  
        })

        res.status(200).json({
            message: "Post liked successfully." ,
            like
        });

    } catch (error) {
        console.error("LIKE ERROR:", error.message);
        res.status(500).json({ message: "Server error during like", error: error.message });
    }
}


async function unLikePostController(req, res) {
    try {

        if (!req.user || !req.user.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const username = req.user.username 
        const postId = req.params.postId 

        const isLiked = await likeModel.findOne({
            post: postId,
            user: username 
        })

        if (!isLiked) {
            return res.status(400).json({
                message: "Post did't like"
            })
        }

        await likeModel.findOneAndDelete({ _id: isLiked._id })

        return res.status(200).json({
            message: "post unliked successfully"
        })

    } catch (error) {
        console.error("UNLIKE ERROR:", error.message);
        res.status(500).json({ message: "Server error during unlike", error: error.message });
    }
}


async function getFeedController(req,res) {

    const user = req.user 

    const posts = await Promise.all((await postModel.find().populate("user").lean())
        .map(async (post) => {

            const isLiked = await likeModel.findOne({
                user: user.username,
                post: post.__id
            })
            post.isLiked = Boolean(isLiked);

            return post
        }))

    res.status(200).json({
        message: "post fetch successfully",
        posts
    })
}

module.exports = {
    createPostController,
    getPostContoller,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unLikePostController
}