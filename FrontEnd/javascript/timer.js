//timer file

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

// Declare variables to use in our functions below

let startTime;
let endTime;
let elapsedTime = 0;
let timerInterval;
let lastId=0;

// Create function to modify innerHTML

function print(txt) {
    document.getElementById("display").innerHTML = txt;
}

// Create "start", "pause" and "reset" functions

function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        print(timeToString(elapsedTime));
    }, 10);
}



function reset() {
    endTime = Date.now();
    clearInterval(timerInterval);
    print("00:00:00");
    elapsedTime = 0;
    let recording = new Recording("recording "+(++lastId),endTime-startTime,startTime,endTime,getSensorsListToRecord());
    let codeBlock = `<div class="recording-entry">
            <table>
                <tr>
                    <th class="cat">name: </th>
                    <th>${recording.name}</th>
                </tr>
                <tr>
                    <td class="cat">duration:</td>
                    <td>${recording.duration} millisec</td>
                </tr>
                <tr>
                    <td class="cat">startime:</td>
                    <td>${convertTimestamp(recording.startTime)}</td>
                </tr>
                <tr>
                    <td class="cat">Endtime:</td>
                    <td>${convertTimestamp(recording.endTime)}</td>
                </tr>
                <tr>
                    <td class="cat">Sensors:   </td>
                    <td>${recording.activeSensors}</td>
                </tr>
            </table>
            </div>`
    recordingsDiv.innerHTML += codeBlock;
}


function convertTimestamp(Timestamp) {
    let date = new Date(Timestamp);
    let result = date.getDate()+
        "/"+(date.getMonth()+1)+
        "/"+date.getFullYear()+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds();
    return result;

}
