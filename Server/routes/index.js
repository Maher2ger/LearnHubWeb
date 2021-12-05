const express = require('express');       //for handling the routes
const router = express.Router();          //to manage Routes

//login page
router.get('/', (req, res) =>{
    res.render('index')             //render the page index.ejs
})

//register page
router.get('/register', (req, res) =>{
    res.render('register')          //render the page register.ejs
})


module.exports = router;
