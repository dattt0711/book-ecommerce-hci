const Book = require('../models/book');
module.exports.showCart = (req,res)=>{
    let name = req.user.username;
    if(!req.session[name]) {
        req.session[name] = {
        cart: [],
        totals: 0
    }
    }
    let bookCart = req.session[name].cart;
    res.locals.currentProduct = req.session[name].cart.length 
    res.render('books/cart', {bookCart, user: req.user, total: req.session[name].totals})
}

module.exports.placeorder = (req,res)=>{
    let name = req.user.username;
        req.session[name] = {
        cart: [],
        totals: 0
    }
    let bookCart = req.session[name].cart;
    res.locals.currentProduct = req.session[name].cart.length 
    res.render('books/cart', {bookCart, user: req.user, total: req.session[name].totals})
}

module.exports.delete = (req,res)=>{
    let {id} = req.params;
    let name = req.user.username;
    deleteBook(id, req.session[name].cart);
    res.json(req.session[name].cart)
}

module.exports.changeQty = (req,res)=>{
    let {id} = req.params;
    let {sign} = req.body;
    let name = req.user.username;
    changeQty(id, req.session[name].cart, sign);
    let updateBook = req.session[name].cart.filter(e=> e.id.toString()==id)[0];
    req.session[name].totals = calculateTotal(req.session[name].cart);
    res.json({updateBook, total: req.session[name].totals})
}

module.exports.addToCart = async (req,res)=>{
    let name = req.user.username;
    if(!req.session[name]) {
        req.session[name] = {
        cart: [],
        totals: 0
    }
    }
    let book = await Book.findById(req.params.id);
        if(isInCart(req.session[name].cart, book._id)){
            updateCart(req.session[name].cart, book._id);
            req.session[name].totals = calculateTotal(req.session[name].cart);
        }
        else{
            let b = {
                id: book._id,
                price: book.price,
                qty: 1,
                image: book.image,
                name: book.name,
            }
            req.session[name].cart.push(b);
            req.session[name].totals = calculateTotal(req.session[name].cart);
        }
    let bookCart = req.session[name].cart;
    res.locals.currentProduct = req.session[name].cart.length 
    res.render('books/cart', {bookCart, user: req.user, total: req.session[name].totals})
}

function isInCart(cart, bookId){
    let found = false;
    cart.forEach( e=>{
        if(e.id.toString() === bookId.toString()) found = true;
    })
    return found; 
}

function updateCart(cart,bookId){
    cart.forEach( e=>{
        if(e.id.toString()==bookId.toString()){
            e.qty++;
        }
    })
}

function calculateTotal(cart){
    let sum = 0;
    cart.forEach(e=>{
        sum+=e.price*e.qty;
    })
    return sum;
}

function changeQty(bookId, cart, sign) {
    cart.forEach(e => {
        if (e.id.toString() == bookId.toString()) {
            switch (sign) {
                case "plus":
                    e.qty++;
                    break;
                case "minus":
                    e.qty--;
                    break;
            }
        }
    })
}


function deleteBook(bookId, cart){
    cart.forEach(e => {
        if (e.id.toString() == bookId.toString()) {
            let index = cart.indexOf(e);
            cart.splice(index,1);    
        }
})
}