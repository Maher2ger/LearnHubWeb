if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const socket = require('socket.io');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const authController = require("./controllers/auth.controllers")
const User = require('./dbModels/user.model');



app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views-engine','ejs');
app.use(express.urlencoded({extended: false}));

/*
app.get('/',(req, res) => {
    res.sendFile(path.resolve(__dirname+'../../FrontEnd/main.html'));
});
 */


const db = require("./dbModels");
const Role = db.role;

const dbUri = "mongodb+srv://maher2:ababab@cluster0.rtgkm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

db.mongoose
    .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


var corsOptions = {
    origin: "http://localhost:5500"
};


// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.get('/checkCP',(req, res) => {
    if (controlPanelId) {
        console.log(200);
        res.json('true');
    } else {
        console.log(404);
        res.json('false');
    }

});

app.get('/login',(req, res) => {
    res.render('login.ejs');
});
app.get('/register', (req, res) => {
    res.render('register.ejs');
});

/*
app.post('/login',checkNotAuthenticated ,passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/login', authController.login);


app.post('/register',authController.register);


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});
*/
// Static files
app.use(express.static('public'));  //public contains all media data
app.use(express.static(__dirname + '/../FrontEnd'));



const port = 5550;
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


