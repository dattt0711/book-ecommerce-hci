const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Category = require('../models/category');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const bookController = require('../controllers/book');

router.get('/', catchAsync(bookController.index))

router.get('/search', catchAsync(bookController.findBookByName))

router.get('/sort/:cat/:type', catchAsync(bookController.sort))

router.get('/category/:cat', catchAsync(bookController.findBookByCategory))

router.get('/category/:cat/page/:page/:type', catchAsync(bookController.pagination));


router.get('/:id', catchAsync(bookController.findBookById))



module.exports = router;