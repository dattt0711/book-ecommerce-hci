const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Category = require('../models/category');

module.exports.index = async(req,res)=>{
    const current = 1;
    const perPage = 12;
    const books = await Book.find({}).skip(perPage*(current-1)).limit(perPage);
    const allBook = await Book.find({});
    const categories = await Category.find({});
    res.render('books/index',{
        cat: 'All',
        categories,
        books,
        pages: Math.ceil(allBook.length/perPage),
        current,
        type: "normal"
    })
}

module.exports.sort = async(req, res)=>{
    let cat = "All" || req.params.cat
    let current = 1;
    let perPage = 12;
    let type = req.params.type;
    let books = [];
    let allBook = [];
    if(cat == "All"){
        if (type == "asc") {
            books = await Book.find({}).sort({ 'price': 1 }).skip(perPage * (current - 1)).limit(perPage);
            allBook = await Book.find({});
        }
        else {
            books = await Book.find({}).sort({ 'price': -1 }).skip(perPage * (current - 1)).limit(perPage);
            allBook = await Book.find({});
        }
    }else {
        if (type == "asc") {
            books = await Book.find({category: cat._id}).sort({ 'price': 1 }).skip(perPage * (current - 1)).limit(perPage);
            allBook = await Book.find({category: cat._id});
        }
        else {
            books = await Book.find({category: cat._id}).sort({ 'price': -1 }).skip(perPage * (current - 1)).limit(perPage);
            allBook = await Book.find({category: cat._id});
        }
    }
    const categories = await Category.find({});
    res.render('books/index',{
        cat: cat,
        categories,
        books,
        pages: Math.ceil(allBook.length/perPage),
        current,
        type
    })
}

module.exports.findBookByCategory = async(req,res)=>{
    const current = Number(req.params.page) || 1;
    const perPage = 12;
    const categories = await Category.find({});
    const cat = await Category.findOne({name: req.params.cat});
    const books = await Book.find({category: cat._id}).skip(perPage*(current-1)).limit(perPage); 
    const allBook = await Book.find({category: cat._id});
    res.render('books/index',{
        cat: cat? cat.name : 'All',
        categories,
        books,
        pages: Math.ceil(allBook.length/perPage),
        current,
        type: "normal"
    })
}
module.exports.findBookByName = async (req,res) => {
    const search = req.query.search || "";
    const current = Number(req.params.page) || 1;
    const perPage = 12;
    const categories = await Category.find({});
   
    const books = await Book.find({name:{$regex: search, $options: 'i'}}).skip(perPage*(current-1)).limit(perPage); 
    console.log(books,'books')
    const allBook = await Book.find({});
    res.render('books/index',{
        cat: 'All',
        categories,
        books,
        pages: Math.ceil(allBook.length/perPage),
        current,
        type: "normal"
    })
}
module.exports.pagination = async(req,res)=>{
    const type = req.params.type || normal;
    const current = Number(req.params.page) || 1;
    const perPage = 12;
    const cat = await Category.findOne({name: req.params.cat});
    const categories = await Category.find({});
    let books;
    if(type == "normal"){
        if (req.params.cat === 'All') {
            books = await Book.find({}).skip(perPage * (current - 1)).limit(perPage);
        }
        else {
            books = await Book.find({ category: cat._id }).skip(perPage * (current - 1)).limit(perPage);
        }
    }
    else if(type == "asc") {
        if(req.params.cat === 'All'){
            books = await Book.find({}).sort({"price":1}).skip(perPage*(current-1)).limit(perPage);  
        }
        else {
            books = await Book.find({category: cat._id}).skip(perPage*(current-1)).limit(perPage);
        }
    } 
    else {
        if(req.params.cat === 'All'){
            books = await Book.find({}).sort({"price":-1}).skip(perPage*(current-1)).limit(perPage);  
        }
        else {
            books = await Book.find({category: cat._id}).skip(perPage*(current-1)).limit(perPage);
        }
    }
    const allBook = await Book.find({});
    res.render('books/index',{
        cat: cat? cat.name : 'All',
        categories,
        books,
        pages: Math.ceil(allBook.length/perPage),
        current,
        type
    })
}

module.exports.findBookById = async(req,res)=>{
    const {id} = req.params;
    const getBook = await Book.findById(id);
    res.render('books/show', {getBook})
}