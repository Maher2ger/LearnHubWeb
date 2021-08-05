//the sensors recieved from the controlpanel would be stored in sensorsList as sensor objects
const sensorsList = [];

//shortcuts functions
function getPerId(id){
    return document.getElementById(id);
}

function updateSensorsList(data) {
    for (let sensor of data) {
        sensorsList.push(new Sensor(sensor.id, sensor.name, sensor.type, sensor.active));
    }
}

//this function recives the Sensors Information from sensorsList und renders them in the HTML Page
function updateSensors(){
    sensorsDiv.innerHTML = "";
    if (sensorsList.length == 0) {
        console.log('No sensors found');
        getPerId('sensors-div').innerHTML = 'no sensors detected, refresh to detect sensors';
    } else {
    for (let sensor of sensorsList) {
        if (!sensor.state) {
            hidden = true;
            let codeBlock = `<div class="Sensor deavtivated" id="${sensor.id}">
                <table>
                    <tr>
                        <th class="cat">id: </th>
                        <th>${sensor.id}</th>
                    </tr>
                    <tr>
                        <td class="cat">name:</td>
                        <td>${sensor.name}</td>
                    </tr>
                    <tr>
                        <td class="cat">type:</td>
                        <td>${sensor.type}</td>
                    </tr>
                    <tr>    
                        <td class="cat"></td>
                        <td> <b>deavtivated</b> </td>
                    </tr>
                   </table>

                </div>`
            sensorsDiv.innerHTML += codeBlock;

        } else {
            let codeBlock = `<div class="Sensor" id="${sensor.id}">
                <table>
                    <tr>
                        <th class="cat">id: </th>
                        <th>${sensor.id}</th>
                    </tr>
                    <tr>
                        <td class="cat">name:</td>
                        <td>${sensor.name}</td>
                    </tr>
                    <tr>
                        <td class="cat">type:</td>
                        <td>${sensor.type}</td>
                    </tr>
                    <tr>    
                        <td class="cat"></td>
                        <td><input id=${"checked"+sensor.id} class="input1" type="checkbox" name="s2"><label for="s2">record</label></td>
                    </tr>
                   </table>

                </div>`
        sensorsDiv.innerHTML += codeBlock;}
}}}



//checkes, which Sensors are checked to record from
function getSensorsListToRecord() {
    let activatedSensors = [];
    for (let sensor of sensorsList) {
        if (sensor.state) {
        if (getPerId("checked"+sensor.id).checked == true) {
            activatedSensors.push(sensor.id);
        }}
    }
    if (activatedSensors.length == 0) {
        return alert("please select sensors to record from");
    }
    return activatedSensors;
}


