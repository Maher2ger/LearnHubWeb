const LocalStrategy = require('passport-local').Strategy;     //instance for a user authentication mechanism
const bcrypt = require('bcrypt');                               //to decrypt the password for comparing wie the database
const User = require('../models/user');                        //for database-related operations

let myStrategy = new LocalStrategy(
    {usernameField: 'email'},                //
    (email,password,done) => {
    //match user
    User.findOne(
        {email: email}                    //find the email adresse in the database
        )
        .then((user) => {
            if(!user) {
                return done(null,false,{message: email +' is not registered'})   //if not found, throw this error
            }
            //match pass
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if (err) throw err;
                if (isMatch) {
                    return done(null,user)
                } else {
                    return done(null,false,{message: 'password incorrect!'})
                }
            })
        })        //
        .catch(err => console.log(err))
});


module.exports = function(passport) {
    passport.use(myStrategy);                  //configure the passport instance
    //in order to support login sessions, passport will use the serialize and deserialize methods on the user instances to
    // and from the session
    passport.serializeUser(function(user,done) {
        done(null,user.id)
    })

    passport.deserializeUser(function(id,done){
        User.findById(id,(err,user)=>{
            done(err,user);
        })
    })
}


