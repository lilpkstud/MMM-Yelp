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

module.exports = NodeHelper.create({
  //Start Method
  start: function() {
    console.log("MMM-Yelp: Starting Node_helper");
    this.config = {};
  }, 
  
  socketNotificationReceived: function(notification, payload){
    var self = this;
    this.log("MMM-Yelp: Received notification: " + notification);
    if(notification === "CONFIG") {
      this.config = payload;
      this.yelp = Yelp.client(this.config.apiKey);xs
    }
    
    if(notification === "GET_DATA") {
      self.sendSocketNotification('MMM-Yelp_Console_Output', payload);
      this.yelp.search({
        term: this.config.term,
        location: this.config.location,
      }).then(response => {        
        self.sendSocketNotification("MMM-Yelp_Console_Output", response.jsonBody.businesses[0].name);
        self.sendSocketNotification("MMM-Yelp_Data_Received", response.jsonBody.businesses[0].name);
      }).catch(e => {
        this.log("MMM-Yelp: ERROR " + e);
        console.log("MMM-Yelp: ERROR " + e);
      })
    }
  },

  log: function(msg){
    if(this.config && this.config.debug){
      console.log(this.name + ': ' + msg);
    }
  }
});