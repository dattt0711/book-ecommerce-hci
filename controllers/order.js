const Order = require('../models/order');


module.exports.getAllOrders = async(req,res)=>{
    let orders = await Order.find({});
    res.render('admin/orders', {orders, page:'order'});
}

module.exports.newOrder = async(req,res)=>{
    let {user, total, bookCart} = req.body;
    let order = {
        fullName: user.username,
        phoneNumber: user.numberPhone,
        address: user.address,
        cart: bookCart,
        total
    }
    let newOrder = new Order(order);
    await newOrder.save();
}
module.exports.findOrderById = async(req,res)=>{
    let {id} = req.params;
    let order = await Order.findById(id);
    res.json(order);
}

module.exports.changeStatus = async(req,res)=>{
    let {id} = req.params;
    let updateOrder = await Order.findByIdAndUpdate(id,req.body);
}