const express = require('express')
const postRouter = express.Router()
const postController = require('../controllers/post.controller')
const multer = require('multer')  /* file ke liye */
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require("../middlewares/auth.middleware")


/** 
 * @route  POST /api/posts  [protected] ->  Post create
 * @description  -req.body -> { caption, image-file } 
*/
postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController)


/**  
 * @route GET /api/posts/ [protected] -> User create
 * @description Get all the posts create by user that the request come from, also
*/
postRouter.get("/", identifyUser, postController.getPostContoller)


/** 
 * @route GET /api/posts/details/:postid
 * @description -return an details about specific post with the id, also check whether the post belong to the user that the request come from  
*/
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)


/**
 * @route POST /api/posts/like/:postid
 * @description like a post with the id provided in the request params.
 */
postRouter.post("/like/:postId", identifyUser, postController.likePostController)
postRouter.post("/unlike/:postId", identifyUser, postController.unLikePostController)


/**
 * @route Get/api/posts/feed 
 * @description get all the post created in the DB 
 * @access private
 */
postRouter.get("/feed", identifyUser, postController.getFeedController)

module.exports = postRouter  
