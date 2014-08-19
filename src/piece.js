//0: Empty, 1: Player, 2: Enemy
var boardState = {
		STATE_EMPTY: 0,
		STATE_PLAYER: 1,
		STATE_ENEMY: 2,
		STATE_BLOCK: 3
};

var BoardPiece = cc.Sprite.extend({
	m_nId: 0,
	m_nStatus: boardState.STATE_EMPTY,
	_hintSprite: null,
	m_bHint: false,
	_chess: null,
	_blockSprite: null,

	ctor: function(id) {
		this._super(res.board_png);
		this.m_nID = id;
		this.m_nStatus = boardState.STATE_EMPTY;
		this.m_bHint = false;
	},

	init: function() {
		this._hintSprite = cc.Sprite.create(res.hint_png);

		this._hintSprite.attr({
			x: this.width * 0.5,
			y: this.height * 0.5,
			opacity: 0,
			anchorX: 0.5,
			anchorY: 0.5
		});

		this.addChild(this._hintSprite, 1);

		this._blockSprite = cc.Sprite.create(res.block_png);
		
		this._blockSprite.attr({
			x: this.width * 0.5,
			y: this.height * 0.5,
			opacity: 0,
			anchorX: 0.5,
			anchorY: 0.5
		});
		
		this.addChild(this._blockSprite, 2);
		
		return true;
	},
	
	setBlock: function() {
		if (this.m_nStatus != boardState.STATE_EMPTY)
			return;

		if (this.m_bHint)
			return;

		var tintTo = cc.FadeIn.create(0.25);
		this._blockSprite.runAction(tintTo);
	},

	setHint: function() {
		if (this.m_nStatus != boardState.STATE_EMPTY)
			return;

		if (this.m_bHint)
			return;
		
		this.m_bHint = true;
		
		var tintTo = cc.FadeIn.create(0.25);
		this._hintSprite.runAction(tintTo);
	},
	
	clearHint: function() {
		if (!this.m_bHint)
			return;
		
		this.m_bHint = false;
		
		var tintTo = cc.FadeOut.create(0.25);
		this._hintSprite.runAction(tintTo);
	},

	placeTile: function(flag) {
		if (this.m_nStatus != boardState.STATE_EMPTY)
			return false;
		
		if (!this.m_bHint)
			return false;
		
		this.placeInitTile(flag);
		
		// Background Music
		cc.audioEngine.playEffect(effect.click1_mp3);
		
		return true;
	},
	
	placeInitTile: function (flag) {
		this._chess = Chess.create(flag);

		if (flag) {
			this.m_nStatus = boardState.STATE_PLAYER;
		}
		else {
			this.m_nStatus = boardState.STATE_ENEMY;
		}

		var size = this.getContentSize();

		this._chess.attr({
			x: size.width * 0.5,
			y: size.height * 0.5,
			anchorX: 0.5,
			anchorY: 0.5
		});

		this.addChild(this._chess, 1, 1);	
	},
	
	flip: function(player) {
		if (this.m_nStatus == boardState.STATE_EMPTY)
			return;
		
		if (this.m_nStatus == boardState.STATE_BLOCK)
			return;
		
		if (this._chess)
			this._chess.removeFromParent(true);
		
		var flag = (player == boardState.STATE_PLAYER);
		
		this.placeInitTile(flag);
	}
});

BoardPiece.create = function(id) {
	var board = new BoardPiece(id);

	if (board && board.init()) {
		return board;
	}

	return null;
};
