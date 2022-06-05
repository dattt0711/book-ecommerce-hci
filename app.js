if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser') 
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const session = require('express-session')
const flash = require('connect-flash')
const {isLoggedIn} = require('./middleware')
const Cart = require('./models/cart')
const ObjectId = mongoose.Types.ObjectId;




const booksRoute = require('./routes/books')
const userRoute = require('./routes/user')
const adminRoute = require('./routes/admin')
const orderRoute = require('./routes/orders')
const cartRoute = require('./routes/cart')
mongoose.connect('mongodb://127.0.0.1:27017/book-shop');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{
    console.log('database connected');
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'));
const sessionConfig = {
    secret: 'notbettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expries: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.succes = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use((req,res,next)=>{
    if(!req.user)
    res.locals.currentProduct = 0;
    else{ 
        if(!req.session[req.user.username])  res.locals.currentProduct = 0;
        else res.locals.currentProduct = req.session[req.user.username].cart.length;
    }
    next();
})
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate);


app.get('/fake', async(req,res)=>{
    const user = new User({email:'test@gmail.com', numberPhone:'033412312', username:'colt'})
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/', userRoute)
app.use('/books', booksRoute);
app.use('/', adminRoute)
app.use('/orders', orderRoute);
app.use('/', cartRoute);


app.get('/', (req,res) => {
    res.render('home');
})

app.listen(3000, ()=>{
    console.log('listen on port 3000')
})