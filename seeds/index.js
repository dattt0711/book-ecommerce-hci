const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Book = require('../models/book');
const Category = require('../models/category');
const listBook = require('../books')
const faker = require('faker');
mongoose.connect('mongodb://localhost:27017/book-shop');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{
    console.log('database connected');
});

const nameBookSample = ['Một cuốn sách về chủ nghĩa tối giản', 'chó sủa nhầm cây', 'Trí tuệ do thái', '1 ngày bằng 48h',
'The magic', 'Senica', 'Đừng chạy theo số đông', 'Ám ảnh sợ xã hội', 'Hôm nay phải mở mang', 'Thói quen trở nên sáng tạo',
"Cân bằng cảm xúc cả lúc bão giông", "Leadership"]
const linkImageBook = ["https://salt.tikicdn.com/cache/400x400/ts/product/26/5d/69/7bf0649939f10d3545325d7b17c11223.jpg.webp",
"https://salt.tikicdn.com/cache/200x200/ts/product/29/c6/6d/64243ee01d5a0786fdb3c3977ec9c63e.jpg.webp", "https://salt.tikicdn.com/cache/200x200/ts/product/fb/1d/34/4a5be4b48fbb204120983eae008c2705.jpg.webp",
"https://salt.tikicdn.com/cache/200x200/ts/product/77/43/c6/4a6f7f0d38eb4175180d4298843e7020.jpg.webp", "https://salt.tikicdn.com/cache/200x200/ts/product/09/ba/f3/bc4eb7938152765e38405a10f1e18830.jpg.webp",
"https://salt.tikicdn.com/cache/200x200/ts/product/9d/16/70/96ff593a550354ce055c067d064df37a.jpg.webp", "https://salt.tikicdn.com/cache/200x200/ts/product/77/d5/5b/0383d7eae7d5269ae6896f2739f8a724.jpg.webp",
"https://salt.tikicdn.com/cache/200x200/ts/product/8e/0a/47/70d281ef74f6976194bdce448bbabeb1.jpg.webp", "https://salt.tikicdn.com/cache/200x200/ts/product/a2/56/95/7be009f2e04ae1812db444e7543e905b.jpg.webp",
"https://salt.tikicdn.com/cache/200x200/ts/product/b1/f7/e2/3489d900a1f433b411251563bd2da7b4.jpg.webp", "https://salt.tikicdn.com/cache/200x200/ts/product/8f/21/81/9293313e5920833d5fb86bc6e2710e4a.jpg.webp",
"https://salt.tikicdn.com/cache/200x200/ts/product/df/47/b4/f2a2413f2e13738bd4aa44a571a04168.jpg.webp",
]

const seedDB = async ()=>{
    await Book.deleteMany({});
    for(let i=0;i<nameBookSample.length;i++){
        let b = new Book();
        let c = await Category.findOne({name: 'self-help'})
        b.name = nameBookSample[i];
        b.price = faker.commerce.price();
        b.description = faker.commerce.productDescription();
        b.image = {
            url: linkImageBook[i],
        };
        b.author = "Keigo";
        c.books.push(b);
        b.category = c;
        await b.save();
        await c.save();
    }
}

seedDB();