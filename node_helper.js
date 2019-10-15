/* Magic Mirror
 * Node Helper: MMM-Yelp
 *
 * By lilpkstud
 * MIT Licensed.
 */
var NodeHelper = require("node_helper");
const Yelp = require('yelp-fusion');
var yelp;
var config;
var characters;

module.exports = NodeHelper.create({
  //Start Method
  start: function() {
    console.log("MMM-Yelp: Starting Node_helper");
    this.config = {};
  }, 
  
  socketNotificationReceived: function(notification, payload){
    var self = this;
    switch(notification){
      case "DO_YOUR_JOB":
        this.sendSocketNotification("I_DID", (this.countDown - payload))
        break
    }
    this.log("MMM-Yelp: Received notification: " + notification);
    if(notification === "CONFIG") {
      console.log("MMM-Yelp: CONFIG HAS BEEN CALLED");
      this.config = payload;
      console.log("MMM-Yelp: what is payload? " + JSON.stringify(this.config));

      this.yelp = Yelp.client(this.config.apiKey);

      console.log("MMM-yelp:" + this.yelp);

      //Searching Yelp-Fusion with term and location
      this.yelp.search({
        term: this.config.term,
        location: this.config.location,
      }).then(response => {
        self.sendSocketNotification("MMM-Yelp_Console_Output", JSON.stringify(response.jsonBody.businesses[0]));
        self.sendSocketNotification("MMM-Yelp_Data_Received", JSON.stringify(response.jsonBody.businesses[0]));
        this.log("MMM-Yelp: GOT AN RESPONSE!" + JSON.stringify(response.jsonBody.businesses[0]));
        console.log("MMM-Yelp: GOT AN RESPONSE NOICE!" + JSON.stringify(response.jsonBody.businesses));
      }).catch(e => {
        this.log("MMM-Yelp: ERROR " + e);
        console.log("MMM-Yelp: ERROR " + e);
      });
      
    }
  },

  log: function(msg){
    if(this.config && this.config.debug){
      console.log(this.name + ': ' + msg);
    }
  }

});