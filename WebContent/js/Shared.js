


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
	this.points = 0;
	
	this.GameSM = new StateMachine({
		PLAYING: new State(),
		LM: new State(),
		RM: new State()
	});
	
	this.ITM = new InactivityTimerManager(this.game, 5000, function(){return false;}, this);
	
	
	
	
	this.sound.mute = true;
	
	this.game.input.onDown.add(function(){
		if(Global.isSIP){
			if(!this.GameSM.checkState("RM")){
				this.GameSM.changeState("RM");
			}
			return;
		}
		this.sound.mute = false;
	}, this);

	this.GameSM.changeState("PLAYING");
};




Phaser.State.prototype.update = function(){
	this.game.time.desiredFps = Math.max(30, (1/(this.game.time.now - this.game.time.prevTime))*1000);
	AppLovin.handleOrientation(this);
	AppLovin.debugOverlay(this.game);
	Debug.update.call(this);
	this.GameSM.onUpdate();
	
};
