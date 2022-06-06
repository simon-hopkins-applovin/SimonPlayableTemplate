var Global;
var Debug;
var ironSourceFlag = false;

window.onload = function() {
	Global 	= new GlobalObj();
	Debug	= new DebugObj();
	var gameInitWidth = 640;
	var gameInitHeight = 1138;

	// need to this check once for ironsource at the beginning
	// Old Mraid version, new dapi version below
//	if(Global.PLATFORM==PORT.IRONSOURCE && !ironSourceFlag){
//		try{
//			mraid.getState();
//			mraid.getMaxSize();
//		}catch(err){
//		}
//		ironSourceFlag = true;
//	}
	
	if(Global.PLATFORM==PORT.IRONSOURCE && !ironSourceFlag){
		try{
			(dapi.isReady()) ? onReadyCallback() : dapi.addEventListener("ready",onReadyCallback);
		}catch(err){
		}
		ironSourceFlag = true;
	}
	
	// Android video over detection exploit - start after webgl context available 
	if(window.innerWidth <= 0){
		window.setTimeout(window.onload, 250);
		return;
	}
	
	if(window.innerWidth<window.innerHeight || Global.PLATFORM==PORT.FACEBOOK){
		// Portrait
		Global.orientation = "p";
		//console.log("main js globalorientation is p");
	}
	else{
		// Landscape
		gameInitWidth = 1138;
		gameInitHeight = 640;
		Global.orientation = "l";
		//console.log("main js globalorientation is l");
	}
		
	var userAgent = navigator.userAgent || navigator.vendor;
	var renderer = (Global.forceCanvasIOS && (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) ? Phaser.CANVAS : Phaser.AUTO;
	var game = new Phaser.Game(gameInitWidth, gameInitHeight, renderer, '', null, false, true, {"arcade":true});
	
	// Adding all states (make sure .js is added in index.html)
	
	Object.keys(Global.myStates).forEach(function(k){
		//var tempKey = keys;
		game.state.add(k, Global.myStates[k]);
	});
	game.state.add('CustomLoader', CustomLoader);
	game.state.start("CustomLoader");
};

function gameStart() {}
function gameClose() {}

function onReadyCallback(){
	console.log("DAPI READY");
    //No need to listen to this event anymore
    dapi.removeEventListener("ready", onReadyCallback);

    //If the ad is visible start the game
    if(dapi.isViewable()){
    	startGame();
    }
    //Use dapi functions
//    dapi.addEventListener("viewableChange", viewableChangeCallback);
//    dapi.addEventListener("adResized", orientationCallback);
}

function startGame() {
    //start your game
    var screenSize = dapi.getScreenSize();
    dapi.getAudioVolume();
    dapi.addEventListener('audioVolumeChange', function(){console.log("listened to audio");});
}

function viewableChangeCallback(e){
    e.isViewable ? this.startGame() : pause(); //start the game or resume
}
