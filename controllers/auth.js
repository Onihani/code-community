const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const Author = require("../models/author");

const extractErrMsg = require("../util/extract-error-msg");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

// registering a new author
exports.postRegisterAuthor = (req, res, next) => {
  const authorName = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("author/register", {
      path: "/author/register",
      pageTitle: "Register",
      usernameErrMsg: extractErrMsg(errors.array(), "username"),
      emailErrMsg: extractErrMsg(errors.array(), "email"),
      passwordErrMsg: extractErrMsg(errors.array(), "password"),
      confirmPasswordErrMsg: extractErrMsg(errors.array(), "confirmPassword"),
      oldInput: {
        authorName: authorName,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const author = new Author({
        name: authorName,
        email: email,
        password: hashedPassword
      });

      author.save();

      // setting session for registered author
      req.session.isLoggedIn = true;
      req.session.author = author;
      return req.session.save(err => {
        console.log(err);
        return res.redirect("/author");
      });
    })
    .then(result => {
      res.redirect("/author/profile");
      return transporter.sendMail({
        to: email,
        from: "creativelyfofficial@gmail.com",
        subject: "Congrats On Joining Blogy Dev Authors",
        html: "<h1>Sign up succedded please complete your profile</h1>"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

// login for authors
exports.postLoginAuthor = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("author/login", {
      path: "/author/login",
      pageTitle: "Login",
      emailErrMsg: extractErrMsg(errors.array(), "email"),
      passwordErrMsg: extractErrMsg(errors.array(), "password"),
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  // if no errors author is a authorised to login
  Author.findOne({ email: email })
    .then(authorInfo => {
      bcrypt
        .compare(password, authorInfo.password)
        .then(passMatch => {
          if (passMatch) {
            req.session.isLoggedIn = true;
            req.session.author = authorInfo;
            return req.session.save(err => {
              console.log(err);
              return res.redirect("/author/dashboard");
            });
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect("/author");
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      return next(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    return res.redirect("/author");
  });
};


// remember to add reset password controllers