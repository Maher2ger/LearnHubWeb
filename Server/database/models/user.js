// here we definde a schema for creating users und save them to the database or calling them from the db

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    role:{
        type: String,
        required:false
    },

    date:{
        type: Date,
        default: Date.now
    }
});

const User= mongoose.model('User',UserSchema);    //uses the Schema "UserSchema" in the User Model

module.exports = User;    //we export our User model 'User'. this model will have a name, password, email, ..
