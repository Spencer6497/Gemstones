/* Magic Mirror
 * Module: Gemstones
 *
 * By Spencer6497
 *
 */
const NodeHelper = require("node_helper");
var Crawler = require("crawler");
const fs = require('fs');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting module: " + this.name);
    },

    getGemstones: function(url) {
        var c = new Crawler({
            maxConnections : 10,
            // This will be called for each crawled page
            callback : function (error, res, done) {
                if(error){
                    console.log(error);
                }else{
                    var $ = res.$;
                    // $ is Cheerio by default
                    //a lean implementation of core jQuery designed specifically for the server
                    var src = $("tr > td > a > img").slice(0,1)[0].attribs.src;
                    var mineralName = $("tr > td > a > img").slice(0,1)[0].attribs.alt.split(" ")[4];
                    var filename = src.split("/").pop();
                    var imgSrc = `http://www.webmineral.com/specimens/photos/${filename}`;
                    var result = {
                        imgSrc,
                        mineralName
                    };
                    this.sendSocketNotification('GEMSTONE_RESULT', result);
                }
                done();
            }
        });
        
        // Queue just one URL, with default callback
        c.queue('http://www.webmineral.com/');
    }, 

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_GEMSTONES') {
            if (this.scope.timestamp === this.getDate() && this.scope.data !== null && this.config.sign === this.scope.data.dscope.sunsign) {
                this.sendSocketNotification('GEMSTONE_RESULT', this.scope.data);
            } else {
                this.getGemstones(payload);
            }
        }
        // if (notification === 'CONFIG') {
        //     this.config = payload;
        // }
		// let debug = this.config.debug;
		// if (debug !== false)
		// {
	    //  console.log("From Node_Helper ~~ Sign: "+this.config.sign+"  Icon set: "+this.config.iconset+" Show Tomorrow: "+this.config.extend);
    	// }
    }
});