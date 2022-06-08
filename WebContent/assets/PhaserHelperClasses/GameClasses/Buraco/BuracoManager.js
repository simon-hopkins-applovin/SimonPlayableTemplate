/**
 *
 */
function BuracoManager (_game, _boundsConfig) {
	
	Phaser.Group.call(this, _game);
	this.boundsDC = this.game.add.graphics(0,0);
	this.boundsConfig = _boundsConfig;
	
	
	
	this.SM = new StateMachine({
		DRAW : new State(),
		DECIDE : new State(),
		PLAY_MELD : new State(),
		DISCARD: new State(),
	});

	//PA = Play area
	this.drawPA = new PlayArea(this.game, this.boundsConfig.draw, 0);
	this.playerHandPA = new PlayArea(this.game, this.boundsConfig.playerHand, 50);
	this.opponentHandPA = new PlayArea(this.game, this.boundsConfig.opponentHand, 50);
	this.playerPlayPA = new PlayArea(this.game, this.boundsConfig.playerPlay, 50);
	this.opponentPlayPA = new PlayArea(this.game, this.boundsConfig.opponentPlay, 50);
	this.discardPA = new PlayArea(this.game, this.boundsConfig.discard, 50);
	
	//card piles
	this.mainDeck = new CardDeck(this.game, "deck", this.drawPA, true, 2);
	this.playerHand = new CardHand(this.game, "playerHand", this.playerHandPA);
	this.opponentHand = new CardHand(this.game, "oppHand", this.opponentHandPA, true);
	this.discardPile = new CardPile(this.game, "discard", this.discardPA);
	
	var initPlayerMeld = new CardPile(this.game, "meld1", this.playerPlayPA);
	var initOpponentMeld = new CardPile(this.game, "meld1", this.opponentPlayPA);
	
	var playerMeldArr = ["14_H", "2_H", "3_H", "4_H", "5_H", "6_H"];
	var playerHandArr = ["J_S", "Q_S", "8_D", "9_D", "6_C"];
	
	var oppMeldArr = ["3_C", "4_C", "5_C"];
	var oppHandArr = ["6_C"];
	
	var dealArr = function(arr, pile){
		arr.forEach(function(c){
			var cardData = c.split("_");
			pile.addCard(this.mainDeck.removeCard(Card.numFromChar(cardData[0]), Card.enumFromChar(cardData[1])));
		}, this);
	}.bind(this);
	
	dealArr(playerMeldArr, initPlayerMeld);
	dealArr(playerHandArr, this.playerHand);
	dealArr(oppMeldArr, initOpponentMeld);
	dealArr(oppHandArr, this.opponentHand);
	
	this.opponentHandPA.angle = 180;
	
	this.mainDeck.bringToTop(9, SUITS.HEARTS);
	this.mainDeck.bringToTop(8, SUITS.HEARTS);
	this.mainDeck.bringToTop(7, SUITS.HEARTS);
	
	this.mainDeck.onClickSignal.add(function(card){
		this.moveCard(this.mainDeck, this.playerHand);
	}, this);
	
	this.playerHand.onClickSignal.add(function(card){
		if(card.suit == initPlayerMeld.peekTop().suit && card.number == initPlayerMeld.peekTop().number+1){
			this.moveCard(this.mainDeck, initPlayerMeld, card);
		}
		
	}, this);
	this.opponentHand.onClickSignal.add(function(card){
		this.moveCard(this.opponentHand, initPlayerMeld, card);
		
	}, this);
	
	
	
}

BuracoManager.prototype = Object.create(Phaser.Group.prototype);

BuracoManager.prototype.constructor = BuracoManager;


BuracoManager.prototype.moveCard = function(sourcePile, targetPile, targetCard){
	
	var cardToAdd = targetCard || sourcePile.drawTop();
	cardToAdd.setHidden(false);
	var startWorldPos = cardToAdd.getWorldPos();
	var endWorldPos = targetPile.getTargetSpeadPosition(targetPile.cards.length, true);
	this.game.world.add(cardToAdd);
	cardToAdd.position.setTo(startWorldPos.x, startWorldPos.y);
	
	cardToAdd.moveTween = this.game.add.tween(cardToAdd).to({x: endWorldPos.x, y: endWorldPos.y}, 500, Phaser.Easing.Linear.None, true);
	cardToAdd.moveTween.onComplete.add(function(){
		targetPile.addCard(cardToAdd);
	}, this);
	
};