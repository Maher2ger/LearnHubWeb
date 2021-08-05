import tkinter as tk
import itertools

#sensor class
def update():
    pass

class Sensor(tk.Frame):
    """
    creates Sensors objects
    """
    #iterativ function to generate unique IDs
    newId = itertools.count()
    isOn = False
    def __init__(self,name, type,master=None):
        super().__init__(master)
        self.id = next(self.newId)
        #TkInter Window
        self.master = master
        #the name of sensor
        self.name = name
        self.type = type
        self.isActiv = False
        self.createSensor()

    def createSensor(self):
        """
        creates the sensors interface
        :return:
        """
        self.sensorFrame = tk.LabelFrame(self, text=self.name, bg="white", height=50, width=200)
        self.sensorFrame.pack(side="left", fill="both", expand="yes")
        tk.Label(self.sensorFrame, text=self.type, fg="brown").pack()
        self.canvas = tk.Canvas(master=self.sensorFrame, width="100", heigh="100",bg="white")
        self.canvas.pack(side="top")
        self.light = self.createCircle(self.canvas, "gray")
        tk.Button(self.sensorFrame, text="ON/OFF", command=lambda: self.switch()).pack(side="bottom")
        tk.Button(self.sensorFrame, text="de/activate", command=lambda: self.activateOrDeactivate()).pack(side="bottom")

    def createCircle(self,canvas,color):
        """created the sensors lamp (red, green, or gray), depands on the sensors state"""
        return canvas.create_oval("30", "30", "70", "70", fill=color)

    def turnOff(self):
        """turns the sensors off"""
        if self.isActiv:
            self.isOn = False
            self.light = self.createCircle(self.canvas, "red")
            update()
        else:
            return("sensor "+ str(self.id)+ "ist deactivated, activate it to turn it off")

    def turnOn(self):
        """turns the sensors on"""
        if self.isActiv:
            self.isOn = True
            self.light = self.createCircle(self.canvas, "green")
            update()
        else:
            return("sensor "+ str(self.id)+ "ist deactivated, activate it to turn it on")

    def deactivate(self):
        """deactivates the sensor, so it cannot be turned on or off until the sensor is activated again"""
        self.isOn = False
        self.isActiv = False
        self.light = self.createCircle(self.canvas, "gray")
        update()

    def activate(self):
        """activates the sensor, so it can be turned on or off"""
        self.isOn = False
        self.isActiv = True
        self.light = self.createCircle(self.canvas, "red")
        update()

    def switch(self):
        """turns the sensor on or off"""
        if self.isOn:
            self.turnOff()
            update()
        else:
            self.turnOn()
            update()

    def activateOrDeactivate(self):
        """deactivates the sensor if it is active, or activates the sensor if it is not active """
        if self.isActiv:
            self.deactivate()
            update()
        else:
            self.activate()
            update()

    def getState(self):
        """:return the state of the sensor"""
        return self.isActiv



############################
class Application(tk.Frame):
    """this class creates the whole control panel"""
    #all sensors would be stored in this list
    sensorslist = []
    def __init__(self, master= None):
        super().__init__(master)
        self.master = master
        self.pack(fill='both', expand=True ,side="bottom")
        self.sensors_frame = tk.Frame(self,bg="blue", bd="2")
        self.control_frame = tk.LabelFrame(self, text="control buttons",bg="green", bd="2")
        self.create_widgets()
        #adding some sensors to the sensorslist
        self.addNewSensor(Sensor('Sensor1', 'Alpha 290', master=self.sensors_frame))
        self.addNewSensor(Sensor('Sensor2', 'Taliba 480', master=self.sensors_frame))
        self.addNewSensor(Sensor('Sensor3', 'Toshina 3353', master=self.sensors_frame))

    def create_widgets(self):
        """creates the interface elements"""
        self.sensors_frame.pack()
        self.control_frame.pack()
        tk.Button(self.control_frame,
                  text="activate all Sensors",
                  command= lambda: self.activeAllSensors()).pack(side="bottom")
        tk.Button(self.control_frame,
                  text="add new sensor",
                  command= lambda: self.createNewSensor()).pack(side="bottom")
        self.quit = tk.Button(self, text="Quit", fg='red', command=self.master.destroy)
        self.quit.pack()

    def createNewSensor(self):
        """creates new sensor of the class sensor"""
        new_frame = tk.Toplevel(self.master)
        sensor_name_label = tk.Label(new_frame, text="Enter the sensor name: ").pack()
        sensor_name = tk.Entry(new_frame)
        sensor_name.pack()
        sensor_type_label = tk.Label(new_frame, text="Enter the sensor type: ").pack()
        sensor_type = tk.Entry(new_frame)
        sensor_type.pack()
        tk.Button(new_frame,
                  text="add new sensor",
                  command= lambda:[self.addNewSensor(Sensor(sensor_name.get(),
                                                            sensor_type.get(),
                                                            master=self.sensors_frame)),new_frame.destroy()]).pack(side="bottom")


    def addNewSensor(self, sensor):
        """adds the new created list to the sensorslist"""
        self.sensorslist.append(sensor)
        self.updateSensorsFrame()

    def updateSensorsFrame(self):
        """updates the app interface"""
        for sensor in self.sensorslist:
            sensor.pack(side='left')


    def removeSensor(self, sensor):
        """removes the sensor from the sensorslist"""
        self.sensorslist.remove(sensor)
        self.create_widgets()


    def activeAllSensors(self):
        for sensor in self.sensorslist:
            sensor.activate()
        self.updateSensorsFrame()

    def deactiveAllSensors(self):
        for sensor in self.sensorslist:
            sensor.turnOff()
        self.updateSensorsFrame()


    def numberOfSensors(self):
        """:return the number of sensors we have"""
        return len(self.sensorslist)

    def startRecordingSelectedSensors(self,sensors):
        for sensorId in sensors:
            self.findSensorUsingId(sensorId).turnOn()

    def findSensorUsingId(self, sensorId):
        for sensor in self.sensorslist:
            if sensor.id == int(sensorId):
                return sensor


    def stopRecordingAllSensors(self):
        for sensor in self.sensorslist:
            sensor.turnOff()

