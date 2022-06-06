/**
 *
 */
function AppLovin () {}

// Creates the Debug Overlay buttons
AppLovin.debugOverlay = function(gameObj){
	if((Global.debugPress.one == 1)&&(Global.debugPress.shift == 1)&&(Global.debugPress.ctrl == 1)){
		Global.debugPress.one = Global.debugPress.shift = Global.debugPress.ctrl = 2;
		// Creates the debug overlay buttons	
		var counterX = 0;
		var counterY = 0;
		var spacingX = 10;
		var spacingY = 10;
		var customBtnY = 350;
		var tempGame = gameObj;
		var i;
		var tempButton;
		var tempText;
		//checks to see if there are No GEOs first
		if(Object.keys(Global.geoDic).length === 0){
			tempButton = new debugBtn(tempGame, (102+spacingX)*counterX+51,(70+spacingY)*counterY+35);
			tempText = tempGame.add.text(10,18,"No GEOs in this playable",{"font":"30px Arial", "fill":"#ffffff"});
			tempText.fixedToCamera = true;
			tempText.anchor.setTo(0,0.5);
			tempButton.textObj = tempText;
			
			tempButton = new debugBtn(tempGame, (102+spacingX)*counterX+51,(70+spacingY)*counterY+35);
			tempText = tempGame.add.text(10,44,"webFontGEOText "+templateVersion + " "+ templateDate,{"font":"20px Arial", "fill":"#ffffff"});
			tempText.fixedToCamera = true;
			tempText.anchor.setTo(0,0.5);
			tempButton.textObj = tempText;
		}
		else{

			Object.keys(Global.geoDic).forEach(
				function(key) {
				  	// Create debug GEO buttons
					tempButton = new debugBtn(tempGame, (102+spacingX)*counterX+51,(70+spacingY)*counterY+35);
					tempGame.add.existing(tempButton);
					tempButton.tag = key;
					tempText = tempGame.add.text((102+spacingX)*counterX+51,(70+spacingY)*counterY+35,Global.geoDic[key],{"font":"bold 16px Arial","align": "center"});
					tempText.fixedToCamera = true;
					tempText.anchor.setTo(0.5);
					tempButton.textObj = tempText;
					
					// Update Counter
					counterX++;
					if(counterX>3){
						counterX = 0;
						counterY++;
					}
				}
			);
		}
		// Creates the Restart Button
		tempButton = new debugBtn(tempGame, 51,tempGame.camera.height-35);
		tempGame.add.existing(tempButton);
		tempButton.tag = "Restart";
		tempText = tempGame.add.text(51,tempGame.camera.height-35,"Restart",{"font":"bold 16px Arial","align": "center"});
		tempText.fixedToCamera = true;
		tempText.anchor.setTo(0.5);
		tempButton.textObj = tempText;
		
		// Creates Random Language Code test
		tempButton = new debugBtn(tempGame, 51,tempGame.camera.height-35-70);
		tempGame.add.existing(tempButton);
		tempButton.tag = "RandomLangTest";
		tempText = tempGame.add.text(51,tempGame.camera.height-35-70,"Random \n Lang \nTest",{"font":"bold 16px Arial","align": "center"});
		tempText.fixedToCamera = true;
		tempText.anchor.setTo(0.5);
		tempButton.textObj = tempText;
		
		tempButton = new debugBtn(tempGame, 51,tempGame.camera.height+100);
		tempGame.add.existing(tempButton);
		var tempActualLangCode = navigator.language;
		tempText = tempGame.add.text(25,tempGame.camera.height-35-70-150,"navigator.language: " + tempActualLangCode,{"font":" 16px Arial","align": "center", "fill": "#fff"});
		tempButton.textObj = tempText;
		
		tempButton = new debugBtn(tempGame, 51,tempGame.camera.height+100);
		tempGame.add.existing(tempButton);
		var tempLangCode = Global.LangCode;
		tempText = tempGame.add.text(25,tempGame.camera.height-35-70-170,"Global.LangCode: " + tempLangCode,{"font":" 16px Arial","align": "center", "fill": "#fff"});
		tempButton.textObj = tempText;
		
		
		
		// Creates the Dev Custom Buttons
		for(i = 0; i < Global.customDebugButtons.length; i++){
			tempButton = new debugBtn(tempGame, 51,(70+spacingY)*i+customBtnY);
			tempGame.add.existing(tempButton);
			tempButton.tag = Global.customDebugButtons[i];
			tempText = tempGame.add.text(51,(70+spacingY)*i+customBtnY,Global.customDebugButtons[i],{"font":"bold 16px Arial","align": "center"});
			tempText.fixedToCamera = true;
			tempText.anchor.setTo(0.5);
			tempButton.textObj = tempText;
		}
	}
	// Turns off the Debug Overlay if it's on
	else if((Global.debugPress.one == 3)&&(Global.debugPress.shift == 3)&&(Global.debugPress.ctrl == 3)){
		Global.debugPress.one = Global.debugPress.shift = Global.debugPress.ctrl = 0;
		// Destroy the Debug Buttons
		Global.ButtonObjs.forEach(function(element) {
			element.textObj.destroy();
			element.destroy();
		});
	}
};


AppLovin.handleOrientation = function(state){
    var orientation;
    if(window.innerWidth > window.innerHeight){
        orientation = "L";
    }
    else{
        orientation = "P";
    }
    
    var widthMul, heightMul;
    if(orientation == "L"){
        widthMul = 9; heightMul = 16;
    }
    else{
        widthMul = 16; heightMul = 9;
    }
    
    // exp - scale inner attempt
    var aspectRatio = window.innerHeight/window.innerWidth;
    if(window.innerHeight != Global.prevWindowHeight || window.innerWidth != Global.prevWindowWidth){
    	Global.prevWindowHeight = window.innerHeight;
    	Global.prevWindowWidth = window.innerWidth;
    	state.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	// portrait
        if(window.innerWidth<window.innerHeight  || Global.PLATFORM==PORT.FACEBOOK){
        	state.game.scale.setGameSize(Util.clamp(1138/aspectRatio, 640, 854),1138);
            Global.cameraOffsetX = (640 - state.game.width)*0.5;
            //state.game.camera.x = Global.cameraOffsetX;
        }
        // landscape
        else{
        	state.game.scale.setGameSize(1138,Util.clamp(1138*aspectRatio, 640, 854));
        	Global.cameraOffsetY = (640 - state.game.height)*0.5;
            //state.game.camera.y = Global.cameraOffsetY;
        }
        this.anchorsUpdate();
    }
    
    
    if(window.innerWidth*widthMul>window.innerHeight*heightMul){
        if(orientation == "L" && Global.currScalingMode != "SHOW_ALL"){
            state.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            state.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            Global.currScalingMode = "SHOW_ALL";
        }
        if(orientation == "P"){
            if(Global.currScalingMode != "EXACT_FIT"){
                state.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
                state.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                Global.currScalingMode = "EXACT_FIT";
            }
        }
    }
    else{
        if(orientation == "L" && Global.currScalingMode != "EXACT_FIT"){
            state.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            state.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            Global.currScalingMode = "EXACT_FIT";
        }
        if(orientation == "P"){
            if(Global.currScalingMode != "SHOW_ALL"){
                state.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                state.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
                Global.currScalingMode = "SHOW_ALL";
            }
        }
    }
    
    if(window.innerWidth<window.innerHeight || Global.PLATFORM==PORT.FACEBOOK){
    	// Portrait
    	if(Global.orientation != "p"){ 
    		console.log("orient change l->p"); 
    		Global.orientation = "p"; 
    		//state.game.scale.stopFullScreen();
    		if(Global.isSeparateOrientationState || Global.PLATFORM==PORT.FACEBOOK){
    			this.restart(state);
    		}
    		else{
    			state.onOrientationChanged();
    			Global.cameraOffsetY = 0;
    		}
    	}
    }
    else{
    	// Landscape
    	if(Global.orientation != "l"){ 
    		console.log("orient change p->l"); 
    		Global.orientation = "l"; 
    		//state.game.scale.stopFullScreen();
    		if(Global.isSeparateOrientationState){
    			this.restart(state);
    		}
    		else{
    			state.onOrientationChanged();
    			Global.cameraOffsetX = 0;
    			
    		}
    	}
    }
};


AppLovin.restart = function(state){
	state.game.destroy();
	Phaser.PIXI.WebGLGraphics.graphicsDataPool = [];
	window.onload();
};

//Helper function to convert a string to a function
//Does not use eval(), so it is faster and safer.
AppLovin.getFunctionFromString = function(string)
{
 var scope = window;
 var scopeSplit = string.split('.');
 for (var i = 0; i < scopeSplit.length - 1; i++)
 {
     scope = scope[scopeSplit[i]];

     if (scope == undefined) return;
 }

 return scope[scopeSplit[scopeSplit.length - 1]];
};

/*
* CreateParticles(key, state)
* @key is the string key of the particle json file located in pack.json
* @state is the currently active game state (generally passed along with keyword "this")
* 
* CreateParticles will load the params from the json file and create a new particle emitter with
* those parameters, taking out the work of making a particle system by hand.
* CreateParticles will not auto start the emitter/particle system, that is done
* by calling AppLovin.StartParticles
*/
AppLovin.CreateParticles = function(key, state)
{
	var jsonData = state.game.cache.getJSON(key);
	var def = "default";
	
	
	// Set the various easing variables to the correct functions.
	var alphaEase;
	var scaleEase;
	
	// set the function strings for the 2 ease functions. Pass them along with getFunctionFromString() since just strings don't work
	// with the particle functions.
	alphaEase = "Phaser.Easing." + jsonData.emitters[def].alphaEase + "." + jsonData.emitters[def].alphaEaseMode;
	scaleEase = "Phaser.Easing." + jsonData.emitters[def].scaleEase + "." + jsonData.emitters[def].scaleEaseMode;
	
	// Create the emitter and start populating the fields.
	emitter = state.game.add.emitter(jsonData.emitters[def].emitX, jsonData.emitters[def].emitY,
			jsonData.emitters[def].maxParticles);
	emitter.blendMode = jsonData.emitters[def].blendMode;

	emitter.setSize(jsonData.emitters[def].width, jsonData.emitters[def].height);
	emitter.gravity = jsonData.emitters[def].gravityY;


	// If random, we don't set the scale rate as the particles start at a random scale.
	// If not random, use the provided scale rate in jsonData.
	// Easing functions + yoyo don't apply on random either, omitted from function call.
	if(jsonData.emitters[def].randomScale == false){
		emitter.setScale(jsonData.emitters[def].scaleFromX, jsonData.emitters[def].scaleToX,
			jsonData.emitters[def].scaleFromY, jsonData.emitters[def].scaleToY,
			jsonData.emitters[def].scaleRate, this.getFunctionFromString(scaleEase),
			jsonData.emitters[def].scaleYoyo);
	}else{
		emitter.setScale(jsonData.emitters[def].scaleFromX, jsonData.emitters[def].scaleToX,
				jsonData.emitters[def].scaleFromY, jsonData.emitters[def].scaleToY, 0);
		
		// Min and Max scale must be the same for each axis with random scale, otherwise you get weird behavior
		// such as particles starting super narrow instead of balanced.
		emitter.minParticleScale = jsonData.emitters[def].minScale;
		emitter.maxParticleScale = jsonData.emitters[def].maxScale;
	}	
	
	
	emitter.setAlpha(jsonData.emitters[def].alphaMin, jsonData.emitters[def].alphaMax,
			jsonData.emitters[def].alphaRate, this.getFunctionFromString(alphaEase),
			jsonData.emitters[def].alphaYoyo);
	
	emitter.setRotation(jsonData.emitters[def].rotationMin, jsonData.emitters[def].rotationMax);
	emitter.angularDrag = jsonData.emitters[def].angularDrag;
	
	emitter.setXSpeed(jsonData.emitters[def].minSpeedX, jsonData.emitters[def].maxSpeedX);
	emitter.setYSpeed(jsonData.emitters[def].minSpeedY, jsonData.emitters[def].maxSpeedY);

	
	// Blend Mode - Since it is an enum, can use numbers from the json instead of names.
	// Most blend modes won't work (depends on what rendering engine we use), but here for completeness.
	emitter.blendMode = jsonData.emitters[def].blendMode;
	
	// Make particles makes the particles.
	// Args are: Image, frame number to use for image, quantity, collide, collideWorldBounds
	// Want to pass maxParticles instead of quantity here to allow for the 0 quanity = perpetual particles, otherwise nothing happens.
	emitter.makeParticles(jsonData.emitters[def][def], jsonData.emitters[def].frames,
			jsonData.emitters[def].maxParticles, jsonData.emitters[def].collide, jsonData.emitters[def].collideWorldBounds);
	//emitter.makeParticles(jsonData.emitters[def][def]);
	emitter.bounce = new Phaser.Point(jsonData.emitters[def].bounceX, jsonData.emitters[def].bounceY);
	
	
	if(jsonData.emitters[def].particleArguments != null && jsonData.emitters[def].particleArguments.anchor != null){
		emitter.particleAnchor = new Phaser.Point(jsonData.emitters[def].particleArguments.anchor.x, jsonData.emitters[def].particleArguments.anchor.y);
	}
	
	
	// Set values that are specific to particles and not emitters here
	// For example, x gravity and random lifespans.
	
	// set random start angle for Particles (since this is overridden by the emitter on start, do this as part of the onEmit() funciton
	// Set random start angles if needed
	if(jsonData.emitters[def].particleArguments != null && jsonData.emitters[def].particleArguments.startRotation != null){
		emitter.forEachAlive(function(particle){
		// add new field randAngle to a Particle (do this to save the current jsonData values
			particle.randAngle = (Math.random()* (jsonData.emitters[def].particleArguments.startRotation.max -
				jsonData.emitters[def].particleArguments.startRotation.min) + jsonData.emitters[def].particleArguments.startRotation.min);
			particle.onEmit = function(){
				this.angle = this.randAngle;
			};
		});
	}
	
	// Set X gravity
	emitter.setAll("body.gravity.x", jsonData.emitters[def].gravityX);
	
	// set random lifespans
	if(jsonData.emitters[def].particleArguments != null && jsonData.emitters[def].particleArguments.lifespan != null){
		// add new field randLifespan to a Particle (do this to save the current jsonData values
		emitter.forEachAlive(function(particle){
		particle.randLifespan = (Math.random()* (jsonData.emitters[def].particleArguments.lifespan.max -
			jsonData.emitters[def].particleArguments.lifespan.min) + jsonData.emitters[def].particleArguments.lifespan.min);
		particle.onEmit = function(){
			this.lifespan = this.randLifespan;
		};
	});
	}
	
	
	emitter.explode = jsonData.emitters[def].explode;
	emitter.lifespanMax = jsonData.emitters[def].particleArguments.lifespan.max;
	emitter.frequency = jsonData.emitters[def].frequency;
	emitter.quantity = jsonData.emitters[def].quantity;
	emitter.flowBool = jsonData.emitters[def].flow;
	emitter.totalFlowPart = jsonData.emitters[def].total;
	emitter.immediate = jsonData.emitters[def].immediate;
	
	// For explode and regular, regular start works. Otherwise, need flow function.
	/* Don't start right away to allow for easier edits before starting.
	if(jsonData.emitters[def].flow == false){
		if(emitter.explode == false){
			emitter.start(jsonData.emitters[def].explode, jsonData.emitters[def].particleArguments.lifespan.max,
					jsonData.emitters[def].frequency, jsonData.emitters[def].quantity);
		}
	}
	else{
		emitter.flow(jsonData.emitters[def].particleArguments.lifespan.max, jsonData.emitters[def].frequency,
				jsonData.emitters[def].quantity, jsonData.emitters[def].total, jsonData.emitters[def].immediate);
	}*/

	return emitter;
};

/**
 * StartParticles starts an emitter based on the saved values.
 * @param emit is the emitter you want to start, created by AppLovin.CreateParticles;
 * use: AppLovin.StartParticles(emitter);
 * You can still edit the emitter after it has been started.
 */
AppLovin.StartParticles = function(emit){
	if(emit.flowBool == false){
		emit.start(emit.explode, emit.lifespanMax, emit.freqeuncy, emit.quantity);
	}else{
		emit.flow(emit.lifespanMax, emit.frequency, emit.quantity, emit.totalFlowPart, emit.immediate);
	}
};

AppLovin.redirect = function()
{
	// Ironsource Mraid kept for safety.
//	if(Global.PLATFORM==PORT.IRONSOURCE){
//		// Detect platform from user agent
//		var userAgent = navigator.userAgent || navigator.vendor;
//		var url = Global.iosLink;
//		var android = Global.androidLink;
//		
//		if(Global.iosLink==null || Global.iosLink=='' || Global.androidLink==null || Global.androidLink=='')
//			console.error("App Store links missing in Global.js. Required for IronSource Port");
//		if (/android/i.test(userAgent)) {
//		   url = android;}
//			mraid.open(url);	
//	}
	if(Global.PLATFORM==PORT.IRONSOURCE){
		// Detect platform from user agent
		
		dapi.openStoreUrl();
		
//		var userAgent = navigator.userAgent || navigator.vendor;
//		var url = Global.iosLink;
//		var android = Global.androidLink;
//		
//		if(Global.iosLink==null || Global.iosLink=='' || Global.androidLink==null || Global.androidLink=='')
//			console.error("App Store links missing in Global.js. Required for IronSource Port");
//		if (/android/i.test(userAgent)) {
//		   url = android;}
//			mraid.open(url);	
	}
	else if(Global.PLATFORM==PORT.TIKTOK){
		window.playableSDK.openAppStore();
	}
	else if(Global.PLATFORM==PORT.GOOGLE){
		ExitApi.exit();
	}
	else if(Global.PLATFORM==PORT.UNITY || Global.PLATFORM == PORT.LIFTOFF){
		// Detect platform from user agent
		var userAgent = navigator.userAgent || navigator.vendor;
		if(Global.iosLink==null || Global.iosLink=='' || Global.androidLink==null || Global.androidLink=='')
			console.error("App Store links missing in Global.js. Required for Unity or Liftoff Port");
		var url = Global.iosLink;
		var android = Global.androidLink;
		if (/android/i.test(userAgent)) {
		   url = android;
		}
		mraid.open(url);	
	}
	else if(Global.PLATFORM==PORT.VUNGLE){
		parent.postMessage('download','*');
	}
	else if(Global.PLATFORM == PORT.FACEBOOK){
		FbPlayableAd.onCTAClick();
	}
	else if(Global.PLATFORM == PORT.MINTEGRAL){
		 window.install && window.install();
	}
	else{
		try{
			mraid.open("");
		}
		catch(e){
			console.log("Redirect called - mraid doesn't exist");
		}
	}
};

/////////////////////
//     ANCHOR      //
/////////////////////

/**
 * Used when wanting to anchor a fixedToCamera entity, or when want to reanchor an already anchored object differently (like on 1-state orient change)
 * Sample use
 * AppLovin.anchorAdd(this.fCTA, Anchor.H_RIGHT, Anchor.V_BOTTOM);  // anchor CTA to bottom right
 *  
 * @param aSprite 		- the entity we want to anchor. Can be sprite, text, group, not only sprite
 * @param aHorizAnchor 	- the Anchor.H_*** Enum to specifiy how it's anchored horizontally 
 * @param aVertAnchor	- the Anchor.V_*** Enum to specifiy how it's anchored horizontally
 * @param aNewX			- optional - new camera offset X can be specified with this same call, useful if you move and re-anchor due to 1 state orient change
 * @param aNewY			- optional - see above, but for Y
 * @param aPercentX		- optional - percentage of the horizontal offset to apply to anchored entity
 * @param aPercentY		- optional - percentage of the vertical offset to apply to anchored entity
 */
AppLovin.anchorAdd = function(aSprite, aHorizAnchor, aVertAnchor, aNewX, aNewY, aPercentX, aPercentY){
	if(!Global.anchoredObjects.includes(aSprite)){
		Global.anchoredObjects.push(aSprite);
	}
	if(!aSprite.fixedToCamera){ 
		console.warn("Attempting to anchor object: "+ aSprite.name + " that is not fixed to camera. Enabling fixedToCamera now.");
		console.log(aSprite);
		aSprite.fixedToCamera = true;
	}
	
	if(aNewX != undefined){ aSprite.cameraOffset.x = aNewX; }
	if(aNewY != undefined){ aSprite.cameraOffset.y = aNewY; }
	
	if(aHorizAnchor != undefined){
		aSprite.anchorH = aHorizAnchor;
		aSprite.camOffsetInitX = aSprite.cameraOffset.x;
		aSprite.anchorIsActive = true;
		aSprite.anchorPercentX = Util.clamp((aPercentX != null) ? aPercentX : 1, 0, 1);
	}
	else{
		console.error("Undefined value for horizontal anchor for object " + aSprite.name);
	}
	if(aVertAnchor != undefined){
		aSprite.anchorV = aVertAnchor;
		aSprite.camOffsetInitY = aSprite.cameraOffset.y;
		aSprite.anchorIsActive = true;
		aSprite.anchorPercentY = Util.clamp((aPercentY != null) ? aPercentY : 1, 0, 1);
	}
	else{
		console.error("Undefined value for vertical anchor for object " + aSprite.name);
	}
	//console.log("added");
	
	AppLovin.anchorsUpdate();
};
/**
 * Removes the entity from the anchor-managed array entirely 
 * 
 * @param aSprite - sprite, group, text to remove anchor from
 */
AppLovin.anchorRemove = function(aSprite){
	if(Global.anchoredObjects.includes(aSprite)){
		Global.anchoredObjects = Util.arrayRemove(Global.anchoredObjects, aSprite);
		aSprite.anchorH = null;
		aSprite.anchorV = null;
	}
	else{
		console.warn("Attempted to remove anchor from entity that wasn't anchored:");
		console.log(aSprite);
	}
};

/**
 * The main function that handles the positions of anchored objects. This is only called when necessary (aspect ratio change, or anchor changes), not per frame.
 * This should not be needed to be called manually at any point 
 */
AppLovin.anchorsUpdate = function(){
	Global.anchoredObjects.forEach(function(item){
		//console.log("hello");
		// Horizontal
		if(item.anchorIsActive){
			if(item.anchorH == Anchor.H_RIGHT){
				item.cameraOffset.x = item.camOffsetInitX-(Global.cameraOffsetX+Global.cameraOffsetX*item.anchorPercentX);
			}
			else if(item.anchorH == Anchor.H_NONE){
				item.cameraOffset.x = item.camOffsetInitX-(Global.cameraOffsetX);
			}
			else if(item.anchorH == Anchor.H_LEFT){
				item.cameraOffset.x = item.camOffsetInitX-(Global.cameraOffsetX)*(1-item.anchorPercentX);
			}
			
			// Vertical
			if(item.anchorV == Anchor.V_BOTTOM){
				item.cameraOffset.y = item.camOffsetInitY-(Global.cameraOffsetY+Global.cameraOffsetY*item.anchorPercentY);
			}
			else if(item.anchorV == Anchor.V_NONE){
				item.cameraOffset.y = item.camOffsetInitY-(Global.cameraOffsetY);
			}
			else if(item.anchorV == Anchor.V_TOP){
				item.cameraOffset.y = item.camOffsetInitY-(Global.cameraOffsetY)*(1-item.anchorPercentY);
			}
		}
	});
};

/**
 * Allows to pause anchor management from an entity. Useful when you want to move/tween an anchored object, and want to keep it anchored.
 * Moving an achored entity while it's actively anchored is not safe, so the use-case would be: Pause anchor -> do movements -> Resume anchor
 * 
 * @param aSprite - entity to temporarily pause anchor handling
 */
AppLovin.anchorPause = function(aSprite){
	if(!Global.anchoredObjects.includes(aSprite)){
		console.warn("Attempting to pause anchor on a non-anchored object: ");
		console.log(aSprite);
	}
	else{
		aSprite.anchorIsActive = false;
	}
};

/**
 * Resuming Anchor. See anchorPause for context
 * 
 * @param aSprite - entity to resume anchor handling on
 */
AppLovin.anchorResume = function(aSprite){
	if(!Global.anchoredObjects.includes(aSprite)){
		console.warn("Attempting to Resume anchor on a non-anchored object: ");
		console.log(aSprite);
	}
	else if(aSprite.anchorIsActive){
		console.warn("Attempting to Resume anchor on an anchored, but not anchor-paused object: ");
		console.log(aSprite);
	}
	else{
		aSprite.anchorIsActive = true;
		var item = aSprite;
		if(item.anchorH == Anchor.H_RIGHT){
			item.cameraOffset.x = item.camOffsetInitX-(Global.cameraOffsetX+Global.cameraOffsetX*item.anchorPercentX);
		}
		else if(item.anchorH == Anchor.H_NONE){
			item.cameraOffset.x = item.camOffsetInitX-(Global.cameraOffsetX);
		}
		else if(item.anchorH == Anchor.H_LEFT){
			item.cameraOffset.x = item.camOffsetInitX-(Global.cameraOffsetX)*(1-item.anchorPercentX);
		}
//		Vertical
		if(item.anchorV == Anchor.V_BOTTOM){
			item.cameraOffset.y = item.camOffsetInitY-(Global.cameraOffsetY+Global.cameraOffsetY*item.anchorPercentY);
		}
		else if(item.anchorV == Anchor.V_NONE){
			item.cameraOffset.y = item.camOffsetInitY-(Global.cameraOffsetY);
		}
		else if(item.anchorV == Anchor.V_TOP){
			item.cameraOffset.y = item.camOffsetInitY-(Global.cameraOffsetY)*(1-item.anchorPercentY);
		}
		AppLovin.anchorsUpdate();
	}
};

/**
 * Due to how camera is handled in Phaser every fixedToCamera entity will by default behave as if it was anchored to top left.
 * Adding an anchor-ed object with no horizontal and vertical anchoring specified actually does work to counteract the default behavior.
 * 
 * The intended use-case of this function is to be called at the end of after-create after all initial anchoring has been set, and this
 * will manually loop through every non-anchored fixedToCamera object, and will make them anchored w/ H_NONE, V_NONE alignments to counteract
 * the default top-left anchor behavior
 * 
 * @param state - state context
 */
AppLovin.anchorInitFixedCamera = function(state){
	state.game.world.forEach(function(item){
		if(item.fixedToCamera && !Global.anchoredObjects.includes(item)){
			AppLovin.anchorAdd(item, Anchor.H_NONE, Anchor.V_NONE);
		}
	});
};

AppLovin.playableBegin = function(){
	if(Global.PLATFORM==PORT.MINTEGRAL)
		window.gameReady && window.gameReady();
};

AppLovin.playableComplete = function(){
	if(Global.PLATFORM==PORT.VUNGLE)
		parent.postMessage('complete','*');
	else if(Global.PLATFORM==PORT.MINTEGRAL)
		window.gameEnd && window.gameEnd(); 
};