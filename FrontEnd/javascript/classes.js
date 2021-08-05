class Recording {
    constructor(name, duration, startTime, endTime, activeSensors) {
        this.name = name;
        this.duration = duration;
        this.startTime = startTime
        this.endTime = endTime;
        this.activeSensors = activeSensors;
    }

    getName() { return name; }
}

class Sensor {
    constructor(id, name,type,state) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.type = type;
    }
    getName() {return this.name; }
    getId() {return this.id;}
    getState() {return this.active}
    getType() {return this.type}
}

