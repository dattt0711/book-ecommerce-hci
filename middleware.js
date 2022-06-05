module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login')
    }
    next();
}

module.exports.isAdmin = (req,res,next) =>{
    if(!req.user){
        return res.redirect('/login');
    }
    else{
        if(req.user.role != 'ADMIN') return res.send('You dont have permission');
        next();
    }
}

module.exports.canAccessOrder = (req,res,next) =>{
    if(!req.user){
        return res.redirect('/login');
    }
    else{
        if(req.user.role != 'ADMIN' && req.user.role != 'SALE' ) 
        return res.send('You dont have permission');
        next();
    }
}