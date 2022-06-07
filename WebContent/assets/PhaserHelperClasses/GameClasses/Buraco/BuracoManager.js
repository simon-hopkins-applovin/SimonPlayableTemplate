/**
 *
 */
function BuracoManager (_game, _boundsConfig) {
	
	this.boundsDC = this.game.add.graphics(0,0);
	
}

BuracoManager.prototype = Object.create(Phaser.Group.prototype);

BuracoManager.prototype.constructor = BuracoManager;