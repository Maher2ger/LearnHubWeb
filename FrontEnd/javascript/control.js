//this file controls the behavior of the webpage elements

//get senosrs informations
refreshButton.addEventListener("click", ()=> {
    console.log("getSensorsInfos emitted from Browser to controlpanel");
    socket.emit("getSensorsInfos_request",{"id":socket.id});
});




startRecordingButton.addEventListener('click', async () => {
        await socket.once('ControlPanelConnected',(data)=>{
            if (data) {
                console.log('Client: Start recording sent to controlpanel')
                let check = getSensorsListToRecord();   //get the list of checked sensors
                let allSensorsActivated = true;
                for (let sensor of sensorsList) {
                    if (!sensor.getState()) {
                        allSensorsActivated = false;
                    }
                }
                if (check) {
                    socket.emit('start-recording',{
                        value: check
                    });
                    start();    //start timer
                    recordingRunning.hidden= false;
                    startRecordingButton.hidden=true;
                    stopRecordingButton.hidden=false;
                    stopwatch.hidden=false;
                }}else{
                alert('ControlPanel disconnected!');
                socket.emit("getSensorsInfos_request",{"id":socket.id});
            }
        });
        socket.emit('checkControlPanelConnected');
});


stopRecordingButton.addEventListener('click', () => {
    socket.emit('stop-recording');
    reset();     //reset the timer
    recordingRunning.hidden=true;
    startRecordingButton.hidden=false;
    stopRecordingButton.hidden=true;
});
