const { validationResult } = require("express-validator");
const createError = require('http-errors');

const Author = require("../models/author");
const Post = require("../models/post");
const Draft = require("../models/draft");

const extractErrMsg = require("../util/extract-error-msg");
const fileHelper = require("../util/file");
const timeHelper = require("../util/TimeHelper");

exports.getAuthorLogin = (req, res, next) => {
  // if user is already logined in
  if (req.session.isLoggedIn) {
    return res.redirect("/author/dashboard");
  }

  res.render("author/login", {
    pageTitle: "Blogy Dev",
    path: "/author"
  });
};

exports.getAuthorSignup = (req, res, next) => {
  // if user is already logined in
  if (req.session.isLoggedIn) {
    return res.redirect("/author/dashboard");
  }

  res.render("author/register", {
    pageTitle: "Blogy Dev",
    path: "/author/register"
  });
};

exports.getDashboard = (req, res, next) => {
  let totalPosts;
  let totalDrafts;
  let totalPostViews = 0;

  Promise.all([
    Post.find({ author: req.author._id }).countDocuments().then(postsNum => {
      totalPosts = postsNum;   
    }),
    Draft.find({ author: req.author._id }).countDocuments().then(draftsNum => {
      totalDrafts = draftsNum;   
    }), 
    Post.find({ author: req.author._id }).then(posts => {
      totalPostViews = posts.reduce((accum, current) => (accum += current.views), totalPostViews)
    })
  ]).then(() => {
    Post.find({ author: req.author._id }).sort({'postTime.dataAdded': 'desc'})
    .then(posts => {
      res.render("author/dashboard", {
        pageTitle: "Blogy Dev | Dashboard",
        path: "/author/dashboard",
        posts: posts,
        totalPosts: totalPosts,
        totalDrafts: totalDrafts,
        totalPostViews: totalPostViews,
        prettifyDate: timeHelper.prettifyDate,
        timeSinceDate: timeHelper.timeSinceDate
      });
    })
    .catch(err => {
      const error = createError(500, "Something went wrong on our side! Don't worry, we're fixing it")
      next(error);
    });
  })
};

exports.getPosts = (req, res, next) => {
  Post.find({ author: req.author._id }).sort({'postTime.dataAdded': 'desc'})
    .then(posts => {
      res.render("author/posts", {
        pageTitle: "Blogy Dev | Posts",
        path: "/author/posts",
        posts: posts,
        prettifyDate: timeHelper.prettifyDate,
        timeSinceDate: timeHelper.timeSinceDate
      });
    })
    .catch(err => {
      const error = createError(500, "Something went wrong on our side! Don't worry, we're fixing it")
      next(error);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId).then(post => {
    Author.findById(post.author).then(author => {
      // getting 3 random related posts for related post section
      Post.count().exec(function(err, count){
        let random = (count < 3) ? 0 : Math.floor(Math.random() * (count - 3));
        Post.find({
          _id: { $ne: post._id }, 
          tags: { $in: post.tags }
        }).skip(random).limit(3).exec(
          function (err, randomizedRelatedPosts) {
            if (err) console.log(err);

            res.render("author/single-post", {
              pageTitle: "",
              path: "/author/posts",
              post: post,
              author: author,
              relatedPosts: randomizedRelatedPosts
            })
        });
      });
    })
  })
  .catch(err => {
    const error = new Error(err);
    error.statusCode = 500;
    next(error);
  });
}

exports.getCreatePost = (req, res, next) => {
  res.render("author/create-post", {
    pageTitle: "Blogy Dev | Post Editor",
    path: "/author/create-post"
  });
};

exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit;
  const isDraft = req.query.isDraft || undefined;
  if (!editMode) {
    return res.redirect("/author");
  }

  let PostDraft;
  const postId = req.params.postId;

  if (isDraft) {
    PostDraft = Draft.findById(postId);
  } else {
    PostDraft = Post.findById(postId);
  }
  
  PostDraft
    .then(post => {
      if (!post || post.author.toString() !== req.author._id.toString()) {
        req.flash("danger", "You are not authorize to access this content");
        return res.redirect("/author");
      }

      res.render("author/create-post", {
        pageTitle: "Blogy Dev | Post Editor",
        path: "/author/create-post",
        post: post,
        editing: editMode,
        isDraft: isDraft
      });
    })
    .catch(err => {
      const error = createError(500, "Something went wrong on our side! Don't worry, we're fixing it")
      next(error);
    });
};

exports.postCreatePost = (req, res, next) => {
  const postTitle = req.body.postTitle;
  const postCategory = req.body.postCategory;
  const postReadTime = req.body.readtime;
  let featured = req.body.featured;
  const postImage = req.file;
  const postSummary = req.body.postSummary;
  let postTags = req.body.postTags;
  if (postTags) {
    postTags = postTags.split(',').map(tag => tag.trim())
  }
  const postContent = req.body.postContent;
  const publishSubmitBtn = req.body.publishBtn;
  const draftSubmitBtn = req.body.draftBtn;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("author/create-post", {
      pageTitle: "Blogy Dev | Post Editor",
      path: "/author/create-post",
      postTitleErrMsg: extractErrMsg(errors.array(), "postTitle"),
      postCategoryErrMsg: extractErrMsg(errors.array(), "postCategory"),
      postImageErrMsg: extractErrMsg(errors.array(), "postImage"),
      postSummaryErrMsg: extractErrMsg(errors.array(), "postSummary"),
      postTagsErrMsg: extractErrMsg(errors.array(), "postTags"),
      postReadTimeErrMsg: extractErrMsg(errors.array(), "readtime"),
      postContentErrMsg: extractErrMsg(errors.array(), "postContent"),
      oldInput: {
        postTitle,
        postImage,
        postSummary,
        postTags,
        postContent,
        featured,
        postCategory,
        postReadTime
      },
      validationErrors: errors.array()
    });
  }

  let postImageUrl;
  if (postImage) {
    postImageUrl = postImage.path;
  }

  if (featured == 'true') {
    featured = true;
  } else {
    featured = false;
  }

  // Publishing Post
  if (publishSubmitBtn) {
    const post = new Post({
      author: req.author._id,
      title: postTitle,
      category: postCategory,
      imageUrl: postImageUrl,
      summary: postSummary,
      featured: featured,
      content: postContent,
      tags: postTags,
      readtime: postReadTime
    });
  
    post
      .save()
      .then(result => {
        // console.log(result)
        console.log("Created Product");
        res.redirect("/author/posts");
      })
      .catch(err => {
        const error = new Error(err);
        error.statusCode = 500;
        next(error);
      });
  }

  // Saving Post As Draft
  if (draftSubmitBtn) {
    const draft = new Draft({
      author: req.author._id,
      title: postTitle,
      category: postCategory,
      imageUrl: postImageUrl,
      summary: postSummary,
      featured: featured,
      content: postContent,
      tags: postTags,
      readtime: postReadTime
    })

    draft
      .save()
      .then(result => {
        // console.log(result)
        console.log("Created Draft");
        res.redirect("/author/drafts");
      })
      .catch(err => {
        const error = new Error(err);
        error.statusCode = 500;
        next(error);
      });
  }
};

exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;

  const updatedPostTitle = req.body.postTitle;
  const updatedPostCategory = req.body.postCategory;
  const updatedPostReadTime = req.body.readtime;
  let updatedFeatured = req.body.featured;
  const updatedPostImage = req.file;
  const updatedPostSummary = req.body.postSummary;
  let updatedPostTags = req.body.postTags;
  const updatedPostContent = req.body.postContent;
  const publishSubmitBtn = req.body.publishBtn;
  const draftSubmitBtn = req.body.draftBtn;
  const filename = req.body.filename;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("author/create-post", {
      pageTitle: "Blogy Dev | Post Editor",
      path: "/author/create-post",
      postTitleErrMsg: extractErrMsg(errors.array(), "postTitle"),
      postCategoryErrMsg: extractErrMsg(errors.array(), "postCategory"),
      postImageErrMsg: extractErrMsg(errors.array(), "postImage"),
      postSummaryErrMsg: extractErrMsg(errors.array(), "postSummary"),
      postTagsErrMsg: extractErrMsg(errors.array(), "postTags"),
      postReadTimeErrMsg: extractErrMsg(errors.array(), "readtime"),
      postContentErrMsg: extractErrMsg(errors.array(), "postContent"),
      oldInput: {
        postTitle: updatedPostTitle,
        postCategory: updatedPostCategory,
        featured: updatedFeatured,
        postImage: updatedPostImage,
        postSummary: updatedPostSummary,
        postTags: updatedPostTags,
        postContent: updatedPostContent,
        postReadTime: updatedPostReadTime,
        filename: filename
      },
      validationErrors: errors.array()
    });
  }

  if (publishSubmitBtn) {
    Post.findById(postId).then(post => {
      if (post.author.toString() !== req.author._id.toString()) {
        req.flash("danger", "You are not authorize to perform this action");
        return res.redirect("/author/posts");
      }
  
      if (updatedPostTags) {
        updatedPostTags = updatedPostTags.split(',').map(tag => tag.trim())
      }
  
      if (updatedFeatured == 'true') {
        updatedFeatured = true
      } else {
        updatedFeatured = false
      }
  
      Draft.findOne({ imageUrl: post.imageUrl })
        .then(draft => {
          post.title = updatedPostTitle;
          post.category = updatedPostCategory;
          post.featured = updatedFeatured;
          post.summary = updatedPostSummary;
          post.tags = updatedPostTags;
          post.content = updatedPostContent;
          post.readtime = updatedPostReadTime;
          post.postTime.lastModified = new Date();
          if (updatedPostImage) {
            if (draft) {
              post.imageUrl = updatedPostImage.path;
            } else {
              fileHelper.deleteFile(post.imageUrl);
              post.imageUrl = updatedPostImage.path;
            }  
          }

          return post
            .save()
            .then(result => {
              console.log("updated post successfully");
              req.flash("alert", "Post Updated Successfully");
              res.redirect("/author/posts");
            })
            .catch(err => {
              const error = new Error(err);
              error.statusCode = 500;
              next(error);
            });
        })
    });
  }

  if (draftSubmitBtn) {
    Draft.findById(postId).then(draft => {
      if (draft && (draft.author.toString() !== req.author._id.toString())) {
        req.flash("danger", "You are not authorize to perform this action");
        return res.redirect("/author/drafts");
      }
  
      if (updatedPostTags) {
        updatedPostTags = updatedPostTags.split(',').map(tag => tag.trim())
      }
  
      if (updatedFeatured == 'true') {
        updatedFeatured = true
      } else {
        updatedFeatured = false
      }
  
      if (draft) {
        Post.findOne({ imageUrl: draft.imageUrl })
          .then(post => {
            draft.title = updatedPostTitle;
            draft.category = updatedPostCategory;
            draft.featured = updatedFeatured;
            draft.summary = updatedPostSummary;
            draft.tags = updatedPostTags;
            draft.content = updatedPostContent;
            draft.readtime = updatedPostReadTime;
            draft.postTime.lastModified = new Date();
            if (updatedPostImage) {
              if (!post) {
                fileHelper.deleteFile(draft.imageUrl);
              }
              draft.imageUrl = updatedPostImage.path;
            } 

            return draft
              .save()
              .then(result => {
                console.log("updated draft successfully");
                req.flash("alert", "Draft Updated Successfully");
                res.redirect("/author/drafts");
              })
              .catch(err => {
                const error = new Error(err);
                error.statusCode = 500;
                next(error);
              });
          })
      } else {
        draft = new Draft({
          author: req.author._id,
          title: updatedPostTitle,
          category: updatedPostCategory,
          imageUrl: filename,
          summary: updatedPostSummary,
          featured: updatedFeatured,
          content: updatedPostContent,
          tags: updatedPostTags,
          readtime: updatedPostReadTime
        })

        return draft
          .save()
          .then(result => {
            console.log("Created draft successfully");
            req.flash("alert", "Draft Created Successfully");
            res.redirect("/author/drafts");
          })
          .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            next(error);
          });
      }
      
    });
  }
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  const isDraft = req.query.draft || undefined;

  console.log(req.url, req.query)

  let DraftPost;
  if (isDraft) {
    DraftPost = Draft.findById(postId)
  } else {
    DraftPost = Post.findById(postId)
  }


  DraftPost.then(post => {
    if (!post) {
      return next(new Error("Post not Found"));
    }

    if (post.author.toString() !== req.author._id.toString()) {
      return next(new Error("You are not authorized to delete this content"));
    }

    if (isDraft) {
      return Post.findOne({ imageUrl: post.imageUrl })
      .then(verifyPost => {
          if (!verifyPost) {
            fileHelper.deleteFile(post.imageUrl);
          }

          return Draft.deleteOne({ _id: postId, author: req.author._id });
        })
    } else {
      return Draft.findOne({imageUrl: post.imageUrl})
        .then(verifyDraft => {
          if (!verifyDraft) {
            fileHelper.deleteFile(post.imageUrl);
          }

          return Post.deleteOne({ _id: postId, author: req.author._id });
        })
    }
    
  })
  .then(() => {
    console.log('Post Deleted')
    res.status(200).json({
      message: 'Poof! Your post has been Deleted 🗑️!'
    })
  })
  .catch(err => {
    res.status(500).json({
      message: 'Deleting post failed'
    })
  })
};

exports.getInsights = (req, res, next) => {
  Post.find().sort({ 'postTime.dataAdded': 'desc' })
    .then(posts => {
      res.render("author/insights", {
        pageTitle: "Blogy Dev | Insights",
        path: "/author/insights",
        posts: posts,
        profileVisits: req.author.profileVisits,
        prettifyDate: timeHelper.prettifyDate,
        timeSinceDate: timeHelper.timeSinceDate
      });
    })
    .catch(err => {
      const error = createError(500, "Something went wrong on our side! Don't worry, we're fixing it")
      next(error);
    });
};

exports.getDrafts = (req, res, next) => {
  Draft.find().sort({'postTime.dataAdded': 'desc'}).then(drafts => {
    res.render("author/drafts", {
      pageTitle: "Blogy Dev | drafts",
      path: "/author/drafts",
      drafts: drafts,
      prettifyDate: timeHelper.prettifyDate,
      timeSinceDate: timeHelper.timeSinceDate
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.statusCode = 500;
    next(error);
  });
};

exports.getProfile = (req, res, next) => {
  Author.findById(req.author._id).then(author => {
    res.render("author/profile", {
      pageTitle: "Blogy Dev | Profile",
      path: "/author/profile",
      author: author,
      flashMessage: req.flash("alert")[0]
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.statusCode = 500;
    next(error);
  });
};

exports.postProfile = (req, res, next) => {
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const address = req.body.address;
  const city = req.body.city;
  const country = req.body.country;
  const zipcode = req.body.zipcode;
  const about = req.body.about;
  const headerImage = req.body.headerImage;
  const avatarImage = req.body.avatarImage;
  const socialFacebook = req.body.socialFacebook;
  const socialTwitter = req.body.socialTwitter;
  const socialInstagram = req.body.socialInstagram;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("author/profile", {
      pageTitle: "Blogy Dev | Profile",
      path: "/author/profile",
      author: req.author,
      usernameErrMsg: extractErrMsg(errors.array(), "username"),
      emailErrMsg: extractErrMsg(errors.array(), "email"),
      firstnameErrMsg: extractErrMsg(errors.array(), "firstname"),
      lastnameErrMsg: extractErrMsg(errors.array(), "lastname"),
      oldInput: {
        username,
        email,
        firstname,
        lastname,
        address,
        city,
        zipcode,
        headerImage,
        avatarImage,
        socialFacebook,
        socialTwitter,
        socialInstagram
      },
      validationErrors: errors.array()
    });
  }

  Author.findById(req.author._id)
    .then(author => {
      author.username = username;
      author.name = `${firstname} ${lastname}`;
      author.email = email;
      author.location.address = address;
      author.location.city = city;
      author.location.country = country;
      author.location.zipcode = zipcode;
      author.about = about;
      author.profileImages.avatarImg =
        avatarImage == "Default Avatar Image" ? "" : avatarImage;
      author.profileImages.headerImg =
        headerImage == "Random Images" ? "" : headerImage;
      author.socialHandles.handles = {
        facebook: socialFacebook,
        twitter: socialTwitter,
        instagram: socialInstagram
      };

      return author.save();
    })
    .then(result => {
      req.flash("alert", "Profile Updated Successfully");
      return res.redirect("/author/profile");
    })
    .catch(err => {
      const error = createError(500, "Something went wrong on our side! Don't worry, we're fixing it")
      next(error);
    });
};
