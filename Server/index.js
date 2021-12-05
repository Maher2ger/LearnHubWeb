const express = require('express');       //for handling the routes
const router = express.Router();
//const socket = require('socket.io');       //to create Socket on Server side
const path = require('path');
const mongoose = require('mongoose');     //to connect to MongoDB
const expressEjsLayout = require('express-ejs-layouts');  // Layout support for ejs pages in Express
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


// App setup
const app = express();
const port = 5550;

//EJS
//app.set('views-engine','ejs');    //tells Express that you will be using EJS as template engine
//app.use(expressEjsLayout);

//loading passport
require('./database/config/passport')(passport);

// connect to MongoDB
const dbUri = "mongodb+srv://maher2:ababab@cluster0.rtgkm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
    .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log('Successfully connected to MongoDB');
    })
    .catch((err)=> console.log(err))



//Body Parser
app.use(express.urlencoded({extended:false}))

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error =req.flash('error');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



///////////////////////////////////////////




const server = app.listen(port, function(){
    console.log(`listening for requests on port ${port}`);
});




















///////////////old////////////////
/*
app.get('/',(req, res) => {
    res.render('index.ejs');
});

app.get('/login',(req, res) => {
    res.render('login.ejs');
});

app.get('/register',(req, res) => {
    res.render('register.ejs');
})

// Static files
app.use(express.static('public'));  //public contains all media data
app.use(express.static(__dirname + '/../FrontEnd'));




app.get('/',(req, res)=> {
    res.sendFile(path.resolve(__dirname+'/../FrontEnd/main.html'));})


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


*/
