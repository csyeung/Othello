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
	
	init: function() {
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
					sp.placeInitTile(true);
				}

				if ((x == 3 && y == 3) || (x == 4 && y == 4)) {
					sp.placeInitTile(false);
				}
				
				this.boardArray[x][y] = sp;
				this.addChild(sp, 0, 1);
			}
		}

		// Show hint
		this.showHint();
		Rule.getInstance().m_nScorePlayer = this.countScore(true);
		Rule.getInstance().m_nScoreEnemy = this.countScore(false);

		return true;
	},
	
	isEmpty: function(x,y) {
		return false;
	},
	
	processEvent: function(getPoint) {
		cc.log("Process Event");
		var flag = false;
		
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];
				var myRect = piece.getBoundingBox();

				myRect.x += this.x;
				myRect.y += this.y;

				var state = Rule.getInstance().m_nGameState;

				if (cc.rectContainsPoint(myRect, getPoint)) {
					flag = piece.placeTile((state == gameState.STATE_PLAYER));
					if (flag) {
						this.flipChess(x, y);
					}
					break;
				}
			}
		}
		
		if (flag) {
			Rule.getInstance().setGameState();
			this.clearHint();
			this.showHint();
			Rule.getInstance().m_nScorePlayer = this.countScore(true);
			Rule.getInstance().m_nScoreEnemy = this.countScore(false);
		}
	},
	
	countScore: function(flag) {
		var state = gameState.STATE_PLAYER;
		
		if (!flag)
			state = gameState.STATE_ENEMY;
		
		var count = 0;
		
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];
				
				if (piece && piece.m_nStatus == state) {
					count++;
				}
			}
		}
		
		return count;
	},
	
	showHint: function() {
		var turn = Rule.getInstance().m_nGameState;
		
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];
				
				if (piece) {
					if (piece.m_nStatus == boardState.STATE_EMPTY) {
						var flag = this.checkFlip(x, y);
						piece.setHint(flag);
					}
				}
			}
		}
	},
	
	clearHint: function() {
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];

				if (piece) {
					piece.setHint(false);
				}
			}
		}
	},
	
	flipChess: function(x, y) {
		var player = Rule.getInstance().m_nGameState;
		var opponent = Rule.getInstance().getOpponent();
		
		if (x + 1 < Board.initSize.x) {
			var piece = this.boardArray[x + 1][y];

			if (piece && piece.m_nStatus == opponent) {
				this.flipUp(x, y, player);
			}
		}
		
		if (x - 1 >= 0) {
			var piece = this.boardArray[x - 1][y];

			if (piece && piece.m_nStatus == opponent) {
			}
		}
		
		if (y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x][y + 1];

			if (piece && piece.m_nStatus == opponent) {
			}
		}
		
		if (y - 1 >= 0) {
			var piece = this.boardArray[x][y - 1];

			if (piece && piece.m_nStatus == opponent) {
			}
		}

		if (x + 1 < Board.initSize.x && y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x + 1][y + 1];

			if (piece && piece.m_nStatus == opponent) {
			}
		}

		if (y - 1 >= 0 && x + 1 < Board.initSize.x) {
			var piece = this.boardArray[x + 1][y - 1];

			if (piece && piece.m_nStatus == opponent) {
			}
		}

		if (x - 1 >= 0 && y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x - 1][y + 1];

			if (piece && piece.m_nStatus == opponent) {
			}
		}

		if (x - 1 >= 0 && y - 1 >= 0) {
			var piece = this.boardArray[x - 1][y - 1];

			if (piece && piece.m_nStatus == opponent) {
			}
		}
	},
	
	flipUp: function(x, y, player) {
		var flip = false;
		var dest = -1;

		for (var i = x + 1; i < Board.initSize.x; i++) {
			var piece = this.boardArray[i][y];

			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				dest = i;
				break;
			}
		}
		
		if (flip) {
			for (var j = x; j<= dest; j++) {
				var piece = this.boardArray[j][y];
				
				if (piece)
					piece.flip(player);
			}
		}
	},

	checkFlip: function(x, y) {
		var toFlip = false;
		var opponent = Rule.getInstance().getOpponent();
		
		if (x + 1 < Board.initSize.x) {
			var piece = this.boardArray[x + 1][y];
			
			if (piece && piece.m_nStatus == opponent) {
				toFlip = this.checkFlipUp(x, y);
			}
		}
		
		if (x - 1 >= 0) {
			var piece = this.boardArray[x - 1][y];

			if (piece && piece.m_nStatus == opponent) {
				toFlip = this.checkFlipDown(x, y);
			}
		}
		
		if (y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip = this.checkFlipRight(x, y);
			}
		}
		
		if (y - 1 >= 0) {
			var piece = this.boardArray[x][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip = this.checkFlipLeft(x, y);
			}
		}
		
		if (x + 1 < Board.initSize.x && y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x + 1][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip = this.checkFlipUpRight(x, y);
			}
		}
		
		if (y - 1 >= 0 && x + 1 < Board.initSize.x) {
			var piece = this.boardArray[x + 1][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip = this.checkFlipUpLeft(x, y);
			}
		}
		
		if (x - 1 >= 0 && y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x - 1][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip = this.checkFlipDownRight(x, y);
			}
		}
		
		if (x - 1 >= 0 && y - 1 >= 0) {
			var piece = this.boardArray[x - 1][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip = this.checkFlipDownLeft(x, y);
			}
		}
		
		return toFlip;
	},
	
	checkFlipUp: function(x, y) {
		var flip = false;

		for (var i = x + 1; i < Board.initSize.x; i++) {
			var piece = this.boardArray[i][y];
			
			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				break;
			}
		}
		
		return flip;
	},
	
	checkFlipDown: function(x, y) {
		var flip = false;
		for (var i = x - 1; i >= 0; i--) {
			var piece = this.boardArray[i][y];

			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				break;
			}
		}

		return flip;
	},
	
	checkFlipRight: function(x, y) {
		var flip = false;
		for (var i = y + 1; i < Board.initSize.y; i++) {
			var piece = this.boardArray[x][i];

			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				break;
			}
		}

		return flip;
	},
	
	checkFlipLeft: function(x, y) {
		var flip = false;
		for (var i = y - 1; i >= 0; i--) {
			var piece = this.boardArray[x][i];

			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				break;
			}
		}

		return flip;
	},
	
	checkFlipUpRight: function(x, y) {
		var flip = false;
		for (var i = x + 1, j = y + 1; i < Board.initSize.x && j < Board.initSize.y; i++, j++) {
			var piece = this.boardArray[i][j];

			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				break;
			}
		}

		return flip;
	},
	
	checkFlipUpLeft: function(x, y) {
		var flip = false;
		for (var i = x + 1, j = y - 1; i < Board.initSize.x && j >= 0; i++, j--) {
			var piece = this.boardArray[i][j];

			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				break;
			}
		}

		return flip;
	},
	
	checkFlipDownRight: function(x, y) {
		var flip = false;
		for (var i = x - 1, j = y + 1; i >= 0 && j < Board.initSize.y; i--, j++) {
			
			var piece = this.boardArray[i][j];

			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				break;
			}
		}

		return flip;
	},
	
	checkFlipDownLeft: function(x, y) {
		var flip = false;
		for (var i = x + 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
			var piece = this.boardArray[i][j];

			if (piece && piece.m_nStatus == Rule.getInstance().m_nGameState) {
				flip = true;
				break;
			}
		}

		return flip;
	},
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