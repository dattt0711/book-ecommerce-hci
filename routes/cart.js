const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const cartController = require('../controllers/cart')
const cors = require('cors');
router.use(isLoggedIn, (req,res,next) => {
    next();
});

router.use(isLoggedIn, (req,res,next) => {
    next();
})

router.get('/cart', isLoggedIn, cartController.showCart)

router.get('/placeorder', cartController.placeorder);

router.delete('/cart/deleteBook/:id', cors(), cartController.delete)

router.post('/cart/changeQty/:id', cors(), cartController.changeQty)

router.get('/addToCart/:id', cartController.addToCart)




module.exports = router