


Phaser.State.prototype.afterCreate = function(){
	
	//old after create code
	//console.log(Aly);
	//Aly.game = this.game;
	// Camera handling
	this.game.camera.bounds = null;
	this.game.camera.follow(this.fCamera);
	AppLovin.anchorInitFixedCamera(this);
	AppLovin.handleOrientation(this);
	this.game.world.updateTransform();
	this.game.time.advancedTiming = true;
	this.gameBounds = new Phaser.Rectangle(Global.cameraOffsetX, Global.cameraOffsetY, this.game.width, this.game.height);

	
	this.GameSM = new StateMachine({
		IDLE: new State(),
		CHOOSING: new State(),
		EM: new State(),
		RM: new State()
	});
	
	this.ITM = new InactivityTimerManager(this.game, 5000, function(){return false;}, this);
	
	
	console.log("hasdklas;ldkaslello");
};



Phaser.State.prototype.update = function(){
	this.game.time.desiredFps = Math.max(30, (1/(this.game.time.now - this.game.time.prevTime))*1000);
	AppLovin.handleOrientation(this);
	AppLovin.debugOverlay(this.game);
	Debug.update.call(this);
	
};









