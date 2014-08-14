//0: Empty, 1: Player, 2: Enemy
var boardState = {
		STATE_EMPTY: 0,
		STATE_PLAYER: 1,
		STATE_ENEMY: 2
};

var BoardPiece = cc.Sprite.extend({
	m_nId: 0,
	m_nStatus: boardState.STATE_EMPTY,
	_hintSprite: null,
	m_bHint: false,
	_chess: null,

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

		this.addChild(this._hintSprite);

		return true;
	},

	setHint: function(flag) {
		if (this.m_bHint != flag) {
			this.m_bHint = flag;

			if (flag) {
				var tintTo = cc.FadeIn.create(0.25);
				this._hintSprite.runAction(tintTo);
			}
			else {
				var tintTo = cc.FadeOut.create(0.25);
				this._hintSprite.runAction(tintTo);
			}
		}
	},

	placeTile: function(flag) {
		if (this.m_nStatus != boardState.STATE_EMPTY)
			return false;
		
		if (!this.m_bHint)
			return false;
		
		this.placeInitTile(flag);
		
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
