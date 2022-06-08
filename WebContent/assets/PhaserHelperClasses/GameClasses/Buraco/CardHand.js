/**
 *
 */
function CardHand (_game, _key, _playArea, _isHidden) {
	
	CardPile.call(this, _game, _key, _playArea, _isHidden);
	
};

CardHand.prototype = Object.create(CardPile.prototype);
CardHand.prototype.constructor = CardHand;



CardHand.prototype.focusCard = function(){
	
};