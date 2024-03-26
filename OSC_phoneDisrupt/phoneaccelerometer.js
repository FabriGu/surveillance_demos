var osc = require('osc');
var beep = require('beepbeep');

var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

const ipAddressess = getIPAddresses();

var udpPort = new osc.UDPPort({
    localAddress: ipAddressess[0],
    localPort: 8000
}); 

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();

    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
});

udpPort.on("message", function (oscMessage) {
    // console.log(oscMessage);
    // console.log(oscMessage.args[1]);
    if(oscMessage.args[1]< -0.1){
      beep();
      console.log('put your phone down what are you doing');
    }
});

udpPort.on("error", function (err) {
    console.log(err);
});

udpPort.open();
