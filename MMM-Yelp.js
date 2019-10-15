/* Magic Mirror
 * Module: MMM-Yelp
 *
 * By lilpkstud
 * MIT Licensed.
 */

Module.register("MMM-Yelp", {
	defaults: {
		updateInterval: 600000,
		retryDelay: 50000,
		apiKey: '',
        term: 'Four Barrel Coffee',
        location: "San Francisco, CA",
		debug: true, //Set to true to enable extending logging 
    },
	    
    yelpData: [],

    //loading:true,

    start: function() {
        Log.info("STARTING " + this.name);
		var self = this;
		var dataRequest = null;
		var data = null;

		//Flag for check if module is loaded
		//this.loaded = false;

       

        //Ensure config options are arrays
		this.config.apiKey = this.toArray(this.config.apiKey);
		
        console.log(this.name + " Sending Socket Notification as MMM-Yelp_Config" + JSON.stringify(this.config));
        this.sendSocketNotification("CONFIG", this.config);

		// Schedule update timer.
		//this.scheduleUpdate(2000);
    },



    getDom: function() {
        var self = this;
        var wrapper = document.createElement("div");
        //If this.dataRequest is not empty
        if(this.data && this.data.length > 0){
            console.log("MMM-Test: DOM I FUCKING MADE IT!!!" + this.data[3]);
            //Image
            var imgDataRequest = document.createElement("IMG");
            //imgDataRequest.src = 

            //Name of Business
            var wrapperDataRequest = document.createElement("h1");
            wrapperDataRequest.innerHTML = this.data[0];
            wrapperDataRequest.className = 'yelpBusinessName';

            wrapper.appendChild(imgDataRequest);
            wrapper.appendChild(wrapperDataRequest);
        } else {
            console.log("MMM-Test: this.data couldn't be found");
            wrapper.innerHTML = "This didn't work";
        }
        
        return wrapper;
	},
    
    //Receiving notifications from other modules or from the system
    notificationReceived: function(notification, payload, sender){
        if (sender) {
            Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
        } else {
            Log.log(this.name + " received a system notification: " + notification);
        }
    },

    //Receiving notification from Node_helper
    socketNotificationReceived: function(notification, payload){
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        if(notification === "MMM-Test_Data_Received") {
            this.data = payload;
            console.log("MMM-Test:  Data_Received " + this.data);
            this.updateDom();
        }
        //Messages to display in console from node_helper and other backend processes
        if(notification === "MMM-Test_Console_Output"){
            console.log("MMM-Test Output: " + payload);
            Log.log("MMM-Test Output: " + payload);
            this.log("MMM-Test Output: " + payload);
        }

    },

    /**
     * 
     */
    toArray: function(_string) {
        if(Array.isArray(_string)){
            return _string;
        } 
        if(typeof _string == "string") {
            return _string.split("'");
        }
        return [];
    },

    /**
     * Log
     * this method logs the message, prefixed by the Module name,
     */
    log: function(_msg){
        if(this.config && this.config.debug){
            Log.info(this.name + ': ' + JSON.stringify(_msg));
        }
    }
});