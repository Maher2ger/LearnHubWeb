const express = require('express');

const User = require('../dbModuls/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = (req ,res,next) => {
    bcrypt.hash(req.body.password,10, (err, hashedPass) => {
        if(err) {
            res.json({error: err});
        }

        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
        })
        user.save()
            .then(
                res.redirect('/login')
            )
            .catch(err => {res.json(err);console.log('success');})
    })};

const login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log(1);
    User.findOne({email: email})
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password,(err,result) => {
                    if (err) {
                        res.json(
                            {error:err}
                            )}
                    if (result){
                        console.log(user.name,' logged in successfully');
                        res.redirect('/');
                }else{
                            res.json({
                            message:'password is wrong!'
                        })}
                })}else{
                res.json("user not found");
            }}
                    )
}

module.exports = {register, login}




