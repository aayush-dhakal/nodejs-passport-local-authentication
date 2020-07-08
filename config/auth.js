module.exports = {
    ensureAuthenticated: function(req, res, next){
        // this isAuthenticated method is provided by passport
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', 'please login to view this resource')
        res.redirect('/users/login')
    }
}