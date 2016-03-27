
var OutputObject = function(pin) {
    this.pin=pin;
    this.tearDown =  function(){
        console.log("PIN : "+this.pin+" Tearing down");
    }
};

var InputObject = function(pin) {
    this.pin=pin;
    this.tearDown =  function(){
        console.log("PIN : "+this.pin+" Tearing down");
    }
};

var PIUtils = {
    sendSignal : function(pin, value) {
        console.log("PIN : " + pin+" Sending signal : "+value);
    },

    watch : function(pin, callback) {
        console.log("PIN : "+pin+" Adding watcher");
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