//connect to the socket from the client side
var port = 5550;
const socket = io.connect(`http://localhost:${port}`);

socket.on('getSensorsInfos_response', (data) => {
  /*  if (typeof(data) == 'undefined') {
        console.log('No sensors found');
        getPerId('sensors-div').innerHTML = 'no sensors detected, refresh to detect sensors';
    } else {
        updateSensors(data);
    } */
    sensorsList.splice(0,sensorsList.length);
    updateSensorsList(data);
    console.log(data);
    updateSensors();
});


