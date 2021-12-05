module.exports = {
    ensureAuthenticated: (req, res, next) => { //ensure that the user is logged in
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'please login first to reach the dashboard');
        res.redirect('/users/login');
    }
}
