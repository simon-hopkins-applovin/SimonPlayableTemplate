/**
 *
 */
function DebugObj () {
	this.isInitialized	= false;
	this.isActive 		= false;
	this.isKeysHeld 	= false;
	this.watchList		= [];
	this.g_debug		= "";
	this.watchMap		= [];
	
	// panel calculation
	this.watchLines		= 0;
	this.watchWidth		= 0;
	this.gameState		= null;
	this.mouseWheelDir	= 0;
	
	this.baseTextColors = ["#ffffff", "#00ff00", "#ff00ff"];
	this.currColorId	= 0;
	
	this.isHelpActive	= false;
	this.isInputExtActive	= false;
	
	this.objectCount	= 0;
}

DebugObj.prototype.init = function(state){
	// only on Desktop
	if(state.game.device.iOS || state.game.device.android || (!state.game.device.desktop)){
		return;
	}
	// disable right click menu so we can use right click
	state.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
	
	this.isInitialized = true;
	this.gameState = state;
	this.g_debug = state.game.add.group();
	//Debug.g_debug.bringToTop();
	//this.camAnchor = this.add.sprite(16, 60, "debugBtn");
	this.camAnchor = this.g_debug.create(16, 60, "debugBtn");
	this.camAnchor.scale.setTo(0.3,0.3);
	this.camAnchor.inputEnabled = true;
	this.camAnchor.input.enableDrag();
	this.camAnchor.fixedToCamera = true;
	this.camAnchor.setScaleMinMax(this.camAnchor.scale.x, this.camAnchor.scale.y);
	this.camAnchor.isActive = true;
	
	// watch anchor
	this.watchAnchor = this.g_debug.create(16, 300, "debugBtn");
	this.watchAnchor.scale.setTo(0.3,0.3);
	this.watchAnchor.inputEnabled = true;
	this.watchAnchor.input.enableDrag();
	this.watchAnchor.fixedToCamera = true;
	this.watchAnchor.setScaleMinMax(this.watchAnchor.scale.x, this.watchAnchor.scale.y);
	this.watchAnchor.isActive = true;
	
	// input anchor
	this.inputAnchor = this.g_debug.create(16, 180, "debugBtn");
	this.inputAnchor.scale.setTo(0.3,0.3);
	this.inputAnchor.inputEnabled = true;
	this.inputAnchor.input.enableDrag();
	this.inputAnchor.fixedToCamera = true;
	this.inputAnchor.setScaleMinMax(this.inputAnchor.scale.x, this.inputAnchor.scale.y);
	this.inputAnchor.isActive = true;
	
	// FPS
	state.game.time.advancedTiming 	= true;
	state.game.clearBeforeRender 	= true;
	
	// Color cycle
	cycleKey = state.game.input.keyboard.addKey(Phaser.Keyboard.C);
	cycleKey.onDown.add(this.cycleTextColor, state);
	
	// Help toggle
	helpKey = state.game.input.keyboard.addKey(Phaser.Keyboard.H);
	helpKey.onDown.add(this.helpToggle, state);
	
	// Extended input info toggle
	inputKey = state.game.input.keyboard.addKey(Phaser.Keyboard.I);
	inputKey.onDown.add(this.inputToggle, state);
	
	
	this.anchors = [this.camAnchor, this.watchAnchor, this.inputAnchor];
	
	// Anchor toggles
	for(var i = 0; i < this.anchors.length; i++){
		this.anchors[i].inputEnabled = true;
		this.anchors[i].events.onInputDown.add(this.anchorToggle, this, null, this.anchors[i], state);
	}
	/*this.camAnchor.inputEnabled = true;
	this.camAnchor.events.onInputDown.add(this.anchorToggle, this, "camAnchor", this.camAnchor, state);*/
	
	/*
	//state.game.input.mouse.mouseWheelCallback = this.mouseZoom;
	state.game.input.mouse.mouseWheelCallback = function(){
		
		this.mouseWheelDir	= state.game.input.mouse.wheelDelta;
		console.log(this.mouseWheelDir);
		//this.mouseZoom(state);
	};
	console.log(this.mouseWheelDir);
	*/
	
	Debug.setActive(false);
};

DebugObj.prototype.watch = function(label, val1, val2, val3, val4, val5, val6){
	if(this.isActive){
	
		if(!this.watchList.includes(label)){
			this.watchList.push(label);
		}
		
		this.watchMap[label] = [val1,val2,val3,val4,val5,val6];
	}
};

DebugObj.prototype.setActive = function(state){
	//console.log("hello");
	this.isActive = state;
	console.log(this.isActive);
	if(!this.isActive){
		this.g_debug.visible = false;
	}
	else{
		this.g_debug.visible = true;
	}
};

DebugObj.prototype.update = function(){
	// On/Off toggle
	/*if( this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL) &&
		this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) &&
		this.game.input.keyboard.isDown(Phaser.Keyboard.THREE))*/
	if(this.game.input != null && this.game.input.keyboard.isDown(Phaser.Keyboard.TILDE))
	{
		if(!Debug.isKeysHeld){
			if(!Debug.isInitialized){
				Debug.init(this);
			}
			Debug.setActive(!Debug.isActive);
			Debug.isKeysHeld = true;
			
			if(!Debug.isActive){
				// needed to clear off debug after being turned off
				this.game.debug.reset();
			}
		}
	}
	else if(Debug.isKeysHeld){
		Debug.isKeysHeld = false;
	}
	
	// Camera Control
	//this.fCamera.x = 600;
	// position
	if(Debug.isActive){
		var moveSpeed = 7;
		var speedMul = 1;
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))	{ speedMul = 2; }
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)){ speedMul = 0.2; }
		
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			this.fCamera.y -= (moveSpeed*speedMul)/this.game.camera.scale.x;
		}
		else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			this.fCamera.y += (moveSpeed*speedMul)/this.game.camera.scale.x;
		}
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			this.fCamera.x -= (moveSpeed*speedMul)/this.game.camera.scale.x;
		}
		else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			this.fCamera.x += (moveSpeed*speedMul)/this.game.camera.scale.x;
		}
		// zoom
		var zoomMul = 1;
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))	{ zoomMul = 2; }
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)){ zoomMul = 0.2; }
		
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.game.camera.scale.x *= 1 + (0.02 * zoomMul);
			this.game.camera.scale.y *= 1 + (0.02 * zoomMul);
		}
		else if(this.game.input.keyboard.isDown(Phaser.Keyboard.Z)){
			this.game.camera.scale.x *= 1 - (0.02 * zoomMul);
			this.game.camera.scale.y *= 1 - (0.02 * zoomMul);
		}
		// reset zoom to 1
		else if(this.game.input.keyboard.isDown(Phaser.Keyboard.X)){
			this.game.camera.scale.x = 1;
			this.game.camera.scale.y = 1;
		}
		// zoom - mouse
		/*
		console.log(this.mouseWheelDir);
		if(this.mouseWheelDir != 0){
			console.log("hey2");
			console.log("dir: " + this.mouseWheelDir);
			if(this.mouseWheelDir == Phaser.Mouse.WHEEL_UP) {
				console.log("hey2a");
				this.game.camera.scale.x *= 1.02;
				this.game.camera.scale.y *= 1.02;
			}
			else if(this.mouseWheelDir == Phaser.Mouse.WHEEL_DOWN) {
				console.log("hey2b");
				this.game.camera.scale.x *= 0.98;
				this.game.camera.scale.y *= 0.98;
			}
			this.mouseWheelDir = 0;
		}
		*/
		Debug.objectCount = Debug.countObjects(this, this.game.world, 0);
	}
	
};

DebugObj.prototype.countObjects = function(state, group, currCount){
	var i = currCount;
	group.forEach(function(item){
		if(item instanceof Phaser.Group){
			i = Debug.countObjects(this, item, i);
			//console.log("after group i: " + i);
		}
		else{
			i++;
		}
	});
	//console.log("returning: " + i);
	return i;
};

DebugObj.prototype.render = function(state){
	if(this.isActive){
		// bleed indicators
		if(Global.orientation == 'p'){
			var bleedLeftRect 	= new Phaser.Rectangle( state.game.camera.x-((854-state.game.camera.width)*0.5), state.game.camera.y, 214*0.5, 1138);
			var bleedRightRect 	= new Phaser.Rectangle( state.game.camera.x-((854-state.game.camera.width)*0.5)+640+214*0.5, state.game.camera.y, 214*0.5, 1138);
			state.game.debug.geom( bleedLeftRect, 'rgba(255,0,0,0.15)' );
			state.game.debug.geom( bleedRightRect, 'rgba(255,0,0,0.15)' );
		}
		else{
			var bleedTopRect 	= new Phaser.Rectangle( state.game.camera.x, state.game.camera.y-((854-state.game.camera.height)*0.5), 1138, 214*0.5);
			var bleedBtmRect 	= new Phaser.Rectangle( state.game.camera.x, state.game.camera.y-((854-state.game.camera.height)*0.5)+640+214*0.5, 1138, 214*0.5);
			state.game.debug.geom( bleedTopRect, 'rgba(255,0,0,0.15)' );
			state.game.debug.geom( bleedBtmRect, 'rgba(255,0,0,0.15)' );
		}
		
		// cam target
		var camTargetLen = 40;
		var camTargetThickness = 2;
		var camTargetHorizRect	= new Phaser.Rectangle( (state.game.camera.x+state.game.camera.width*0.5)-(camTargetLen*0.5), (state.game.camera.y+state.game.camera.height*0.5)-(camTargetThickness*0.5), camTargetLen, camTargetThickness);
		var camTargetVertRect	= new Phaser.Rectangle( (state.game.camera.x+state.game.camera.width*0.5)-(camTargetThickness*0.5), (state.game.camera.y+state.game.camera.height*0.5)-(camTargetLen*0.5), camTargetThickness, camTargetLen);
		state.game.debug.geom( camTargetHorizRect, 'rgba(255,0,0,0.25)' );
		state.game.debug.geom( camTargetVertRect, 'rgba(255,0,0,0.25)' );
		
		// 640 square - see if a scene will fit both orientations w/ the same camera scale
		if(Global.orientation == 'p'){
			var sq640BtmRect	= new Phaser.Rectangle( state.game.camera.x-((640-state.game.camera.width)*0.5), (state.game.camera.y+state.game.camera.height*0.5)+(640*0.5), 640, 10);
			var sq640TopRect	= new Phaser.Rectangle( state.game.camera.x-((640-state.game.camera.width)*0.5), (state.game.camera.y+state.game.camera.height*0.5)-(640*0.5), 640, 10);
			state.game.debug.geom( sq640BtmRect, 'rgba(255,0,0,0.15)' );
			state.game.debug.geom( sq640TopRect, 'rgba(255,0,0,0.15)' );
		}
		else{
			var sq640LeftRect	= new Phaser.Rectangle( state.game.camera.x+((state.game.camera.width)*0.5)+(640*0.5), state.game.camera.y-(640-state.game.camera.height)*0.5, 10, 640);
			var sq640RightRect	= new Phaser.Rectangle( state.game.camera.x+((state.game.camera.width)*0.5)-(640*0.5), state.game.camera.y-(640-state.game.camera.height)*0.5, 10, 640);
			state.game.debug.geom( sq640LeftRect, 'rgba(255,0,0,0.15)' );
			state.game.debug.geom( sq640RightRect, 'rgba(255,0,0,0.15)' );
		}
		
		// Camera info
		if(this.camAnchor.isActive){
			var camX = this.camAnchor.cameraOffset.x;
			var camY = this.camAnchor.cameraOffset.y;
			//var camBgWidth 	= 412;
			//var camBgHeight = 112;
			var camBgWidthMin = 242; // min - only fcam
			var camBgHeightMin= 44;
			var camBgRect = new Phaser.Rectangle( state.game.camera.x+camX-8, state.game.camera.y+camY-8, camBgWidthMin, camBgHeightMin);
			state.game.debug.geom( camBgRect, 'rgba(50,50,50,0.5)' );
			
			state.game.debug.cameraInfo(state.game.camera, this.camAnchor.cameraOffset.x, this.camAnchor.cameraOffset.y+50,this.baseTextColors[this.currColorId]);
			//state.game.debug.text("camScale: " + state.game.camera.scale.x.toFixed(3), this.camAnchor.cameraOffset.x + 40 , this.camAnchor.cameraOffset.y+10,this.baseTextColors[this.currColorId]);
			state.game.debug.text("camScale: ", this.camAnchor.cameraOffset.x + 40 , this.camAnchor.cameraOffset.y+10,this.baseTextColors[this.currColorId]);
			state.game.debug.text("          " + state.game.camera.scale.x.toFixed(3), this.camAnchor.cameraOffset.x + 40 , this.camAnchor.cameraOffset.y+10,"#ff0000");
			//state.game.debug.text("fCam x: " + Math.round(state.fCamera.x) + " y: " + Math.round(state.fCamera.y), this.camAnchor.cameraOffset.x + 40 , this.camAnchor.cameraOffset.y+30,this.baseTextColors[this.currColorId]);
			state.game.debug.text("fCam x: " , this.camAnchor.cameraOffset.x + 40 , this.camAnchor.cameraOffset.y+30,this.baseTextColors[this.currColorId]);
			state.game.debug.text("        " + Math.round(state.fCamera.x), this.camAnchor.cameraOffset.x + 40 , this.camAnchor.cameraOffset.y+30,"#ff0000");
			state.game.debug.text("y: ", this.camAnchor.cameraOffset.x + 40 + 125, this.camAnchor.cameraOffset.y+30,this.baseTextColors[this.currColorId]);
			state.game.debug.text("   " + Math.round(state.fCamera.y), this.camAnchor.cameraOffset.x + 40 + 125, this.camAnchor.cameraOffset.y+30,"#ff0000");
		}
		else{
			state.game.debug.text("Camera", this.camAnchor.cameraOffset.x+40, this.camAnchor.cameraOffset.y+15);
		}
		
		state.game.debug.text('FPS: ' + state.game.time.fps || 'FPS: --', 16, 40, "#00ff00");
		state.game.debug.text('ObjectCount: ' + Debug.objectCount || 'ObjectCount: --', 100, 40, "#00ff00");
		if(this.inputAnchor.isActive){
			state.game.debug.inputInfo(this.inputAnchor.cameraOffset.x,this.inputAnchor.cameraOffset.y+35, this.baseTextColors[this.currColorId]);
		}
		else{
			state.game.debug.text("Input", this.inputAnchor.cameraOffset.x+40, this.inputAnchor.cameraOffset.y+15);
		}
		if(this.isInputExtActive){
			state.game.debug.pointer( state.game.input.activePointer );
		}
		// this.game.debug.spriteInputInfo(sprite, x, y, color)
		//geom(object, color, filled) // background panels?
		//state.game.debug.spriteBounds(state.fCTA);
		
		// Help
		if(this.isHelpActive){
			var tx = state.game.camera.width-600;
			var ty = 50;
			var lineHeight = 15;
						
			var helpText = ["~ (tilde) - Toggle debug overlay",
						   "H - Toggle help (this panel)",
						   "I - input pointer debug toggle",
						   " ",
						   "Anchors",
						   "Draggable, right click to toggle hide/show",
						   " ",
						   "Camera Controls",
						   "Directional Buttons - move fCamera",
						   "A/Z - Zoom In/Out (increase/decrease camera scale)",
						   "Ctrl (hold) - decreases camera move/zoom speed if held",
						   "Shift (hold) - increases camera move/zoom speed if held",
						   "X - reset camera scale to 1.0",
						   "C - cycle default debug text color"];
			
			var helpRect = new Phaser.Rectangle(state.game.camera.x+tx-15, state.game.camera.y+ty-15, 560, (helpText.length+1)*lineHeight);
			state.game.debug.geom( helpRect, 'rgba(80,80,80,0.75)' );
			
			for(var i = 0; i < helpText.length; i++){
				state.game.debug.text(helpText[i],tx,ty+(i*lineHeight));
			}
				
		}
		if(this.watchAnchor.isActive){
			this.renderWatch(state, this.watchAnchor.cameraOffset.x, this.watchAnchor.cameraOffset.y+40);
		}
		else{
			state.game.debug.text("Watch", this.watchAnchor.cameraOffset.x+40, this.watchAnchor.cameraOffset.y+15);
		}
	}
};

DebugObj.prototype.renderWatch = function(state,tX,tY){
	var lineHeight = 20;
	var labelWidth = 105;
	var charWidth = 9.5;
	var currLine = 0;
	var wmap = this.watchMap;
	var obj = this;	// ghetto
	
	// Calculate bg rect dimenstion
	var bgHeight 	= this.watchLines * lineHeight + (18*2);
	var bgWidth		= labelWidth + this.watchWidth*charWidth+(8*2);
	
	var rect = new Phaser.Rectangle( state.game.camera.x+tX-8, state.game.camera.y+tY-18, bgWidth, bgHeight);
	state.game.debug.geom( rect, 'rgba(50,50,50,0.5)' );
	var maxValueLength = 0; 
	this.watchList.forEach(function(watchItem){
		state.game.debug.text(watchItem, tX, tY + currLine*lineHeight, obj.baseTextColors[obj.currColorId]);
		//state.game.debug.text( "This is debug text", 120, 120 );
		// If one item has multiple values draw them in new lines
		wmap[watchItem].forEach(function(subValue){
			var printVal = subValue;
			if(subValue != undefined){
				if(!isNaN(subValue)){
					if(subValue % 1 != 0){
						printVal = subValue.toPrecision(6);
					}
					else{
						printVal = subValue;
					}
				}
				var col = "#ff0000";	// float color
				if(Number.isInteger(printVal))		{ col = "#ff00ff"; }
				else if(typeof printVal === 'string' && isNaN(printVal)){col = "#ff7700"; }
				if(printVal.length > maxValueLength){ maxValueLength = printVal.length; }
				state.game.debug.text(printVal, tX+labelWidth, tY + currLine*lineHeight, col);
				currLine++;
			}
		});
		// TODO - compact setting where there's no newline here
		//currLine++;
	});
	this.watchLines = currLine-1;
	this.watchWidth = maxValueLength;
	//console.log(this.watchWidth);
	//console.log(wmap["time"][0]);
};

DebugObj.prototype.cycleTextColor = function(){
	if(Debug.isActive){
		Debug.currColorId = (Debug.currColorId+1)%Debug.baseTextColors.length;
	}
};

DebugObj.prototype.helpToggle = function(){
	if(Debug.isActive){
		Debug.isHelpActive = !Debug.isHelpActive;
	}
};

DebugObj.prototype.inputToggle = function(){
	if(Debug.isActive){
		Debug.isInputExtActive = !Debug.isInputExtActive;
	}
};

DebugObj.prototype.anchorToggle = function(func, context, anchorObj, state){
	if(state.game.input.activePointer.rightButton.isDown){
		anchorObj.isActive = !anchorObj.isActive;
	}
};