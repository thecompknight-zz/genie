var PIUtils = require('./mockpiutils');
var OrderManager = require('./orderManager');
var webClient = require('request');
var config = require('./config');

var OrderingModule = function(rPin,gPin,bPin,buttonPin) {

    if (this.validPins.indexOf(rPin) === -1 ||
        this.validPins.indexOf(gPin) === -1 ||
        this.validPins.indexOf(bPin) === -1 ||
        this.validPins.indexOf(buttonPin) === -1 ||
        this.usedPins.indexOf(rPin) !== -1 ||
        this.usedPins.indexOf(gPin) !== -1 ||
        this.usedPins.indexOf(bPin) !== -1 ||
        this.usedPins.indexOf(buttonPin) !== -1
        )
    {
        console.log("One of pins cannot be used for IO. Bailing out!!!");
        this.functional=false;
        return;
    }
    this.functional=true;
    this.rPin = rPin;
    this.bPin = bPin;
    this.gPin = gPin;
    this.buttonPin = buttonPin;
    this.usedPins.push(rPin);
    this.usedPins.push(gPin);
    this.usedPins.push(bPin);
    this.usedPins.push(buttonPin);
    this.deviceId = OrderingModule.prototype.deviceId++;

    console.log("Creating Ordering module using PINS : "+rPin,gPin,bPin,buttonPin);

    this.rOut = PIUtils.setupForOutput(rPin);
    this.gOut = PIUtils.setupForOutput(gPin);
    this.bOut = PIUtils.setupForOutput(bPin);
    this.buttonIn = PIUtils.setupForInput(buttonPin);

    OrderManager.registerModule(this);

    var that = this;
    this.placeOrder = function(err,value) {
        if(value===1)
        {
            OrderManager.placeOrder(that);
            that.setStatus(that.LOCALLY_QUEUED);
        }
    }

    PIUtils.watch(this.buttonIn,  this.placeOrder);

    setInterval(OrderingModule.prototype.getStatus.bind(this),config.OM_STATUS_POLL_INTERVAL);
}

OrderingModule.prototype.deviceId = 1;

OrderingModule.prototype.getStatus = function() {
    var url = config.WEB_SERVER + "/devices/1/device_buttons/"+this.deviceId;
    console.log("Checking OM "+this.deviceId+" status");
    var that = this;
    webClient.get({url:url, timeout: config.WEB_SERVER_TIMEOUT}, function(err,httpResponse,body){
        if(!err && httpResponse.statusCode===200)
        {
            var body = JSON.parse(body);
            console.log("Setting status of om : "+that.deviceId+" as "+body["status"]);
            that.setStatus(body['status']);
        }
        else
        {
            console.log("Failed to retrieve status of om : "+that.deviceId+" "+err);
        }
    }) ;
}

OrderingModule.prototype.setStatus = function(status) {
    switch(status) {
        case this.LOCALLY_QUEUED:
            this.glowWhite();
            break;
        case this.GETTING_READY:
            this.glowGreen();
            break;
        case this.SHIPPED:
            this.glowOrange();
            break;
        default:
            this.glowBlack();
            break;
    }

}


OrderingModule.prototype.LOCALLY_QUEUED = 'locally_queued';
OrderingModule.prototype.GETTING_READY = 'getting_ready';
OrderingModule.prototype.SHIPPED = 'shipped';
OrderingModule.prototype.RECIEVED = 'recieved';

OrderingModule.prototype.glowWhite = function() {
    PIUtils.sendSignal(this.rOut,0);
    PIUtils.sendSignal(this.gOut,0);
    PIUtils.sendSignal(this.bOut,0);
}

OrderingModule.prototype.glowGreen = function() {
    PIUtils.sendSignal(this.rOut,1);
    PIUtils.sendSignal(this.gOut,0);
    PIUtils.sendSignal(this.bOut,1);
}

OrderingModule.prototype.glowOrange = function() {
    PIUtils.sendSignal(this.rOut,0);
    PIUtils.sendSignal(this.gOut,1);
    PIUtils.sendSignal(this.bOut,0);
}

OrderingModule.prototype.glowBlack = function() {
    PIUtils.sendSignal(this.rOut,1);
    PIUtils.sendSignal(this.gOut,1);
    PIUtils.sendSignal(this.bOut,1);
}

//21 is used for status now
//40 is used for status as of now
OrderingModule.prototype.validPins = [
      2,3,4,14,15,17,18,27,22,23,24,10,9, 25,11,8, 7, 5, 6, 12,13,19,16,26,20,21
    //3,5,7,8, 10,11,12,13,15,16,18,19,21,22,23,24,26,29,31,32,33,35,36,37,38,40
];

OrderingModule.prototype.usedPins = [];

OrderingModule.prototype.printPins = function() {
    console.log("Pins Used : "+this.rPin+" "+this.gPin+" "+this.bPin+" "+this.buttonPin);
}

OrderingModule.prototype.tearDown = function() {
    console.log("Tearing down OrderingModule");

    if(!this.functional)
        return;
    this.rOut.tearDown();
    this.gOut.tearDown();
    this.bOut.tearDown();
    this.buttonIn.tearDown();
}


module.exports = OrderingModule