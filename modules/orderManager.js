var webClient = require('request');
var OrderManager = function() {
    console.log("OrderManager : Creating Order Manager");

    this.omHash = {};
    this.omCount = 0;
    this.pendingOrders = [];
}

OrderManager.prototype.WEB_SERVER = "http://192.168.0.103:3001";

OrderManager.prototype.registerModule = function(om) {
    var deviceNo = (this.omCount++);
    console.log("OrderManager : registering OM with number" + deviceNo);
    this.omHash[om]=deviceNo;
}

OrderManager.prototype.placeOrder = function(om) {
    if(this.pendingOrders.indexOf(this.omHash[om]) !== -1)
    {
        console.log('OrderManager : An order is already pending to be submitted for OM : '+this.omHash[om]);
    }
    else
    {
        this.pendingOrders.push(this.omHash[om]);
        console.log('OrderManager : Recieved Order from OM : '+this.omHash[om]);
    }

}

OrderManager.prototype.flushOrderToServer = function() {

    if(this.pendingOrders.length===0)
    {
        console.log("OrderManager : Nothing to flush");
        return;
    }

    var url = this.WEB_SERVER + "/devices/1/orders"


    var formData = {device_button_ids : []};
    for (index in this.pendingOrders)
    {
        formData['device_button_ids'].push(''+this.pendingOrders[index]);

    }

    webClient.post({url:url, body: formData, json: true}, function(err,httpResponse,body){
        if(!err && httpResponse.statusCode===200)
        {
            console.log("OrderManager : Flushed "+this.pendingOrders.length+" orders");
            this.pendingOrders.length = 0;
        }
        else
        {
            console.log("OrderManager : Failed to flush orders "+err);
        }
    }) ;
}

module.exports = new OrderManager();