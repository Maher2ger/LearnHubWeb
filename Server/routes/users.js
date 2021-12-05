const express = require('express');
const router = express.Router();
const User = require('../database/models/user.js');
const bcrypt = require('bcrypt');
const passport =  require('passport')

//login handling
router.get('/login', (req, res) => {
    res.render('login.ejs');
})

router.get('/register', (req, res) => {
    res.render('register.ejs');
})

//register handling
router.post('/login', (req, res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',    //if the user successfully logged in, redirect to dashboard page
        failureRedirect: '/users/login',  //if the user does not logged in successfully, redirect to login page
        failureFlash:true,                 //get flash messages when an error occurs
    }) (req, res, next)
})

router.post('/register',(req, res) => {
    const {name, email, password} = req.body;   //assign values to these variables from the request body
    let errors = [];
    console.log(name, email ,password);

    //check if all fields are given
    if (!name || !email || !password) {
        errors.push({msg: "some field are not filled"});
    }

    //check, if the password too short
    if(password.length < 8) {
        errors.push({msg: 'the Password is too short, it has to be al least 8 characters'})
    }

    if(errors.length > 0){   //if any content in errors Array, rerender register.ejs und display these errors
        res.render('register.ejs', {
            errors: errors,
            name: name,
            email: email,
            password: password
        });
    } else {
        //validation passed
        User.findOne({email: email}).exec((err,user)=> {
            console.log(user);
            if(user) {
                console.log(11);
                errors.push({msg: 'this email adresse is already used'});
                res.render('register.ejs', {
                    errors: errors,
                    name: name,
                    email: email,
                    password: password
                });
            }else{
                const signup = async () => {
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: hashedPassword
                    })

                    newUser.save()                                      //save the new user in the database
                        .then((value)=> {
                            console.log(value);
                            req.flash('success_msg', 'you are registered now!');    //implementing success flash message
                            res.redirect('/users/login')          //redirect to login page
                        })
                        .catch((value)=> console.log(value))

                }
                signup();
                }




        })
    }
})


//logout
router.get('/logout', (req, res) =>{
    req.logout();                      //this function will be created by passport, it logs out the user session
    req.flash('success_msg','You logged out');
    res.redirect('/users/login')
})
module.exports = router;
