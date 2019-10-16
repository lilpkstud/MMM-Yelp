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

        this.sendSocketNotification("CONFIG", this.config);
        
        this.getData();

		// Schedule update timer.
		//this.scheduleUpdate(2000);
    },

    /**
     * getData
     */
    getData: function() {
        this.sendSocketNotification("GET_DATA");
    },

    getDom: function() {
        var self = this;
        var yelp = this.cocktails;

        var wrapper = document.createElement("div");
        //If this.dataRequest is not empty
        /*if(this.data && this.data.length > 0){
            console.log("MMM-Test: This.data is set" + this.data);
            //Image
            var imgDataRequest = document.createElement("IMG");
            //imgDataRequest.src = 

            //Name of Business
            var wrapperDataRequest = document.createElement("h1");
            wrapperDataRequest.innerHTML = this.data.name;
            wrapperDataRequest.className = 'yelpBusinessName';

            wrapper.appendChild(imgDataRequest);
            wrapper.appendChild(wrapperDataRequest);
        } else {
            console.log("MMM-Test: this.data couldn't be found");
            wrapper.innerHTML = "This didn't work";
        }*/

        if(!this.loaded){
            wrapper.innerHTML = "Loading Yelp...";
            wrapper.className = "bright light small";
            return wrapper;
        }

        var wrapperTitle = document.createElement("h1");
        console.log("MMM-Yelp: YELP is set" + this.cocktails);

        wrapperTitle.innerHTML = yelp.name;
        //wrapperTitle.innerHTML = yelp.location["address1"];
        
        wrapper.appendChild(wrapperTitle);


        
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

    processYelp: function(data) {
        console.log("MMM-Yelp: processYelp is responsive " + JSON.stringify(data.name));
        this.cocktails = data;
        this.loaded = true;
    },

    //Receiving notification from Node_helper
    socketNotificationReceived: function(notification, payload){
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        if(notification === "MMM-Yelp_Data_Received") {
            this.processYelp(payload);
            //this.data = payload;
            //console.log("MMM-Test:  Data_Received " + this.data);
            this.updateDom();
        }
        //Messages to display in console from node_helper and other backend processes
        if(notification === "MMM-Yelp_Console_Output"){
            console.log("MMM-Yelp Output: " + payload);
            Log.log("MMM-Yelp Output: " + payload);
            this.log("MMM-Yelp Output: " + payload);
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