
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.4 (Phaser v2.6.2)


/**
 * Level_p.
 */
function Level_p() {
	
	Phaser.State.call(this);
	
}

/** @type Phaser.State */
var Level_p_proto = Object.create(Phaser.State.prototype);
Level_p.prototype = Level_p_proto;
Level_p.prototype.constructor = Level_p;

Level_p.prototype.init = function () {
	
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
	
};

Level_p.prototype.preload = function () {
	
	this.load.pack('playableAssets', 'assets/pack.json');
	
};

Level_p.prototype.create = function () {
	var _camera = this.add.sprite(320.0, 569.0, 'debugBtn');
	_camera.renderable = false;
	_camera.anchor.set(0.5, 0.5);
	_camera.tint = 0xff0000;
	
	var __bgPH = this.add.sprite(320.0, 569.0, 'portrait_ph');
	__bgPH.scale.set(0.8, 0.8);
	__bgPH.anchor.set(0.5, 0.5);
	
	var __Game = this.add.group();
	
	var __UI = this.add.group();
	
	var __RM = this.add.group();
	
	
	
	// fields
	
	this.fCamera = _camera;
	this.f_bgPH = __bgPH;
	this.f_Game = __Game;
	this.f_UI = __UI;
	this.f_RM = __RM;
	// Listens for keyboard presses
	this.geoKey1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	this.geoKey1.onDown.add(function(){if(Global.debugPress.one != 2) {Global.debugPress.one = 1;}else{Global.debugPress.one = 3;}},this);
	this.geoKey1.onUp.add(function(){if(Global.debugPress.one == 1) {Global.debugPress.one = 0;}else if(Global.debugPress.one == 3){Global.debugPress.one = 2;}},this);
	this.geoKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	this.geoKey2.onDown.add(function(){if(Global.debugPress.shift != 2) {Global.debugPress.shift = 1;}else{Global.debugPress.shift = 3;}},this);
	this.geoKey2.onUp.add(function(){if(Global.debugPress.shift == 1) {Global.debugPress.shift = 0;}else if(Global.debugPress.shift == 3){Global.debugPress.shift = 2;}},this);
	this.geoKey3 = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
	this.geoKey3.onDown.add(function(){if(Global.debugPress.ctrl != 2) {Global.debugPress.ctrl = 1;}else{Global.debugPress.ctrl = 3;}},this);
	this.geoKey3.onUp.add(function(){if(Global.debugPress.ctrl == 1) {Global.debugPress.ctrl = 0;}else if(Global.debugPress.ctrl == 3){Global.debugPress.ctrl = 2;}},this);
	
	// doesn't disable game when clicked off in preview, but prevent audio from playing after ad close on SDK
	   var subStr = window.location.href;
	   if(subStr.substring(0,17)=='http://localhost:' || subStr.substring(0,29)=='https://playable.applovindemo'){
	       this.game.stage.disableVisibilityChange = true;
	}
	else{
		this.game.stage.disableVisibilityChange = false;
	}
	
	this.afterCreate();
	
};

/* --- end generated code --- */
// -- user code here --

// Add your custom debug buttons here
Level_p.prototype.customDebugButtons = function(tag){
	switch(tag){
	case 'Game Over':
		console.log('GAME OVER PRESSED');
		break;
	case 'Level 1':
		console.log('LEVEL 1 PRESSED');
		break;
	default: 
		console.log('No code for this tag');
	}
};

//Add your custom GEO adjustments here


Level_p.prototype.onOrientationChanged = function(){
    console.log("orientation change callback");
    if(Global.orientation == "p"){
        // your custom logic here
    }
    else{
        // your custom logic here
    }
};

Level_p.prototype.render = function(){
	Debug.render(this);
};
