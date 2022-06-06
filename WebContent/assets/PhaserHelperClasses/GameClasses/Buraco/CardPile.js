/**
 *
 */
function CardPile (_game, _assocPlayArea, _spreadOffset, _isHidden) {
	
	this.game = _game;
	Phaser.Group.call(this, this.game);
	this.cards = [];
	this.assocPlayArea = _assocPlayArea;
	this.spreadOffset = _spreadOffset;
	this.isHidden = _isHidden;
	
}

CardPile.prototype = Object.create(Phaser.Group.prototype);
CardPile.prototype.constructor = CardPile;


CardPile.prototype.toString = function(){
	var retString = "TOP|";
	
	this.cards.forEach(function(c){
		retString+= " " + c.toString() + "";
	}, this);
	retString+="|BOTTOM";
	return retString;
}

CardPile.prototype.addCard = function(card){
	if(!card){
		return false;
	}
	this.cards.unshift(card);
	this.add(card);
	card.position.setTo()
	return this.cards;
};



CardPile.prototype.drawTop = function(){
	if(this.cards.length==0){
		return false;
	}
	return this.cards.shift();
};

CardPile.prototype.peekTop = function(){
	return this.cards[0];
};

CardPile.prototype.removeCard = function(_num, _suit){
	var foundCard = null;
	for(var i = 0; i< this.cards.length; i++){
		if(this.cards[i].equals(_num, _suit)){
			foundCard = this.cards.splice(i, 1)[0];
			break;
		}
	};
	
	return foundCard;
};


CardPile.prototype.bringToTop = function(_num, _suit){
	
	for(var i = 0; i< this.cards.length; i++){
		
		if(this.cards[i].equals(_num, _suit)){
			var targetCard = this.cards.splice(i, 1)[0];
			this.cards.unshift(targetCard);
			break;
		}
	};
	
	return i!=this.cards.length;
};

CardPile.prototype.shuffle = function(){
	 return Phaser.ArrayUtils.shuffle(this.cards);
};

CardPile.prototype.orderCards = function(){
	this.customSort(function(a, b){
		return this.cards.indexOf(b) - this.cards.indexOf(a);
	}, this);
}