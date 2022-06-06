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

	CardPile.call(this, _game);
	
	for(var i=2; i<15; i++){
		
		for(var suit in SUITS){
			var newCard = new Card(this.game, this);
			newCard.initialize(i, SUITS[suit]);
			this.addCard(newCard);
			
		};
	};
	
	this.shuffle();
	this.orderCards();

}

CardDeck.prototype = Object.create(CardPile.prototype);

CardDeck.prototype.constructor = CardDeck;


