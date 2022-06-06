/**
 *
 */

const SUITS = {
	SPADES: 0,
	CLUBS: 1,
	HEARTS: 2,
	DIAMONDS: 3
};
function CardDeck (_game) {
	this.game = _game;
	Phaser.Group.call(this, this.game);
	this.cards = [];
	
	for(var i=2; i<15; i++){
		
		for(var suit in SUITS){
			var newCard = new Card(this.game, this);
			newCard.initialize(i, SUITS[suit]);
			this.cards.push(newCard);
			
		};
	};
	
	this.shuffle();
	
	console.log(this.bringToTop(5, SUITS.SPADES));
	this.bringToTop(6, SUITS.SPADES);
	this.bringToTop(7, SUITS.SPADES);
	this.bringToTop(8, SUITS.SPADES);
	console.log(this.toString());
}

CardDeck.prototype = Object.create(Phaser.Group.prototype);

CardDeck.constructor = CardDeck;

CardDeck.prototype.toString = function(){
	
	var retString = "";
	this.cards.forEach(function(c){
		retString += (c.toString() + "\n");
	}, this);
	return retString;
}

CardDeck.prototype.shuffle = function(){
	 return Phaser.ArrayUtils.shuffle(this.cards);
};


CardDeck.prototype.drawCard = function(){
	return this.cards.shift();
};

//first instance of the card
CardDeck.prototype.bringToTop = function(_num, _suit){
	
	for(var i = 0; i< this.cards.length; i++){
		
		if(this.cards[i].equals(_num, _suit)){
			var targetCard = this.cards.splice(i, 1)[0];
			this.cards.unshift(targetCard);
			break;
		}
	};
	
	return i!=this.cards.length;
};