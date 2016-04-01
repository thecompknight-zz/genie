var webClient = require('request');
var config = require('./config');
var OrderManager = function() {
    console.log("OrderManager : Creating Order Manager");

    this.omHash = {};
    this.openDeviceNo = 1;
    this.pendingOrders = [];
    setInterval(OrderManager.prototype.flushOrderToServer.bind(this),config.ORDER_FLUSH_INTERVAL);
}

OrderManager.prototype.registerModule = function(om) {
    console.log("OrderManager : registering OM with number " + om.deviceId);
    this.omHash[om.deviceId]=om.deviceId;
}

OrderManager.prototype.placeOrder = function(om) {
    if(this.pendingOrders.indexOf(this.omHash[om.deviceId]) !== -1)
    {
        console.log('OrderManager : An order is already pending to be submitted for OM : '+this.omHash[om.deviceId]);
    }
    else
    {
        this.pendingOrders.push(this.omHash[om.deviceId]);
        console.log('OrderManager : Recieved Order from OM : '+this.omHash[om.deviceId]);
    }

}

OrderManager.prototype.flushOrderToServer = function() {

    if(this.pendingOrders.length===0)
    {
        console.log("OrderManager : Nothing to flush");
        return;
    }

    var url = config.WEB_SERVER + "/devices/1/orders.json"


    var formData = {device_button_ids : []};
    for (index in this.pendingOrders)
    {
        formData['device_button_ids'].push(''+this.pendingOrders[index]);

    }

    var that = this;
    webClient.post({url:url, body: formData, json: true, timeout: config.WEB_SERVER_TIMEOUT}, function(err,httpResponse,body){
        if(!err && httpResponse.statusCode===200)
        {
            console.log("OrderManager : Flushed "+that.pendingOrders.length+" orders");
            that.pendingOrders.length = 0;
        }
        else
        {
            console.log("OrderManager : Failed to flush orders "+err);
        }
    }) ;
}

module.exports = new OrderManager();