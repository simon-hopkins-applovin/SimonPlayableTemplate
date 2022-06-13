function AlyObj() {
	this.platform = AlyPlatform.GOOGLE_LEGACY;
	
	this.isHeartBeat = false;
	this.heartBeatRate = 5; // interval in seconds for when heartbeat event is sent
	
	this.isClickthroughRegistered = false; // to differentiate multiple clickthroughs from same session
	
	this.sendOnceLog = []; // events that were sent with sendOnce will be added here. It won't process if an event name is already in this list
	
	this.startTime	= -1; // the timestamp at which the first interaction is made
	this.game = null;
	this.touchCount = 0;
}

const AlyPlatform = {
	GOOGLE_GTAG: 0,
	GOOGLE_LEGACY: 1
};

const AlyPreset = {
	IMPRESSION: "impression",
	PROGRESS_START: "progress_start",	// first interaction
	PROGRESS_MID: "progress_mid",		// subjective midpoint
	PROGRESS_END: "progress_end",		// on last interaction that will trigger an end modal, LM, or portal
	CTA_INGAME: "cta_ingame",			// redirect sources
	CTA_END: "cta_end",
	CTA_RM: "cta_rm",
	CTA_PORTAL: "cta_portal",
	CTA_ICON: "cta_icon",
	CLICKTHROUGH: "clickthrough",		// can only happen once per session, triggered along with the corresponding cta_x event
	TOUCH: "touch",						// any touch, value is incremented each time (so we can measure average number of touches)
	HEARTBEAT: "heartbeat"				// not used
};

// not including label
AlyObj.prototype.sendEvent = function(aname, avalue, acategory, aisNonInteraction){
	var name 			= aname;
	var value 			= avalue;
	var category 		= acategory;
	var isNonInteraction= aisNonInteraction;
	/*if(this.game != null){
		console.log("time from aly: " + this.game.time.totalElapsedSeconds());
	}*/
	
	// check if the event is a preset, and depending that set the category
	
	if(typeof category == undefined){ category = "engagement"; }
	if(typeof value !== undefined){
		if(value < 0){
			// value must be positive
		}
		if(!Number.isInteger(value)){
			// value must be integer
		}
	}
	
	var isPreset = false;
	Object.keys(AlyPreset).forEach(function(key){
		if(AlyPreset[key] == name){
			isPreset = true;
		}
	});
	//console.log(name + "is preset: " + isPreset);
	// override category depending if preset
	if(isPreset){ 	
		category = "general";
	}
	else{
		category = "custom";
	}
	
	// if preset determine and override the value depending on the event
	if(isPreset){
		if(name == "impression"){
			value = 1;
		}
		else if(name == "touch"){
			this.touchCount += 1;
			value = this.touchCount;
		}
		// time since impression to first touch (so video watch time included)
		else if(name == "progress_start"){
			value = this.game.time.totalElapsedSeconds();
		}
		else{	// timestamp for all else
			value = this.getTime();
		}
	}
	
	if(this.platform == AlyPlatform.GOOGLE_GTAG){
		if(typeof value == undefined){
			gtag('event', name, {'event_category': category});
		}
		else{
			gtag('event', name, {'event_category': category, 'value': value});
		}
	}
	else if(this.platform == AlyPlatform.GOOGLE_LEGACY){
		if(typeof value == undefined){
			ga('send', {
			  hitType: 'event',
			  eventAction: name,
			  eventCategory: category
			});
		}
		else{
			ga('send', {
			  hitType: 'event',
			  eventAction: name,
			  eventCategory: category,
			  eventValue: value
			});
		}
	}
};

AlyObj.prototype.sendEventOnce = function(name, value, category, isNonInteraction){
	if(!this.sendOnceLog.includes(name)){
		this.sendOnceLog.push(name);
		this.sendEvent(name, value, category, isNonInteraction);
		console.log("sending " + name);
	}
	else{
		console.log(name + " was already sent");
	}
};

AlyObj.prototype.heartBeat = function(){
	var self = this;
	if(!self.isHeartBeat){
		self.isHeartBeat = true;
		setInterval(function(){
			if(self.platform == AlyPlatform.GOOGLE_GTAG){
				gtag('event', AlyPreset.HEARTBEAT, {'value': self.heartBeatRate, 'event_category': 'cat_heartbeat'});
			}
			else if(self.platform == AlyPlatform.GOOGLE_GTAG){
				// TODO if needed
			}
		},self.heartBeatRate*1000);
	}
};

/*
 * returns the elapsed time in seconds counted from the first interaction rounded down to integer value
*/
AlyObj.prototype.getTime = function(){
	return Math.floor(this.game.time.totalElapsedSeconds() - this.startTime);
};