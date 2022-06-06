/**
 *
 */
function PlayArea (_game, _bounds) {
	
	Phaser.Group.call(this, _game);
	this.bounds = _bounds;
	this.pileMap = new Map();
	
}


PlayArea.prototype = Object.create(Phaser.Group.prototype);
PlayArea.prototype.constructor = PlayArea;


//add a pile to a play area at the right most point
PlayArea.prototype.addCardPile = function(key, pile){
	
	this.pileMap.add(key, pile);
	this.add(pile);
};