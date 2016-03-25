var OrderingModule = function(rPin,gPin,bPin,buttonPin) {

    if (this.validPins.indexOf(rPin) === -1 ||
        this.validPins.indexOf(gPin) === -1 ||
        this.validPins.indexOf(bPin) === -1 ||
        this.validPins.indexOf(buttonPin) === -1 )
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
}

OrderingModule.prototype.validPins = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,29,31,32,33,35,36,37,38,40];

OrderingModule.prototype.printPins = function() {
    console.log("Pins Used : "+this.rPin+" "+this.gPin+" "+this.bPin+" "+this.buttonPin);
}

module.exports = OrderingModule