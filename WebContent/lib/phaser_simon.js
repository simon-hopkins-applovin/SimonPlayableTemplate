//https://patorjk.com/software/taag/#p=display&f=Big&t=Graphics

//   _____ _        _       
//  / ____| |      | |      
// | (___ | |_ __ _| |_ ___ 
//  \___ \| __/ _` | __/ _ \
//  ____) | || (_| | ||  __/
// |_____/ \__\__,_|\__\___|
//                          


Phaser.State.prototype.getMousePos = function(){
	return new Phaser.Point(this.game.input.activePointer.x + Global.cameraOffsetX, this.game.input.activePointer.y + Global.cameraOffsetY);
};


//  _____  _           _                ____  _     _           _   
// |  __ \(_)         | |              / __ \| |   (_)         | |  
// | |  | |_ ___ _ __ | | __ _ _   _  | |  | | |__  _  ___  ___| |_ 
// | |  | | / __| '_ \| |/ _` | | | | | |  | | '_ \| |/ _ \/ __| __|
// | |__| | \__ \ |_) | | (_| | |_| | | |__| | |_) | |  __/ (__| |_ 
// |_____/|_|___/ .__/|_|\__,_|\__, |  \____/|_.__/| |\___|\___|\__|
//              | |             __/ |             _/ |              
//              |_|            |___/             |__/               
PIXI.DisplayObject.prototype.createCTA= function(doScale, touchCondition, hAnchor, vAnchor){
	if(!AppLovin){
		console.error("AppLovin is not defined");
		return;
	}
	touchCondition = touchCondition==undefined?function(){return true;}:touchCondition;
	hAnchor = hAnchor==undefined?Anchor.H_NONE: hAnchor;
	vAnchor = vAnchor==undefined?Anchor.V_NONE: vAnchor;
	var touchObj = null;
	if(this.children.length>0){
		touchObj = this.getChildAt(0);
	}else{
		touchObj = this;
	}
	AppLovin.anchorAdd(this, hAnchor, vAnchor, this.x, this.y);
	touchObj.inputEnabled = true;
	touchObj.events.onInputDown.add(function(){
		if(touchCondition.call(this)){
			AppLovin.redirect();
		}
	}, this);
	this.getCTABounds = function(){
		return new Phaser.Rectangle().copyFrom(this, true);
	};
	if(doScale){
		this.ctaScaleTween = this.game.add.tween(this.scale).to({x: "0.1", y: "0.1"}, 420, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
	}
};

PIXI.DisplayObject.prototype.resizeWithWidth= function(newWidth){
	var scaleMod = this.scale.clone().divide(Math.abs(this.scale.x), Math.abs(this.scale.y));	
	this.scale.setTo(1);
	var factor = newWidth/this.width;
	this.scale.setTo(this.scale.x * factor);
	this.scale.multiply(scaleMod.x,scaleMod.y);
	return this;
};

PIXI.DisplayObject.prototype.resizeWithHeight= function(newHeight){
	var scaleMod = this.scale.clone().divide(Math.abs(this.scale.x), Math.abs(this.scale.y));
	this.scale.setTo(1);
	var factor = newHeight/this.height;
	this.scale.setTo(this.scale.y * factor);
	this.scale.multiply(scaleMod.x,scaleMod.y);
	return this;
};

PIXI.DisplayObject.prototype.resizeInRect= function(rect){
	this.scale.setTo(1);
	if(rect.width/this.width<= rect.height/this.height){
		this.resizeWithWidth(rect.width);
	}else{
		this.resizeWithHeight(rect.height);
	}
	return this;
};

PIXI.DisplayObject.prototype.getWorldPos = function(){
	var retPoint = this.parent.worldTransform.apply(this.position);
	retPoint = this.game.world.worldTransform.applyInverse(retPoint);
	return retPoint;
};

//  _____                 _     _          
// / ____|               | |   (_)         
//| |  __ _ __ __ _ _ __ | |__  _  ___ ___ 
//| | |_ | '__/ _` | '_ \| '_ \| |/ __/ __|
//| |__| | | | (_| | |_) | | | | | (__\__ \
// \_____|_|  \__,_| .__/|_| |_|_|\___|___/
//                | |                     
//                |_|                     
Phaser.Graphics.prototype.drawLine = function(line){
	this.moveTo(line.start.x, line.start.y);
	this.lineTo(line.end.x, line.end.y);
};


// _____           _                    _      
//|  __ \         | |                  | |     
//| |__) |___  ___| |_ __ _ _ __   __ _| | ___ 
//|  _  // _ \/ __| __/ _` | '_ \ / _` | |/ _ \
//| | \ \  __/ (__| || (_| | | | | (_| | |  __/
//|_|  \_\___|\___|\__\__,_|_| |_|\__, |_|\___|
//                                 __/ |       
//                                |___/        

Phaser.Rectangle.prototype.divideRect= function(numSegs, isVert, isFlush){
	isVert = isVert==undefined?false:isVert;
	isFlush = isFlush==undefined?false:isFlush;
	var retArr = [];
	for(var i = 0; i< numSegs; i++){
		var l = new Phaser.Line();
		var theta = isFlush?i/numSegs:(i+0.5)/numSegs;
		if(isVert){
			var x = Phaser.Math.linear(this.left, this.right, theta);
			l.setTo(0,0,0,this.height);
			l.centerOn(x, this.centerY);
		}else{
			var y = Phaser.Math.linear(this.top, this.bottom, theta);
			l.setTo(0,0,this.width, 0);
			l.centerOn(this.centerX, y);
		}
		retArr.push(l);
	};
	if(isFlush){
		if(isVert){
			retArr.push(new Phaser.Line(this.right, this.top, this.right, this.bottom));
		}else{
			retArr.push(new Phaser.Line(this.left, this.bottom, this.right, this.bottom));
		}
	}
	return retArr;
},

Phaser.Rectangle.prototype.getLerpPoint= function(xTheta, yTheta){
	return new Phaser.Point(Phaser.Math.linear(this.left, this.right, xTheta), Phaser.Math.linear(this.top, this.bottom, yTheta));
};


Phaser.Rectangle.prototype.copyFrom = function (source, center) {
	if(center){
		return this.setTo(source.x, source.y, source.width, source.height).centerOn(source.centerX, source.centerY);
	}
    return this.setTo(source.x, source.y, source.width, source.height);

};

Phaser.Rectangle.prototype.forEachGridPoint = function(rows, cols, isSquare, callback){
	var gridRect = isSquare?new Phaser.Rectangle(this.x, this.y, this.width, (this.width/cols) * rows) :this;
	var cellBounds = new Phaser.Rectangle(0, 0, gridRect.width/cols, gridRect.height/rows);
	for(var row = 0; row< rows; row++){
		for(var col = 0; col< cols; col++){
			
			var xPos = Phaser.Math.linear(gridRect.left, gridRect.right, (0.5 + col)/cols);
			var yPos = Phaser.Math.linear(gridRect.top, gridRect.bottom, (0.5 + row)/rows);
			callback.call(this, xPos, yPos, row, col, cellBounds.clone().centerOn(xPos, yPos));
		}
	}
};

//
//_____      _                         
//|  __ \    | |                        
//| |__) |__ | |_   _  __ _  ___  _ __  
//|  ___/ _ \| | | | |/ _` |/ _ \| '_ \ 
//| |  | (_) | | |_| | (_| | (_) | | | |
//|_|   \___/|_|\__, |\__, |\___/|_| |_|
//               __/ | __/ |            
//              |___/ |___/             

Phaser.Polygon.prototype.rotateAround = function(x, y, angle){
	
	this.points.forEach(function(p){
		p = p.rotate(x, y, angle, true);
	}, this);
	this.setTo(this.points);
	return this;
	
};


// _      _            
//| |    (_)           
//| |     _ _ __   ___ 
//| |    | | '_ \ / _ \
//| |____| | | | |  __/
//|______|_|_| |_|\___|   
                     
Phaser.Line.prototype.setLength= function (newLength) {

	var center = this.midPoint();
	this.fromAngle(0,0, this.angle, newLength);
	this.centerOn(center.x, center.y);

};

Phaser.Line.prototype.interpolate = function (t, out) {

	if (out === undefined) { out = new Phaser.Point(); }
	out.setTo(
			Phaser.Math.linear(this.start.x, this.end.x, t),
			Phaser.Math.linear(this.start.y, this.end.y, t)
	);
    return out;

};


//  _____            _ _       
// / ____|          (_) |      
//| (___  _ __  _ __ _| |_ ___ 
//\ ___ \| '_ \| '__| | __/ _ \
// ____) | |_) | |  | | ||  __/
//|_____/| .__/|_|  |_|\__\___|
//       | |                   
//       |_|                   

Phaser.Sprite.prototype.setAnchor= function (xAnchor, yAnchor) {

	this.anchor.setTo(xAnchor, yAnchor?yAnchor:xAnchor);
	return this;

};


//  _____                       ____  _     _           _     ______         _                   
// / ____|                     / __ \| |   (_)         | |   |  ____|       | |                  
//| |  __  __ _ _ __ ___   ___| |  | | |__  _  ___  ___| |_  | |__ __ _  ___| |_ ___  _ __ _   _ 
//| | |_ |/ _` | '_ ` _ \ / _ \ |  | | '_ \| |/ _ \/ __| __| |  __/ _` |/ __| __/ _ \| '__| | | |
//| |__| | (_| | | | | | |  __/ |__| | |_) | |  __/ (__| |_  | | | (_| | (__| || (_) | |  | |_| |
// \_____|\__,_|_| |_| |_|\___|\____/|_.__/| |\___|\___|\__| |_|  \__,_|\___|\__\___/|_|   \__, |
//                                        _/ |                                              __/ |
//                                       |__/                                              |___/ 

Phaser.GameObjectFactory.prototype.sprite = function(x, y, key, frame, group, anchorX, anchorY){
	if (group === undefined) { group = this.world; }
	var g = group.create(x, y, key, frame);
	g.anchor.setTo(anchorX==undefined?0:anchorX, anchorY==undefined?0:anchorY);
    return g;
}

