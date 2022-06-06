/**
 *
 */
function CardHand (_game) {
	
	CardPile.call(this, _game);
	
};

CardHand.prototype = Object.create(CardPile.prototype);
CardHand.prototype.constructor = CardHand;



CardHand.prototype.focusCard = function(){
	
};