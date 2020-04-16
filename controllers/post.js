const createError = require('http-errors');

const Author = require("../models/author");
const Post = require("../models/post");

const timeHelper = require("../util/TimeHelper");

exports.getPosts = (req, res, next) => {
	const page = +req.query.page || 1;
	const postsSortCategory = req.query.category || undefined;
	const postsSortTag = req.query.withtag || undefined;
	const postSortAuthor = req.query.author || undefined;
	const ITEMS_PER_PAGE = 9;
	let totalPosts;

	let paginatedPosts;
	const allowedSortCategories = ['programming', 'motivation', 'inspiration', 'how to', 'code note', 'code challenge'];

	if (postsSortCategory && allowedSortCategories.includes(postsSortCategory)) {
		paginatedPosts = paginatedPosts = Post.find({ category: postsSortCategory }).countDocuments().then(postsNum => {
			totalPosts = postsNum;
			return Post.find({ category: postsSortCategory })
				.populate('author')
				.sort({'postTime.dataAdded': 'desc'})
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
		})
	} else {
		paginatedPosts = Post.find().countDocuments().then(postsNum => {
			totalPosts = postsNum;
			return Post.find()
				.populate('author')
				.sort({'postTime.dataAdded': 'desc'})
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
		})
	}

	if (postsSortTag) {
		paginatedPosts = paginatedPosts = Post.find({ tags: { $in: [postsSortTag] } }).countDocuments().then(postsNum => {
			totalPosts = postsNum;
			return Post.find({ tags: { $in: [postsSortTag] } })
				.populate('author')
				.sort({'postTime.dataAdded': 'desc'})
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
		})
	}

	if (postSortAuthor) {
		paginatedPosts = paginatedPosts = Post.find({ author: postSortAuthor }).countDocuments().then(postsNum => {
			totalPosts = postsNum;
			return Post.find({ author: postSortAuthor })
				.populate('author')
				.sort({'postTime.dataAdded': 'desc'})
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
		})
	}

	paginatedPosts.then(posts => {
		res.status(200).render('posts/posts', {
			pageTitle: 'Blogy | Articles',
			path: '/posts',
			posts: posts,
			prettifyDate: timeHelper.prettifyDate,
			timeSinceDate: timeHelper.timeSinceDate,
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalPosts,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalPosts / ITEMS_PER_PAGE),
			currentCategory: postsSortCategory,
			sortTag: postsSortTag,
			sortAuthor: (postSortAuthor) ? posts[0].author.name : undefined
		})
	})
	.catch(err => {
		const error = createError(500, "Something went wrong on our side! Don't worry, we're fixing it")
		next(error);
	});
}

exports.getPost = (req, res, next) => {
	const postId = req.params.postId;
	
	Post.findById(postId).populate('author')
	.then(post => {
		post.views += 1;
		post.save();

		Post.countDocuments().then(count => {
			let random = (count < 6) ? 0 : Math.floor(Math.random() * (count - 3));
			Post.find({ _id: { $ne: post._id }, tags: { $in: post.tags }})
				.populate('author')
				.skip(random).limit(6)
				.then(randomizedRelatedPosts => {
				
				res.status(200).render('posts/singlepost', {
					pageTitle: 'Blogy | Singlepost',
					path: '/posts',
					post: post,
					relatedPosts: randomizedRelatedPosts,
					prettifyDate: timeHelper.prettifyDate,
					timeSinceDate: timeHelper.timeSinceDate,
				})
			})
		});	
	})
	.catch(err => {
		const error = createError(500, "Something went wrong on our side! Don't worry, we're fixing it")
		next(error);
	});
}

exports.getPostAuthor = (req, res, next) => {
	const authorId = req.params.authorId;

	Author.findById(authorId)
		.then(author => {
			author.profileVisits += 1;
			author.save();

			Post.find({ author: author._id }).populate('author').sort({'postTime.dataAdded': 'desc'})
				.then(authorPosts => {
					res.render('posts/blog-author', {
						pageTitle: 'Blogy | Post Author',
						path: '/posts',
						author: author,
						authorPosts: authorPosts
					})
				})
		})
		.catch(err => {
      const error = error = createError(500, "Something went wrong on our side! Don't worry, we're fixing it")
      next(error);
    });
}