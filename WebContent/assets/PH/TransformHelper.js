
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.4 (Phaser v2.6.2)


/**
 * TransformHelper
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Number} aX The x coordinate (in world space) to position the Sprite at.
 * @param {Number} aY The y coordinate (in world space) to position the Sprite at.
 * @param {any} aKey This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {any} aFrame If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
function TransformHelper(aGame, aX, aY, aKey, aFrame) {
	Phaser.Sprite.call(this, aGame, aX, aY, aKey || 'transformSprite', aFrame == undefined || aFrame == null? null : aFrame);
	this.anchor.set(0.835, 0.845);
	
	this.Start();
	
}

/** @type Phaser.Sprite */
var TransformHelper_proto = Object.create(Phaser.Sprite.prototype);
TransformHelper.prototype = TransformHelper_proto;
TransformHelper.prototype.constructor = TransformHelper;

/* --- end generated code --- */
// -- user code here --


TransformHelper.prototype.Start = function(){
	this.alpha = 0;
}