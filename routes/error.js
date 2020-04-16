const express = require("express");

const errorController = require('../controllers/error');

const router = express.Router();


router.get('/500', errorController.get500);            

router.get('/404', errorController.get404);

router.use(errorController.handle404);

// router.use(errorController.handleError);

module.exports = router;