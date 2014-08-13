var Chess = cc.Sprite.extend({
	isPlayer: true,
	ctor:function(sideImg, side) {
		this._super(sideImg);
		isPlayer = side;
	}
});

Chess.create = function(side) {
	var sideImg = "";
	if (side) {
		sideImg = res.black_png;
	}
	else {
		sideImg = res.white_png;
	}
	
	var chess = new Chess(sideImg, side);
	
	if (chess) {
		return chess;
	}
	
	return null;
};