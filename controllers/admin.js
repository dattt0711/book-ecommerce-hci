const Book = require("../models/book");
const Category = require('../models/category');
const User = require('../models/user');

module.exports.index = async (req,res) => {
    let books = await Book.find({}).populate('category');
    let category = await Category.find({});
    res.render('admin/index',{books, category, page:'book'})
}

module.exports.formCreateBook = async (req, res)=>{
    let cat = await Category.find({});
    res.render('admin/createBook', {category:cat, page:'book'});
}

module.exports.getAllUsers = async (req, res)=>{
    let users = await User.find({role: {$ne: 'ADMIN'}});
    res.render('admin/users',{users,page:'user'})
}

module.exports.changeRole = async(req,res)=>{
    let {id} = req.params;
    let updateUser = await User.findByIdAndUpdate(id,req.body);
}

module.exports.newCategory = async(req, res)=>{
    const {name} = req.body;
    const newCategory = new Category({name});
    await newCategory.save();
    res.redirect("/admin");
}

module.exports.modifyCategory = async (req, res)=>{
    const id = req.params.id;
    const obj = JSON.parse(JSON.stringify(req.body));
    const updateCat = await Category.findByIdAndUpdate(id, obj);
    res.redirect('/admin')
}

module.exports.deleteCategory = async (req, res)=>{
    const {id} = req.params;
    await Category.findByIdAndDelete(id);
    res.redirect('/admin')
}

module.exports.newBook = async (req, res)=>{
    const {name,price,author, category, description,image} = req.body;
    let cat = await Category.findOne({name: category});
    const newBook = new Book({name, price, author, description, image});
    newBook.image = {url: req.file.path, filename: req.file.filename}
    newBook.category = cat._id;
    cat.books.push(newBook);
    await newBook.save();
    await cat.save();
    res.redirect("/admin");
}

module.exports.formModifyBook = async(req,res)=>{
    const book = await Book.findById(req.params.id).populate('category');
    let cat = await Category.find({});
    res.render('admin/editBook',{book,cat, page:'book'})
}

module.exports.modifyBook = async(req,res)=>{
    const {id} = req.params;
    if(req.body.category){
        let cat = await Category.findOne({name: req.body.category});
        req.body.category = cat._id;
        const updateBook = await Book.findByIdAndUpdate(id, req.body);
        cat.books.push(updateBook);
        await cat.save();
    }
    res.redirect('/admin')
}

module.exports.deleteBook = async(req,res)=>{
    let book = await Book.findById(req.params.id);
    await Category.findByIdAndUpdate(book.category, {$pull:{books: book._id}});
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/admin')
}