from interface import *
import socketio

# initializes Socket object
sio = socketio.Client()


@sio.on('getSensorsInfos_request')
def getSensorsInfos():
    print('Contolpanel: getSensorsInfos_request got')
    sensorsList = []
    for sensor in app.sensorslist:
        sensorsList.append({
            'id': str(sensor.id),
            'name': sensor.name,
            'type': sensor.type,
            'active': sensor.getState()
        })
    print('response-from-control-panel sent')
    return sio.emit('getSensorsInfos_response', sensorsList)


@sio.event
def connect():
    print('connection established: ' + sio.eio.sid)
    sio.emit('controlPanel_login', {'id': sio.eio.sid})


@sio.event
def disconnect():
    print('disconnected from server')
    sio.emit('controlPanel_logout', {'id': sio.eio.sid})


@sio.on('start-recording')
def startRecording(data):
    print('start-recording recived from server')
    app.startRecordingSelectedSensors(data['value'])


@sio.on('stop-recording')
def stopRecording(data):
    print('stop-recording recived from server')
    app.stopRecordingAllSensors()

#make connection with host
sio.connect('http://localhost:5500')

root = tk.Tk()
root.geometry('600x400+10+20')
root.title("myApp")
app = Application(master=root)

app.mainloop()
