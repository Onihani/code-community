const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
	author: {
		type: Schema.Types.ObjectId, 
		ref: 'Author', 
		required: true
	},
	category: {
		type: String,
		required: true
	},
	featured: {
		type: Boolean,
		required: false
	},
	title: {
	 type: String,
	 required: true
	},
	summary: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: false
	},
	tags: {
		type: Array,
		required: true
	},
	views: {
		type: Number,
		default: 0
	},
	readtime: {
		type: Number,
		required: true
	},
	postTime: {
	 dataAdded: {
		type: Date, 
		default: new Date()
	 },
	 lastModified: {
		type: Date, 
		default: new Date()
	 }
	}
})

module.exports = mongoose.model('Post', postSchema);
