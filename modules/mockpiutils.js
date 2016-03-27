var GPIOObject = function() {

}

GPIOObject.prototype.tearDown = function() {
    console.log("PIN : "+this.pin+" Tearing down");
}

GPIOObject.prototype.watch = function(callback) {
    console.log("PIN : "+this.pin+" adding watcher");
}

var OutputObject = function(pin) {
    this.pin=pin;
};

OutputObject.prototype = new GPIOObject();

OutputObject.prototype.sendSignal = function(value) {
    console.log("PIN : " + this.pin+" Sending signal : "+value);
}


var InputObject = function(pin) {
    this.pin=pin;
};

InputObject.prototype = new GPIOObject();

var PIUtils = {
    sendSignal : function(outputObj, value) {
        outputObj.sendSignal(value);
    },

    watch : function(gpioObject, callback) {
        gpioObject.watch(callback);
    },

    setupForInput : function(pin) {
        console.log("PIN : "+ pin+" Setup for Input");
        return new InputObject(pin);
    },

    setupForOutput : function(pin) {
        console.log("PIN : "+ pin+" Setup for Output");
        return new OutputObject(pin);
    }
}



module.exports = PIUtils