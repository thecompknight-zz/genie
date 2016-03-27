var OrderManager = function() {
    console.log("Creating Order Manager");

    this.omHash = {};
    this.omCount = 0;
    this.pendingOrders = [];
}

OrderManager.prototype.registerModule = function(om) {
    var deviceNo = (this.omCount++);
    console.log("registering OM with number" + deviceNo);
    this.omHash[om]=deviceNo;
}

OrderManager.prototype.placeOrder = function(om) {
    if(this.pendingOrders.indexOf(this.omHash[om]) !== -1)
    {
        console.log('An order is already pending to be submitted for OM : '+this.omHash[om]);
    }
    else
    {
        this.pendingOrders.push(this.omHash[om]);
        console.log('Recieved Order from OM : '+this.omHash[om]);
    }

}

module.exports = new OrderManager();