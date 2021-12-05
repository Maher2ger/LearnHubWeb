const express = require('express');       //for handling the routes
const router = express.Router();          //to manage Routes
const {ensureAuthenticated} = require('../database/config/auth')

//login page
router.get('/', (req, res) =>{
    res.render('index.ejs')             //render the page index.ejs
})

//register page
router.get('/register', (req, res) =>{
    res.render('register.ejs')          //render the page register.ejs
})

// dashboard page
router.get('/dashboard',ensureAuthenticated , (req, res) =>{
    res.render(
        'dashboard.ejs',
        {user: req.user}            //send the user information to the web page
        );
})



module.exports = router;
