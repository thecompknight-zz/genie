var OrderManager = function() {
    console.log("Creating Order Manager");

    this.omHash = {};
    this.omCount = 0;
}

OrderManager.prototype.registerModule = function(om) {
    var deviceNo = (this.omCount++);
    console.log("registering OM with number" + deviceNo);
    this.omHash[om]=deviceNo;
}

OrderManager.prototype.placeOrder = function(om) {
    console.log('Recieved Order from OM : '+this.omHash[om]);
}

module.exports = new OrderManager();