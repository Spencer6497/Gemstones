/* Magic Mirror
 * Module: Gemstones
 *
 * By Spencer6497
 *
 */

Module.register("gemstones",{
	// Default module config.
	defaults: {
		text: "Gemstones",
		updateInterval: 24 * 60 * 1000 // every 24 hours
	},

	// Override dom generator.
	getDom: function() {
		var imgSrc = this.imgSrc;
		var caption = this.caption;

		var wrapper = document.createElement("div");
		// wrapper.innerHTML = this.config.text;

		// If not yet loaded, display loading
		if (!this.loaded) {
            wrapper.innerHTML = '<p>Loading...</p>';
            return wrapper;
        }

		var titleWrapper = document.createElement('div');
		titleWrapper.classList.add('center'); // Add css classes here for styling
		titleWrapper.innerHTML = `<h3>Rock of the day:</h3>`
		wrapper.appendChild(titleWrapper);

		var imgWrapper = document.createElement('div');
		imgWrapper.classList.add('center'); // Add css classes here for styling
		imgWrapper.innerHTML = `<img src=${imgSrc}>`
		wrapper.appendChild(imgWrapper);

		var captionWrapper = document.createElement('div');
		captionWrapper.classList.add('center'); // Add css classes here for styling
		captionWrapper.innerHTML = caption;
		wrapper.appendChild(captionWrapper);

		return wrapper;
	},

	// Start sequence
    start: function() {
		Log.info('Starting module: ' + this.name);
        // this.sendSocketNotification('CONFIG', this.config);
		this.scheduleUpdate();
    },

	getStyles: function() {
		return ['gemstones.css'];
	},

	processGemstone: function(data) {
		this.loaded = true;
		this.imgSrc = data.imgSrc;
		this.caption = data.mineralName;
	},

	scheduleUpdate: function() {
		setInterval(() => {
			this.getGemstones();
		}, this.config.updateInterval);
		this.getGemstones();
	},

	getGemstones: function() {
		this.sendSocketNotification("GET_GEMSTONES");
	},

	socketNotificationReceived: function(notification, payload) {
        if (notification === 'GEMSTONE_RESULT') {
            this.processGemstone(payload);
            this.updateDom();
        }
        this.updateDom();
    },
    
});