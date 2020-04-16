const express = require("express");
const { check, body } = require("express-validator");
const bcrypt = require("bcrypt");

const authController = require("../controllers/auth");
const Author = (require = require("../models/author"));

const router = express.Router();

router.post(
  "/author/register",
  [
    body("username")
      .notEmpty()
      .withMessage("Name field cannot be empty")
      .trim(),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail()
      .trim()
      .custom((value, { req }) => {
        return Author.findOne({ email: value }).then(authorInfo => {
          if (authorInfo) {
            return Promise.reject(
              "There's an account already associated with this email, please pick a different email"
            );
          }
        });
      }),
    body("password", "Password should be 6 or characters.")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password fields have to match");
        }
        return true;
      })
  ],
  authController.postRegisterAuthor
);

router.post(
  "/author/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid Email Address")
      .normalizeEmail()
      .custom((value, { req }) => {
        return Author.findOne({ email: value }).then(authorInfo => {
          if (!authorInfo) {
            throw new Error("Incorrect Email");
          }
          return true;
        });
      }),
    body("password")
      .trim()
      .isAlphanumeric()
      .custom((value, { req }) => {
        return Author.findOne({ email: req.body.email }).then(authorInfo => {
          if (authorInfo) {
            return bcrypt.compare(value, authorInfo.password).then(passMatch => {
              if (!passMatch) {
                throw new Error("Incorrect Password");
              }
            });
          }
          return true;
        });
      })
  ],
  authController.postLoginAuthor
);

router.post("/author/logout", authController.postLogout);

// remember to add reset password routes

module.exports = router;
