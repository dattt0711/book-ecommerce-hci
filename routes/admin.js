const express = require('express');
const router = express.Router();
const {isLoggedIn, isAdmin} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Book = require("../models/book");
const Category = require('../models/category');
const User = require('../models/user');
const adminController = require('../controllers/admin')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})
// router.use(isLoggedIn, isAdmin, (req,res, next) => {
//     next();
// });

router.get('/admin', catchAsync(adminController.index))

router.get('/admin/books/new', catchAsync(adminController.formCreateBook))

router.get('/admin/users', catchAsync(adminController.getAllUsers))

router.post('/admin/:id/changeRole', catchAsync(adminController.changeRole))

router.post('/admin/category',catchAsync(adminController.newCategory))

router.patch('/admin/category/:id', catchAsync(adminController.modifyCategory))

router.delete('/admin/category/:id', catchAsync(adminController.deleteCategory))

router.post('/admin/books', upload.single('image'), catchAsync(adminController.newBook));

router.get('/admin/books/:id/edit', catchAsync(adminController.formModifyBook))

router.patch('/admin/books/:id', catchAsync(adminController.modifyBook))


router.delete('/admin/books/:id', catchAsync(adminController.deleteBook))

module.exports = router;