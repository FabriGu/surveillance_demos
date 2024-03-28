var osc = require('osc');

// function for getting IP address on the local network
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

const ipAddresses = getIPAddresses();

// OSC needs to be sent via a UDP port so we set one up
var udpPort = new osc.UDPPort({
    // this takes just the first IP address in case your router is giving your laptop more than one 
    localAddress: ipAddresses[0],
    localPort: 8000
}); 

udpPort.on("ready", function () {

    console.log("Listening for OSC over UDP.");
    console.log("Host:", udpPort.options.localAddress + ", Port:", udpPort.options.localPort) 
    console.log("Put the host address - which is your local ip address - into Touch OSC") 
});

udpPort.on("message", function (oscMessage) {
    // prints out the accelerometer data 
    console.log(oscMessage);
    // sends a message whenever the phone is picked up 
    if(oscMessage.args[1]< -0.1){
      console.log('put your phone down');
    }
});

udpPort.on("error", function (err) {
    console.log(err);
});

udpPort.open();
