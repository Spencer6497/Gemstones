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
        this.scope = {
            data: null
        }
    },

    getGemstones: function(url) {
        var self = this;
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
                    filename = filename.replace('Small', '');
                    var imgSrc = `http://www.webmineral.com/specimens/photos/${filename}`;
                    var result = {
                        imgSrc,
                        mineralName
                    };
                    self.sendSocketNotification('GEMSTONE_RESULT', result);
                    self.scope.data = result;
                }
                done();
            }
        });
        
        // Queue just one URL, with default callback
        c.queue('http://www.webmineral.com/');
    }, 

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_GEMSTONES') {
            this.getGemstones(payload);
        }
    }
});