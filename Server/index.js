const express = require('express');
const socket = require('socket.io');

// App setup
const app = express();
const port = 5500;
const server = app.listen(port, function(){
    console.log(`listening for requests on port ${port}`);
});
// Static files
app.use(express.static('public'));  //public contains all media data
app.use(express.static('/home/maher/WebstormProjects/LearnHubWeb/FrontEnd'));

app.get('/',(req, res)=> {
    res.sendFile("/home/maher/WebstormProjects/LearnHubWeb/FrontEnd/main.html");
})
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


