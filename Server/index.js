if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const socket = require('socket.io');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const authController = require("./dbController/authController")
const User = require('./dbModuls/user');

const db = require("./db")
mongoose.connect(db.uri,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((result)=> console.log('connected with db')).catch((error)=> console.log(error));

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = [];

app.set('views-engine','ejs');
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())
app.use(flash());

var sessionOpts = {
    // Setting the key
    secret: 'a cool secret',
    // Forces the session to be saved back to the session store
    resave: true,
    // Forces a session that is "uninitialized" to be saved to the store.
    saveUninitialized: true,
    // Set the session cookie name by default to connect.sid
    key: 'myapp_sid',
    // If secure is set to true, and you access your site over HTTP, the cookie will not be set.
    cookie: { maxAge: 1000* 60*60 * 2, secure: false }}

app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


app.get('/',checkAuthenticated ,(req, res) => {
    res.sendFile(path.resolve(__dirname+'../../FrontEnd/main.html'));
});



app.get('/checkCP',(req, res) => {
    if (controlPanelId) {
        console.log(200);
        res.json('true');
    } else {
        console.log(404);
        res.json('false');
    }

});

app.get('/login',checkNotAuthenticated,(req, res) => {
    res.render('login.ejs');
});
/*
app.post('/login',checkNotAuthenticated ,passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
*/
app.post('/login',checkNotAuthenticated, authController.login);

app.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register',checkNotAuthenticated ,authController.register);


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// Static files
app.use(express.static('public'));  //public contains all media data
app.use(express.static(__dirname + '/../FrontEnd'));


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }else{
        next();
    }
}



const port = 5500;
const server = app.listen(port, function(){
    console.log(`listening for requests on port ${port}`);
});



// Socket setup & pass server
const io = socket(server);
let controlPanelId = false;

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    console.log('---------------------------');
    let userId = socket.id;

    socket.on('getSensorsInfos_request',(data)=>{
        if (controlPanelId != false) {
            console.log('Server: getSensorsInfos_request emitted to controlpanel');
            console.log('---------------------------');
            io.sockets.emit('getSensorsInfos_request');
        } else {
            io.sockets.emit('getSensorsInfos_response');
        }

    })

    socket.on('getSensorsInfos_response',(data)=>{
        console.log('Server: getSensorsInfos_responsex   emitted to client');
        console.log('---------------------------');

        io.sockets.emit('getSensorsInfos_response', data);
    })

    socket.on('checkControlPanelConnected', () => {
        console.log('checkControlPanelConnected recieved');
        setTimeout(function (){
            io.sockets.emit('ControlPanelConnected', controlPanelId);
        }, 1000);

    })

    socket.on('start-recording',(data)=>{
            console.log('Server: start-recording sent to cp');
            console.log('---------------------------');

        io.sockets.emit('start-recording', data);
        })

    socket.on('stop-recording',(data)=>{
        console.log('Server: stop-recording sent to cp');
        console.log('---------------------------');
        io.sockets.emit('stop-recording', data);
    })

    socket.on('connect', (socket)=>{
        console.log('Client connected:', userId);
    })

    socket.on('disconnect', (socket)=>{
        if (userId == controlPanelId) {
            controlPanelId = false;
            console.log('ControlPanel disconnected', userId);
            console.log('---------------------------');
        } else {
            console.log('Client disconnected: ', userId);
            console.log('---------------------------');}

    })



    socket.on('controlPanel_login', ()=>{
        controlPanelId = userId;
        console.log('controlPanelId:' + controlPanelId);
        console.log('---------------------------');

    })

    });


