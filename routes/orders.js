const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, canAccessOrder} = require('../middleware');
const orderController = require('../controllers/order')
router.use(isLoggedIn, canAccessOrder, (req,res, next) => {
    next();
});

router.post('/', catchAsync(orderController.newOrder))

router.get('/', catchAsync(orderController.getAllOrders))

router.get('/:id', catchAsync(orderController.findOrderById))

router.post('/:id/changeStatus', catchAsync(orderController.changeStatus))

module.exports = router;