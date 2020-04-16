const createError = require('http-errors')

const Author = require("../models/author");
const Post = require("../models/post");

const timeHelper = require("../util/TimeHelper");

exports.getIndex = (req, res, next) => {
  Post.find().populate('author').limit(3).sort({'postTime.dataAdded': 'desc'})
    .then(posts => {
      res.status(200).render('blog/index', {
        pageTitle: 'Blogy | Home',
        path: '/',
        posts: posts,
        prettifyDate: timeHelper.prettifyDate,
        timeSinceDate: timeHelper.timeSinceDate
      })
    })
    .catch(err => {
      const error = createError(500, "Something went wrong on our side! Don't worry, we're fix this");
      next(error);
    });
}

exports.getCommunity = (req, res, next) => {
  res.render('blog/community', {
    // locals here
  })
}

exports.getAbout = (req, res, next) => {
  res.status(200).render('blog/about', {
    pageTitle: 'Blogy | About',
    path: '/about'
  })
}

exports.getContact = (req, res, next) => {
  res.status(200).render('blog/contact', {
    pageTitle: 'Blogy | Contact',
    path: '/contact'
  })
}