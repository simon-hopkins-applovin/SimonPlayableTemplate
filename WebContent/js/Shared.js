


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
	this.gameRound = 0;
	var boundsConfig = {};
	this.f_areaVisualizartions.forEach(function(child){
		boundsConfig[child.name] = new Phaser.Rectangle().copyFrom(child, true);
	}, this);
	this.f_areaVisualizartions.destroy();
	
	this.BuracoManager = new BuracoManager(this.game, boundsConfig);
	
	this.initSM();
	
	this.game.time.events.add(500, function(){
		this.BuracoManager.SM.changeState("DRAW");
	}, this);
	
	this.GameSM.changeState("PLAYING");
	
	
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
	
	this.game.add.sound("BGM-Funkometer", 0.5, true).play();
	
	var clickCondition = function(){
		return this.GameSM.checkState("PLAYING");
	}.bind(this);
	this.f_icon.createCTA(false, clickCondition, Anchor.H_LEFT, Anchor.V_TOP);
	this.f_cta.createCTA(Global.orientation=="p", clickCondition, Global.orientation=="p"?Anchor.H_RIGHT:Anchor.H_LEFT, Global.orientation=="p"?Anchor.V_BOTTOM:Anchor.V_TOP);
	
};


Phaser.State.prototype.customGEOAdjustments = function(textObj) {
//	if(Global.LangCode == "FR" && textObj.tag =="tutorialText"){
//		textObj.scale.setTo(2);
//		textObj.x += 30;
//	}
	var promptRect = new Phaser.Rectangle(0,0, this.gameBounds.width-150, this.f_promptBacking.height);
	this.f_promptTextParent.forEach(function(t){
		t.resizeInRect(promptRect);
	}, this);
	
	
	if(textObj.name == "playerScore"){
		textObj.setText((Global.LangCode=="PT"?"PONTOS: ":"SCORE: ") + this.points);
	}
	
};

Phaser.State.prototype.initSM = function(){
	
	var hintOverlayCanvas = this.game.add.graphics(0,0);
	var bmd = this.game.make.bitmapData(this.gameBounds.width, this.gameBounds.height);
	
//	bmd.alphaMask("Screen Overlay", "Circle Mask2");
	var maskSprite = this.game.add.sprite(this.gameBounds.left, this.gameBounds.top, bmd, null, this.f_hintOverlayParent).setAnchor(0.5);
	maskSprite.position.setTo(this.gameBounds.centerX, this.gameBounds.centerY);
	this.f_hintOverlayParent.sendToBack(maskSprite);
//	var t1 = this.game.add.sprite(0,0, "Screen Overlay");
//	var t = this.game.add.sprite(0,0, "Circle Mask2");
//	t.blendMode = PIXI.blendModes.ADD;
	this.f_promptParent.basePos = this.f_promptParent.position.clone();
	var drawHintOverlay = function(maskData, textName, angle, promptPos){
		maskSprite.angle = 0;
		this.f_promptParent.position.setTo(this.f_promptParent.basePos.x, this.f_promptParent.basePos.y);
		if(angle){
			maskSprite.angle = angle;
		}
		if(promptPos){
			this.f_promptParent.position.setTo(promptPos.x, promptPos.y);
		}
		
		this.f_promptTextParent.forEach(function(t){
			t.alpha = 0;
		}, this);
		this.f_promptTextParent.getByName(textName).alpha = 1;
		if(this.f_hintOverlayParent.alphaTween){
			this.f_hintOverlayParent.alphaTween.stop();
			this.f_hintOverlayParent.alphaTween.alpha = 0;
		}
		this.f_hintOverlayParent.alphaTween = this.game.add.tween(this.f_hintOverlayParent).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
		this.world.updateTransform();
		bmd.clear();
		maskData.forEach(function(data){
			var center = this.world.worldTransform.apply(data.center);
			bmd.draw(data.key, center.x - this.cache.getImage(data.key).width/2, center.y - this.cache.getImage(data.key).height/2);
		}, this);
		
		bmd.draw("Screen Overlay", this.gameBounds.left, this.gameBounds.top, 1138, 1138,  "source-out");

	};
	this.f_cardsParent.add(this.BuracoManager.drawPA);
	this.f_cardsParent.add(this.BuracoManager.playerPlayPA);
	this.f_cardsParent.add(this.BuracoManager.playerHandPA);
	this.f_cardsParent.add(this.BuracoManager.opponentPlayPA);
	this.f_cardsParent.add(this.BuracoManager.opponentHandPA);
	this.f_cardsParent.add(this.BuracoManager.discardPA);
	
	this.f_hand.alpha = 0;
	var handShowing = false;
	var repeatEvent = null;
	var tapHand = function(){
		if(!handShowing){
			return;
		}
		this.f_hand.pointTween = this.game.add.tween(this.f_hand).to({x: (Math.cos(Util.toRadians(this.f_hand.angle+90))*30).toString(), y: (Math.sin(Util.toRadians(this.f_hand.angle+90))*30).toString()}, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
		this.f_hand.pointTween.onComplete.add(function(){
			if(!handShowing){
				return;
			}
			repeatEvent = this.game.time.events.add(750, tapHand.bind(this), this);
		}, this);
	};
	
	
	var showHand = function(pos, angle){
		if(this.f_hand.pointTween){
			this.f_hand.pointTween.stop();
		}
		if(this.f_hand.alphaTween){
			this.f_hand.alphaTween.stop();
		}
		handShowing= true;
		this.f_hand.position.setTo(pos.x, pos.y);
		this.f_hand.angle = angle;
		this.f_hand.alphaTween = this.game.add.tween(this.f_hand).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
		tapHand.call(this);
	};
	
	var hideHand = function(){
		if(this.f_hand.pointTween){
			this.f_hand.pointTween.stop();
		}
		if(this.f_hand.alphaTween){
			this.f_hand.alphaTween.stop();
		}
		if(repeatEvent){
			this.game.time.events.remove(repeatEvent);
		}
		handShowing= false;
		this.f_hand.alphaTween = this.game.add.tween(this.f_hand).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
	};
	
	//Draw drivers
	this.BuracoManager.SM.states.DRAW.onEnter.add(function(){
		console.log("draw");
		if(Global.isSIP){
			this.BuracoManager.mainDeck.setCanInteract(false);
		}
		
		if(!this.BuracoManager.isPlayerTurn){
			drawHintOverlay.call(this, [{key: "Half Screen Mask", center: new Phaser.Point(this.gameBounds.centerX, this.BuracoManager.discardPA.top + (Global.orientation=="l"?340:360))}], "opponentTurn", 180, 
														new Phaser.Point(this.gameBounds.centerX, this.BuracoManager.discardPA.bottom + 100));
			this.BuracoManager.mainDeck.setCanInteract(false);
			this.BuracoManager.discardPile.setCanInteract(false);
			return;
		}
		
		this.gameRound++;
		if(this.gameRound == 2){
			this.BuracoManager.drawPA.getCardPile("deck").setCanInteract(false);
			this.f_hintOverlayParent.alphaTween = this.game.add.tween(this.f_hintOverlayParent).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
			this.f_hintOverlayParent.alphaTween.onComplete.add(function(){
				this.BuracoManager.mainDeck.setCanInteract(true);
				this.BuracoManager.discardPile.setCanInteract(true);
				drawHintOverlay.call(this, [{key: "Circle Mask", center: this.BuracoManager.discardPA.getCardPile("discard").peekTop().getWorldPos()}], "drawAgain");
				showHand.call(this, this.BuracoManager.discardPA.getCardPile("discard").peekTop().getWorldPos().add(60, 0), 90);

			}, this);
		}else{
			showHand.call(this, this.BuracoManager.drawPA.getCardPile("deck").getWorldPos().add(60, 0), 90);
			drawHintOverlay.call(this, [{key: "Circle Mask", center: this.BuracoManager.drawPA.getCardPile("deck").getWorldPos()}], "drawACard");

		}
		
	}, this);
	
	this.BuracoManager.drawPA.getCardPile("deck").onClickSignal.add(function(card){
		if(this.BuracoManager.SM.checkState("DRAW")){
			
			hideHand.call(this);
			this.f_hintOverlayParent.alphaTween = this.game.add.tween(this.f_hintOverlayParent).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);

		}
	}, this);
	
	this.BuracoManager.discardPA.getCardPile("discard").onClickSignal.add(function(card){
		if(this.BuracoManager.SM.checkState("DRAW")){
			if(!this.BuracoManager.isPlayerTurn){
				return;
			}
			hideHand.call(this);
			this.f_hintOverlayParent.alphaTween = this.game.add.tween(this.f_hintOverlayParent).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);

		}
	}, this);
	
	this.BuracoManager.playerHandPA.getCardPile("playerHand").onClickSignal.add(function(card){
		
		if(this.BuracoManager.SM.checkState("PLAY_MELD") || this.BuracoManager.SM.checkState("DISCARD")){
			hideHand.call(this);
			this.f_hintOverlayParent.alphaTween = this.game.add.tween(this.f_hintOverlayParent).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
			card.lowerCard();
			card.hideGlow();

		}
	}, this);
	
	//Play Meld
	this.BuracoManager.SM.states.PLAY_MELD.onEnter.add(function(){
		if(!this.BuracoManager.isPlayerTurn){
			return;
		}
		
		if(this.gameRound==2){
			for(var i = this.BuracoManager.playerHandPA.getCardPile("playerHand").cards.length-1; i>1; i--){
				this.BuracoManager.playerHandPA.getCardPile("playerHand").cards[i].raiseCard();
				this.BuracoManager.playerHandPA.getCardPile("playerHand").cards[i].showGlow();
			}
			this.BuracoManager.playerHandPA.getCardPile("playerHand").cards.forEach(function(c){
				c.disableInput();
			}, this);
			
			showHand.call(this, this.BuracoManager.playerHandPA.getCardPile("playerHand").cards[2].getWorldPos().add(60, -130), 45);
			if(Global.orientation == "p"){
				drawHintOverlay.call(this, [{key: "Half Screen Mask", center: new Phaser.Point(this.gameBounds.centerX, this.gameBounds.bottom - 720/2 + 200)}], "startANewSet", 0, 
						Global.orientation=="p"?new Phaser.Point(this.gameBounds.centerX, this.BuracoManager.discardPA.getWorldPos().y):0);
			}else{
				var discardCenter = this.BuracoManager.discardPA.worldTransform.apply(new Phaser.Point(this.BuracoManager.discardPA.bounds.centerX, this.BuracoManager.discardPA.bounds.centerY));
				discardCenter = this.world.worldTransform.applyInverse(discardCenter);

				drawHintOverlay.call(this, [{key: "Oval Mask 2", center: discardCenter}, {key: "Oval Mask", center: this.BuracoManager.playerHand.getWorldPos().clone().add(50, -50)}], "startANewSet");
			}
			
			this.GameSM.changeState("LM");
			return;
		}
		
		
		var meldCenter = this.BuracoManager.playerPlayPA.worldTransform.apply(new Phaser.Point(this.BuracoManager.playerPlayPA.getCardPile("meld1").centerX, this.BuracoManager.playerPlayPA.getCardPile("meld1").centerY));
		meldCenter = this.world.worldTransform.applyInverse(meldCenter);
		var topCard = this.BuracoManager.playerHandPA.getCardPile("playerHand").peekTop();
		var topCardCenter = this.BuracoManager.playerHandPA.getCardPile("playerHand").peekTop().getWorldPos().add(0, -50);
		//topCardCenter = this.world.worldTransform.applyInverse(topCardCenter);
		showHand.call(this, topCardCenter.clone().add(0, -120), 0);
		topCard.raiseCard(200);
		topCard.showGlow(200);
		this.BuracoManager.playerHandPA.getCardPile("playerHand").cards.forEach(function(c){
			c.disableInput();
		}, this);
		topCard.enableInput();

		drawHintOverlay.call(this, [{key: "Oval Mask 2", center: meldCenter}, {key: "Circle Mask", center: topCardCenter}], "finishTheSet", 0, 
				Global.orientation=="p"?new Phaser.Point(this.gameBounds.centerX, this.BuracoManager.discardPA.getWorldPos().y): new Phaser.Point(this.gameBounds.centerX, this.gameBounds.centerY-150));

	}, this);
	
	this.f_attaboyParent.alpha = 0;
	
	//https://www.desmos.com/calculator/xrl5v077vh
	var getAttaboyCardData = function(theta, radius){
		var x = Phaser.Math.mapLinear(theta, 0, 1, -1, 1);
		console.log(x);
		var y = -1 * -(x-1)*(x+1) * 1/5;
		var dxdy = -1 * -(2*x)/5;
		var angle = Math.tan(dxdy);
		//angle -= Math.PI/2;
		
		return {x: x * radius, y: y*radius, angle: angle};
	};
	
	
	var showDiscardPrompt = function(){
		var discardCenter = this.BuracoManager.discardPA.worldTransform.apply(new Phaser.Point(this.BuracoManager.discardPA.bounds.centerX, this.BuracoManager.discardPA.bounds.centerY));
		discardCenter = this.world.worldTransform.applyInverse(discardCenter);
		this.f_attaboyParent.alphaTween = this.game.add.tween(this.f_attaboyParent).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
		var topCard = this.BuracoManager.playerHandPA.getCardPile("playerHand").peekTop();
		var topCardCenter = this.BuracoManager.playerHandPA.getCardPile("playerHand").worldTransform.apply(new Phaser.Point(topCard.centerX, topCard.centerY-50));
		topCardCenter = this.world.worldTransform.applyInverse(topCardCenter);
		drawHintOverlay.call(this, [{key: "Oval Mask 2", center: discardCenter}, {key: "Circle Mask", center: topCardCenter}], "endYourTurn");
		
		showHand.call(this, topCardCenter.add(0, -90), 0);
		topCard.raiseCard(200);
		topCard.showGlow(200);
		topCard.enableInput();
	}
	
	
	this.f_attaboyPromptParent.scale.setTo(0);
	this.BuracoManager.SM.states.DISCARD.onEnter.add(function(){
		if(!this.BuracoManager.isPlayerTurn){
			return;
		}
		if(this.gameRound>1){
			return showDiscardPrompt.call(this);
		}
		
		//attaboy logic
		
		this.f_attaboyParent.alpha = 1;
		this.f_attaboyBacking.alpha = 0;
		
		this.f_attaboyBacking.alphaTween = this.game.add.tween(this.f_attaboyBacking).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
		this.BuracoManager.playerHandPA.getCardPile("playerHand").setCanInteract(false);
		var length = this.BuracoManager.playerPlayPA.getCardPile("meld1").cards.length;
		var itr = length-1;
		var tweens = [];
		while(this.BuracoManager.playerPlayPA.getCardPile("meld1").cards.length>0){
			var card = this.BuracoManager.playerPlayPA.getCardPile("meld1").drawTop();
			var cardWorldPos = this.BuracoManager.playerPlayPA.getCardPile("meld1").worldTransform.apply(new Phaser.Point(card.x, card.y));
			cardWorldPos = this.world.worldTransform.applyInverse(cardWorldPos);
			this.f_attaboyCardParent.add(card);
			this.f_attaboyCardParent.sendToBack(card);
			card.position.setTo(cardWorldPos.x, cardWorldPos.y);
			card.disableInput();
			var data = getAttaboyCardData.call(this, (itr+0.5)/length, 250);
			var endPos = new Phaser.Point(data.x + this.gameBounds.centerX, data.y+this.gameBounds.centerY + (Global.orientation=="l"?100:0));
			var delay = itr*100;
			card.moveTween = this.game.add.tween(card).to({x: endPos.x, y: endPos.y}, 300, Phaser.Easing.Back.InOut, true, delay);
			card.moveTween.onStart.add(function(c){
				c.showGlow();
			}.bind(this, card), this);
			
			card.angleTween = this.game.add.tween(card).to({angle: Util.toDegrees(data.angle)}, 300, Phaser.Easing.Linear.None, true, delay);
			tweens.push(card.moveTween);
			itr--;
		}
		
		this.f_amazing.loadTexture(Global.LangCode=="PT"?"INCREDIBLE_P":"AMAZING!");
		this.points = 200;
		this.f_playerScore.setText((Global.LangCode=="PT"?"PONTOS: ":"SCORE: ") + this.points);
		this.f_glow.spinTween = this.game.add.tween(this.f_glow).to({angle:"360"}, 3000, Phaser.Easing.Linear.None, true, 0, -1);
		if(tweens.length == 0){
			return;
		}
		var attaboySound = this.game.add.sound("Attaboy").play();
		var shimmer = this.game.add.sound("Shimmer", 1, true).play();
		attaboySound.onStop.add(function(){
			shimmer.stop();
		}, this);
		tweens[tweens.length-1].onComplete.add(function(){
			this.f_attaboyPromptParent.scaleTween = this.game.add.tween(this.f_attaboyPromptParent.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Back.Out, true);
			
			this.time.events.add(2000, function(){
				this.BuracoManager.playerHandPA.getCardPile("playerHand").setCanInteract(true);
				showDiscardPrompt.call(this);
			}, this);
		}, this);
		
	

		
		
	}, this);

	
	this.GameSM.states.LM.onEnter.add(function(){
		
		this.input.onDown.add(function(){
			if(this.GameSM.checkState("LM")){
				this.GameSM.changeState("RM");
			}
		}, this);
	}, this);
	
	
	this.f_RM.alpha = 0;
	this.GameSM.states.RM.onEnter.add(function(){
		
		AppLovin.redirect();
		this.f_playNowParent.createCTA(true, function(){return false;});
		this.time.events.add(500, function(){
			this.f_RMglow.spinTween = this.game.add.tween(this.f_RMglow).to({angle:"360"}, 3000, Phaser.Easing.Linear.None, true, 0, -1);

			this.f_Game.alpha =0 ;
			this.f_UI.alpha = 0;
			this.f_RM.alpha = 1;
			this.input.onDown.add(function(){
				if(this.GameSM.checkState("RM")){
					AppLovin.redirect();
				}
			}, this);
		}, this);
		
	}, this);
	
	
	
	
};


Phaser.State.prototype.update = function(){
	this.game.time.desiredFps = Math.max(30, (1/(this.game.time.now - this.game.time.prevTime))*1000);
	AppLovin.handleOrientation(this);
	AppLovin.debugOverlay(this.game);
	Debug.update.call(this);
	
};
