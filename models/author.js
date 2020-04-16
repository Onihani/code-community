const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
	username: {
		type: String,
		tirm: true,
		required: true
	},
	name: {
	 type: String,
	 trim: true,
	 required: true
	},
	email: {
	 type: String,
	 trim: true,
	 unique: true,
	 required: true
	},
	profileImages: {
		avatarImg: {
			type: String,
			required: false
		},
		headerImg: {
			type: String,
			required: false
		}
	},
	location: {
		address: {
			type: String,
			trim: true
		},
		city: {
			type: String,
			trim: true
		},
		country:  {
			type: String,
			trim: true
		},
		zipcode: {
			type: String,
			trim: true
		}
	},
  about: {
    type: String,
		required: true,
		default: 'Hey am a new blogy author'
  },
  socialHandles: {
    handles: {
			facebook: {type: String}, 
			instagram: {type: String}, 
			twitter: {type: String}
    }
	},
	profileVisits: {
		type: Number,
		default: 0
	},
	password: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('Author', authorSchema);
