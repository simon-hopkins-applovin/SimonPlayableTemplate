
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.4 (Phaser v2.6.2)


/**
 * WordleLetterCell.
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Phaser.Group} aParent The parent Group (or other {@link DisplayObject}) that this group will be added to.
 * @param {string} aName A name for this group. Not used internally but useful for debugging.
 * @param {boolean} aAddToStage If true this group will be added directly to the Game.Stage instead of Game.World.
 * @param {boolean} aEnableBody If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
 * @param {number} aPhysicsBodyType The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
 */
function WordleLetterCell(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
	
	Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
	var __emptySprite = this.game.add.sprite(0.0, 0.0, 'wordleKeyAtlas', 'emptyTile.png', this);
	__emptySprite.anchor.set(0.5, 0.5);
	
	var __emptyGlowSprite = this.game.add.sprite(0.0, 0.0, 'wordleKeyAtlas', 'emptyTile.png', this);
	__emptyGlowSprite.anchor.set(0.5, 0.5);
	
	var __lightGraySprite = this.game.add.sprite(0.0, 0.0, 'wordleKeyAtlas', 'emptyTile.png', this);
	__lightGraySprite.anchor.set(0.5, 0.5);
	
	var __graySprite = this.game.add.sprite(0.0, 0.0, 'wordleKeyAtlas', 'grayTile.png', this);
	__graySprite.anchor.set(0.5, 0.5);
	__graySprite.tint = 0x3a3a3c;
	
	var __greenSprite = this.game.add.sprite(0.0, 0.0, 'wordleKeyAtlas', 'greenTile.png', this);
	__greenSprite.anchor.set(0.5, 0.5);
	__greenSprite.tint = 0x5a8d4b;
	
	var __yellowSprite = this.game.add.sprite(0.0, 0.0, 'wordleKeyAtlas', 'yellowTile.png', this);
	__yellowSprite.anchor.set(0.5, 0.5);
	__yellowSprite.tint = 0xb29f31;
	
	var __redSprite = this.game.add.sprite(0.0, 0.0, 'wordleKeyAtlas', 'emptyTile.png', this);
	__redSprite.anchor.set(0.5, 0.5);
	
	var __overlaySprite = this.game.add.sprite(0.0, 0.0, 'wordleKeyAtlas', 'emptyTile.png', this);
	__overlaySprite.anchor.set(0.5, 0.5);
	
	
	
	// fields
	
	this.f_emptySprite = __emptySprite;
	this.f_emptyGlowSprite = __emptyGlowSprite;
	this.f_lightGraySprite = __lightGraySprite;
	this.f_graySprite = __graySprite;
	this.f_greenSprite = __greenSprite;
	this.f_yellowSprite = __yellowSprite;
	this.f_redSprite = __redSprite;
	this.f_overlaySprite = __overlaySprite;
	
	this.afterCreate();
	return this;
	
}

/** @type Phaser.Group */
var WordleLetterCell_proto = Object.create(Phaser.Group.prototype);
WordleLetterCell.prototype = WordleLetterCell_proto;
WordleLetterCell.prototype.constructor = WordleLetterCell;

/* --- end generated code --- */
// -- user code here --


WordleLetterCell.prototype.afterCreate = function(){
	this.emptySprite = this.f_emptySprite;
	this.emptyGlowSprite = this.f_emptyGlowSprite;
	this.lightGraySprite = this.f_lightGraySprite;
	this.graySprite = this.f_graySprite;
	this.greenSprite = this.f_greenSprite;
	this.yellowSprite = this.f_yellowSprite;
	this.redSprite = this.f_yellowSprite;
	this.overlaySprite = this.f_overlaySprite;
	this.bounds = null;
	this.font = null;
	this.index = -1;
};

/**
 * 
 * @param _bounds {Phaser.Rectangle} - the rectangle that the cell will be rendered inside of
 * @param _font {Phaser.BitmapFont} - the bitmap font that the cell will use
 */
WordleLetterCell.prototype.initialize = function(_bounds, _font){
	
	this.bounds = _bounds;
	this.font = _font;
	this.position.setTo(this.bounds.centerX, this.bounds.centerY);
	
	this.overlaySprite.tint = 0x000000;
	
	this.bmLetter = this.game.add.bitmapText(0, 0, this.font, "A", 64, this);
	this.bmLetter.tint = 0x5b556d;
	this.SM = new StateMachine({
		DEFAULT: new State(),
		GREEN: new State(),
		YELLOW: new State(),
		RED: new State(),
		GRAY: new State(),
		LIGHT_GRAY: new State(),
		GLOW: new State(),
		FADE: new State()
	});
	this.initSM();
	this.SM.changeState("DEFAULT");
	
	this.forEach(function(child){
		child.anchor.setTo(0.5);
		child.alpha = 0;
	}, this);
	this.emptySprite.alpha = 1;
	this.updateSize();
	
};

/**
 * this function is what is called once the new bounds is set inside of WordleBoard.remakeBoard. you can use the bounds variable to reize everything, but keep in mind that the bounds is the MAXIMUM space that
 * a tile can occupy, so you might want to make another rectangle using the bounds, and resize everything using that.
 */

WordleLetterCell.prototype.updateSize = function(){
	
	//since the letter cells contain sprites that are all the same size, I can just resize the entire group, if the group was bigger than the tile size (had a glow tile that was bigger or something)
	//you'd NOT resize the group, and resize individual sprite
	var paddedRect = this.bounds.clone().inflate(-4, -4);
	this.resizeInRect(paddedRect);
	this.forEach(function(child){
		child.baseScale = child.scale.clone();
	}, this);
	return;
	
	//resizing individual sprites

//	this.emptySprite.resizeInRect(paddedRect);
//	this.lightGraySprite.resizeInRect(paddedRect);
//	this.graySprite.resizeInRect(paddedRect);
//	this.greenSprite.resizeInRect(paddedRect);
//	this.yellowSprite.resizeInRect(paddedRect);
//	this.redSprite.resizeInRect(paddedRect);
//	this.overlaySprite.resizeInRect(paddedRect);
//	this.bmLetter.scale.setTo(this.graySprite.scale.x * 0.8);
	
	
};


/**
 * this function determines what happens when different states of a letter is entered. Depending on the playable, you might want to do different animations, show different children of the prefab, etc. All
 * of that should be done here. ALSO if the playable has a unique state the cell can be in, I encourage you to add another state to the state machine in WordleLetterCell.initialize, and then determine what
 * happens in that state here.
 */

WordleLetterCell.prototype.initSM = function(){
	
	this.shakeTile = function(tile, itr, shakeCircle, onComplete){
		var p = itr == 0?shakeCircle:shakeCircle.random();
		var dist = Phaser.Point.distance(tile.position, p);
		tile.moveTween = this.game.add.tween(tile).to({x: p.x, y: p.y}, dist*2, Phaser.Easing.Sinusoidal.InOut, true);
		
		tile.moveTween.onComplete.add(function(){
			if(itr == 0){
				onComplete.call(this);
				return;
			}
			this.shakeTile(tile, itr-1, shakeCircle, onComplete);
		}, this);
	};
	
	//general function I use for the way the tiles appear
	var feedbackTween = function(tile, doAnimate, callback){
		doAnimate = doAnimate==undefined?true:doAnimate;
		if(!doAnimate){
			this.emptySprite.alpha = 0;
			this.lightGraySprite.alpha =0;
			tile.alpha = 1;
			return;
		}
		
		tile.scale.setTo(0);
		tile.alpha = 1;
		tile.scaleTween = this.game.add.tween(tile.scale).to({x: tile.baseScale.x, y:  tile.baseScale.y}, 200, Phaser.Easing.Back.Out, true, this.index*75);
		if(this.bmLetter.scale.x == 0){
			this.game.add.tween(this.bmLetter.scale).to({x: this.bmLetter.baseScale.x, y:  this.bmLetter.baseScale.y}, 200, Phaser.Easing.Back.Out, true, this.index*75);
		}

		tile.scaleTween.onComplete.add(function(){
			this.emptySprite.alpha = 0;
			this.lightGraySprite.alpha =0;

			if(callback){
				callback.call(this);
			}
		}, this);
	};
	
	this.SM.states.DEFAULT.onEnter.add(function(data){
		
		this.bringToTop(this.bmLetter);
		this.emptySprite.alpha = 1;
		this.bmLetter.tint = 0xffffff;
		if(data.prevState && data.prevState.name == "LIGHT_GRAY"){
			if(data.doAnimate){
				this.emptySprite.alpha = 0;
				this.emptySprite.alphaTween = this.game.add.tween(this.emptySprite).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);
				this.emptySprite.alphaTween.onComplete.add(function(){
					this.lightGraySprite.alpha = 0;
				}, this);
			}else{
				this.emptySprite.alpha = 1;
				this.lightGraySprite.alpha = 0;
			}
			
		}
	}, this);
	
	this.SM.states.GREEN.onEnter.add(function(data){
		
		feedbackTween.call(this, this.greenSprite, data.doAnimate, data.tweenFinished);
		this.bmLetter.tint = 0xffffff;
	}, this);
	
	this.SM.states.YELLOW.onEnter.add(function(data){
		feedbackTween.call(this, this.yellowSprite, data.doAnimate, data.tweenFinished);
		this.bmLetter.tint = 0xffffff;
	}, this);
	
	this.SM.states.GRAY.onEnter.add(function(data){
		feedbackTween.call(this, this.graySprite, data.doAnimate, data.tweenFinished);
		this.bmLetter.tint = 0xffffff;
	}, this);
	this.SM.states.LIGHT_GRAY.onEnter.add(function(data){
		this.lightGraySprite.alpha = 1;
		if(this.emptySprite.alphaTween){
			this.emptySprite.alphaTween.stop();
		}
		this.emptySprite.alpha = 0;
	}, this);
	
	
	this.SM.states.RED.onEnter.add(function(data){
		data.delay = data.delay ==undefined?0:data.delay;
		if(data.prevState.name == "FADE"){
			this.fadeTween = this.game.add.tween(this.overlaySprite).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
		}
		var shakeCircle = new Phaser.Circle(this.x, this.y, 10);
		//var fadeInTween = this.game.add.tween(this.redSprite).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
		//this.bmLetter.tint = 0xffffff;
		this.shakeTile.call(this, this, 7, shakeCircle, function(){
			
		}.bind(this));
		this.bmLetter.alphaTween = this.game.add.tween(this.bmLetter).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
		this.lightGraySprite.alphaTween = this.game.add.tween(this.lightGraySprite).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
		this.emptySprite.alpha=1;
		this.lightGraySprite.alphaTween.onComplete.add(function(){
			this.SM.changeState("DEFAULT");
		}, this);
		
	}, this);
	
	
	this.SM.states.GLOW.onEnter.add(function(data){
		
		this.glowTween = this.game.add.tween(this.emptyGlowSprite).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true, 0, 0, true);
		this.glowTween.onComplete.add(function(){
			if(this.SM.checkState("GLOW")){
				this.SM.changeState("DEFAULT");

			}
		}, this);
		
	}, this);
	this.SM.states.FADE.onEnter.add(function(data){
		this.bringToTop(this.overlaySprite);
		this.fadeTween = this.game.add.tween(this.overlaySprite).to({alpha: 0.5}, 200, Phaser.Easing.Linear.None, true);
		
	}, this);
	
	
};


/**
 * 
 * @param letter {char} - the letter you want to appear in the cell. This does NOT modify the state, for the state machine is mostly reserved for the backing of the letter
 * @param doAnimate {bool} - do you want the letter to animate in, or immediately appear
 */
WordleLetterCell.prototype.populateLetter = function(letter, doAnimate){
	this.bmLetter.setText(letter.toUpperCase());
	this.letter = letter;
	this.bmLetter.alpha = 1;
	this.bmLetter.tint = 0xffffff;
	if(!doAnimate){
		
		return;
	}
	//anims
	this.bmLetter.scale.setTo(0);
	this.game.add.tween(this.scale).to({x: "0.1", y: "0.1"}, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
	this.game.add.tween(this.bmLetter.scale).to({x: this.bmLetter.baseScale.x, y: this.bmLetter.baseScale.y}, 100, Phaser.Easing.Back.Out, true);
};


/**
 * this function determines what you want to happen when you hide the letter
 */
WordleLetterCell.prototype.hideLetter = function(){
	this.bmLetter.alpha = 0;
	this.letter = null;
};

/**
 * 
 * @param doAnimate {bool} - do you want the letter to animate when it resets, or immediately reset
 * @param delay {floar} - the delay before it resets, helpful for cascading animations.
 * @param onComplete {function} - the function that you want to fire upon completion
 */

WordleLetterCell.prototype.resetCell = function(doAnimate, delay, onComplete){
	
	var spritesToHide= [this.graySprite, this.greenSprite, this.yellowSprite, this.overlaySprite, this.bmLetter];
	this.emptySprite.alpha = 1;
	spritesToHide.forEach(function(sprite){
		if(doAnimate && sprite.alpha >0){
			sprite.scaleTween = this.game.add.tween(sprite.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Back.In, true, delay);
			sprite.scaleTween.onComplete.add(function(){
				sprite.scale.setTo(sprite.baseScale.x, sprite.baseScale.y);
				sprite.alpha = 0;
				if(onComplete){
					onComplete.call(this);
				}
			}, this);
		}else{
			if(sprite.alpha == 1){
				sprite.alpha = 0;
				if(onComplete){
					onComplete.call(this);
				}
			}
			
			
		}
		
	}, this);
	
};