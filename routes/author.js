const express = require("express");
const { body, check } = require("express-validator");

const blogController = require("../controllers/author");
const isAuth = require("../middlewares/is-auth");

const Author = require("../models/author");

const router = express.Router();

router.use((req, res, next) => {
  if (req.author) {
    res.locals.authorName = req.author.name;
    res.locals.authorAvatar = req.author.profileImages.avatarImg;
  }
  next();
});

// author get routes
router.get("/", blogController.getAuthorLogin);

router.get("/register", blogController.getAuthorSignup);

router.get("/dashboard", isAuth, blogController.getDashboard);

router.get("/posts", isAuth, blogController.getPosts);

router.get("/single-post/:postId", blogController.getPost)

router.get("/create-post", isAuth, blogController.getCreatePost);

router.get("/edit-post/:postId", isAuth, blogController.getEditPost);

router.get("/insights", isAuth, blogController.getInsights);

router.get("/drafts", isAuth, blogController.getDrafts);

router.get("/profile", isAuth, blogController.getProfile);

// auhtor post routes
router.post(
  "/profile",
  [
    check("username")
      .trim()
      .notEmpty()
      .withMessage("username cannot be empty")
      .custom((value, { req }) => {
        return Author.findOne({ username: value }).then(authorInfo => {
          if (
            authorInfo &&
            authorInfo._id.toString() !== req.author._id.toString()
          ) {
            return Promise.reject("username already taken");
          }

          return true;
        });
      }),
    check("email")
      .trim()
      .isEmail()
      .withMessage("please enter a valid email")
      .custom((value, { req }) => {
        return Author.findOne({ email: value }).then(authorInfo => {
          if (
            authorInfo &&
            authorInfo._id.toString() !== req.author._id.toString()
          ) {
            return Promise.reject(
              "email is already associated with an account"
            );
          }

          return true;
        });
      }),
    check("firstname")
      .trim()
      .notEmpty()
      .withMessage("field cannot be empty"),
    check("lastname")
      .trim()
      .notEmpty()
      .withMessage("field cannot be empty"),
    check("address").trim(),
    check("city").trim(),
    check("country").trim(),
    check("zipcode").trim(),
    check("headerImage").trim(),
    check("avatarImage").trim(),
    check("socialFacebook").trim(),
    check("socialTwitter").trim(),
    check("socialInstagram").trim()
  ],
  isAuth,
  blogController.postProfile
);

router.post(
  "/create-post",
  [
    check("postTitle")
      .trim()
      .notEmpty()
      .withMessage("Come on your post has a title"),
    check("postCategory")
      .trim()
      .notEmpty()
      .withMessage("Your post should have a category"),
    check("readtime")
      .trim()
      .isNumeric()
      .notEmpty()
      .withMessage("Post should have an approximate read time"),
    check("postSummary")
      .trim()
      .notEmpty()
      .withMessage("Please tell us a summary of your post/article")
      .customSanitizer(value => {
        let postSummary = value.split(" ");
        if (postSummary.length > 22) {
          postSummary = postSummary.slice(0, 22);
          postSummary[21] = postSummary[21] + "...";
        }
        return postSummary.join(" ");
      }),
    check("postTags")
      .trim()
      .notEmpty()
      .withMessage("Post should have at least one tag"),
    check("postContent")
      .trim()
      .notEmpty()
      .withMessage("No contents No post")
  ],
  isAuth,
  blogController.postCreatePost
);

router.post(
  "/edit-post",
  [
    check("postTitle")
      .trim()
      .notEmpty()
      .withMessage("Come on your post has a title"),
    check("postCategory")
      .trim()
      .notEmpty()
      .withMessage("Your post should have a category"),
    check("readtime")
      .trim()
      .isNumeric()
      .notEmpty()
      .withMessage("Post should have an approximate read time"),
    check("postSummary")
      .trim()
      .notEmpty()
      .withMessage("Please tell us a summary of your post/article")
      .customSanitizer(value => {
        let postSummary = value.split(" ");
        if (postSummary.length > 22) {
          postSummary = postSummary.slice(0, 22);
          postSummary[21] = postSummary[21] + "...";
        }
        return postSummary.join(" ");
      }),
    check("postTags")
      .trim()
      .notEmpty()
      .withMessage("Post should have at least one tag"),
    check("postContent")
      .trim()
      .notEmpty()
      .withMessage("No contents No post")
  ],
  isAuth,
  blogController.postEditPost
)

router.delete("/posts/:postId", isAuth, blogController.deletePost)

module.exports = router;