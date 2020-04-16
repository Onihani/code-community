const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
const MongoDBStore = require("connect-mongo")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const createError = require('http-errors');
const morgan = require('morgan');

const winston = require('./config/winston');

const Author = require("./models/author");
const Post = require("./models/post");

const getRandomColor = require('./util/getRandomColor');

const MONGODB_URI =
  "mongodb+srv://rilla:rilla@cluster0-1xhqu.mongodb.net/blogy?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  // uri: MONGODB_URI,
  // collection: "sessions"
  mongooseConnection: mongoose.connection
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "pug");
app.set("views", "views");

const blogRoutes = require("./routes/blog");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const authorRoutes = require("./routes/author");
const errorRoutes = require("./routes/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("postImage")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.author) {
    return next();
  }
  Author.findById(req.session.author._id)
    .then(author => {
      if (!author) {
        return next();
      }
      req.author = author;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  let topAuthors = []
  const blogyTags = [];
  res.locals.blogTags = blogyTags;
  res.locals.topAuthors = topAuthors;

  // parsing function for getting random tag colors to views
  res.locals.getRandomColor = getRandomColor;

  Promise.all([
    // parsing blog tags to all views
    Post.find().select('tags')
      .then(tagsArr => {
        tagsArr.reduce((accum, current) => {
          current.tags.forEach(tag => {
            if (!accum.includes(tag)) {
              accum.push(tag)
            }
          })
          return accum
        }, blogyTags)
      }),

    // parsing top authors to all views
    Author.find().sort({ profileVisits: 'desc' }).limit(5)
      .then(authors => {
        authors.reduce((accum, current) => {
          return accum.push(current)
        }, topAuthors)
      })
  ])
  .then(() => {
    next();
  })
  .catch(err => {
    let error = createError(500, 'Something Went Wrong')
    next(error)
  })
});

// <== Middleware for logging ==>
app.use(morgan('combined', { stream: winston.stream }))

app.use(blogRoutes);
app.use("/posts", postRoutes);
app.use(authRoutes);
app.use("/author", authorRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
  winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (error.statusCode === 404) {
    console.log(error.statusCode)
    return res.render('error/not-found', {
      pageTitle: 'Page not found | Blogy',
      path: "/error"
    })
  }

  if (error.statusCode === 500) {
    console.log(error)
    return res.render('error/server-error', {
      pageTitle: 'Something went wrong | Blogy',
      path: "/error",
      errorTitle: 'Internal Server Error',
      errorMessage: error.message,
      errorCode: error.statusCode
    });
  }
})

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    const port_number = server.listen(process.env.PORT || 3000);
    app.listen(port_number);
  })
  .catch(err => {
    console.log(err);
  });
