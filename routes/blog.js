const express = require('express');

const blogController = require('../controllers/blog');

const router = express.Router();

router.get('/', blogController.getIndex);

router.get('/community', blogController.getCommunity);

router.get('/about', (req, res, next) => { try {} catch (err) {console.log(err.statusCode); next()}}, blogController.getAbout);

router.get('/contact', blogController.getContact);

module.exports = router;