# Phone Disruptor

The accelerometer on your phone is one of the most powerful biometric sensors that you interact with on a day-to-day basis. Based on looking at patterns of accelerometer data you can know if the phone is being used, how it is being held, how many steps the phone owner has taken, if they have an even gait, etc. It's possible based on [accelerometer data alone to identify individuals](https://www.mdpi.com/2071-1050/15/13/10456) based on their walking patterns. If you hand your phone off to your friend for a day anyone looking at the accelerometer data would be able to tell that someone different had the phone that day.

Any app can collect accelerometer data without permission, but as an individual user it's hard to access these data without making your own app. Which we aren't going to do obviously. Instead, this demo makes use of the [Touch OSC](https://hexler.net/touchosc) phone application. For non-music applications like this one I recommend the Touch OSC Mk1 version, as it is significantly cheaper ($5) and still gives streaming accelerometer data. Touch OSC was made to turn the phone screen into a programmable piece of music hardware, and includes the ability to send accelerometer data so that you can make music by moving your phone.

OSC (Open Sound Control) is a protocol mostly used by music devices to stream data over the network.

### Running the local script
The main script is phoneaccelerometer.js. This watches for incoming osc data and it runs via node.js. But it requires some outside packages, namely the OSC package and its dependencies. You can see the packages needed in `package.json` and install them by running `npm install` while inside the directory. `npm` is the "node package manager" and should come along with node when you installed it. `npm install` will look in `package.json` and install all the necessary packages in a new folder called `node_modules`. 

Now run `node phoneaccelerometer.js` and it should start running. It will give you a helpful message tellling you your local IP address which you can use to set up Touch OSC.


### Setting up Touch OSC
In the main Touch OSC Mk1 interface there are two things we need to do. 

* Select _Options_ and then toggle on the Accelerometer (/accxyz) tab.
* Under CONNECTIONS, select OSC: XXX.XXX.XXX.XXX. Make sure that it is enabled, and change the host to the IP address that `phoneaccelerometer.js` gave you when you ran it. The outgoing port should be the same as `phoneaccelerometer.js`'s, which should be 8000. 

Now that you've set that up, you can select `Done` in the top right. You should be sent to a bunch of sliders, but that isn't important. You accelerometer data should now be streaming to your computer and getting printed to the terminal by `phoneaccelerometer.js`. You can now edit `phoneaccelerometer.js` to do anything you can think of using this stream of data. A very basic example is already provided, which runs whenever the phone is picked up.

### Troubleshooting
Most issues are due to networking problems. Double check that your host address is the same between your computer and Touch OSC. Make sure you aren't running a VPN or anything else that might interfere with your ability to communicate via your own local network. This also doesn't run on NYU's wifi as they firewall much of the network. Marlon at the ER might be able to set you up with a static address in the NYU network if you want to run this at school, but that will require some additional networking work on your side that is beyond the scope of this class.
