// 0: Empty, 1: Player, 2: Enemy
var boardState = {
	STATE_EMPTY: 0,
	STATE_PLAYER: 1,
	STATE_ENEMY: 2
};

var BoardPiece = cc.Sprite.extend({
	m_nId: 0,
	m_nStatus: boardState.STATE_EMPTY,
	m_bHint: false,
	ctor:function(id) {
		this._super(res.board_png);
		this.m_nID = id;
		this.m_nStatus = boardState.STATE_EMPTY;
		this.m_bHint = false;
	},
	getID:function() {
		return this.m_nID;
	},
	getState:function() {
		return this.m_nStatus;
	},
	setHint:function(flag)
	{
		if (m_bHint != flag) {
			m_bHint = flag;
			
			if (flag) {
				var tintTo = cc.TintTo.create(0.25, 255, 0, 0);
				this.runAction(tintTo);
			}
			else {
				var tintTo = cc.TintTo.create(0.25, 255, 255, 255);
				this.runAction(tintTo);
			}
		}
	},
	placeTile:function(flag) {
		if (this.m_nStatus != boardState.STATE_EMPTY)
			return;
		
		var chess = Chess.create(flag);
		
		if (flag) {
			this.m_nStatus = boardState.STATE_PLAYER;
		}
		else {
			this.m_nStatus = boardState.STATE_ENEMY;
		}
		
		var size = this.getContentSize();
		
		chess.attr({
			x: size.width * 0.5,
			y: size.height * 0.5,
			anchorX: 0.5,
			anchorY: 0.5
		});
		
		this.addChild(chess, 1, 1);	
	}
});

BoardPiece.create = function(id) {
	var board = new BoardPiece(id);

	if (board) {
		return board;
	}

	return null;
};

var Board = cc.Layer.extend({
	boardArray: [[]],
	ctor:function() {
		this._super();
		
		for (var i= 0; i < Board.initSize.x; i++) {
			// Creates an empty line
			this.boardArray.push([]);

			// Adds cols to the empty line:
			this.boardArray[i].push(new Array(Board.initSize.y));
		}
	},
	
	init:function() {
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var id = x * Board.initSize.x + y; 

				var sp = BoardPiece.create(id);

				sp.attr({
					x: Board.initPos.x + Board.gap * x,
					y: Board.initPos.y + Board.gap * y,
					anchorX: 0.5,
					anchorY: 0.5
				});
				
				// Hardcode init chess, to be fixed later
				if ((x == 3 && y == 4) || (x == 4 && y == 3)) {
					sp.placeTile(true);
				}

				if ((x == 3 && y == 3) || (x == 4 && y == 4)) {
					sp.placeTile(false);
				}

				this.boardArray[x][y] = sp;
				this.addChild(sp, 0, 1);
			}
		}
		return true;
	},
	
	isEmpty:function(x,y) {
		return false;
	},
	
	processEvent:function(getPoint) {
		cc.log("Process Event");
		var flag = -1;
		
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];
				var myRect = piece.getBoundingBox();

//				cc.log(i);

				myRect.x += this.x;
				myRect.y += this.y;

				var state = Rule.getInstance().getGameState();

				if (cc.rectContainsPoint(myRect, getPoint)) {
					piece.placeTile((state == gameState.STATE_PLAYER));
					flag = i;
					break;
				}
			}
		}
		
		if (flag > 0) {
			Rule.getInstance().setGameState();
			checkFlip(flag);
		}
	}
});

Board.create = function() {
	var board = new Board();

	if (board && board.init()) {
		return board;
	}

	return null;
};

Board.initSize = cc.p(8, 8);
Board.initPos = cc.p(0, 0);
Board.gap = 42;