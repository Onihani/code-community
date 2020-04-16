const express = require('express');

const postController = require('../controllers/post');

const router = express.Router();

router.get('/', postController.getPosts);

router.get('/singlepost/:postId', postController.getPost);

router.get('/author/:authorId', postController.getPostAuthor);

module.exports = router;
