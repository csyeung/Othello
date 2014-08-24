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
				
				if ((x == 1 && y == 1))
					sp.setBlock();
				
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
			this.changeTurn();
		}
		
		this.checkGameWin();
	},
	
	checkGameWin: function() {
		var scorePlayer = this.countScore(true);
		var scoreEnemy = this.countScore(false);
		var total = this.countTotal();
		var boardTotal = Board.initSize.x * Board.initSize.y - this.countBlock();
		
		if (total >= boardTotal || scorePlayer == 0 || scoreEnemy == 0) {
			this.showGameWin();
			return true;
		}
		
		// Win Condition 3: No more moves
		if (this.checkNoMove()) {
			this.showGameWin();
			return true;
		}
		
		return false;
	},
	
	checkNoMove: function() {
		var enemyHintCount = this.getHintCount(boardState.STATE_ENEMY);
		var playerHintCount = this.getHintCount(boardState.STATE_PLAYER);
		
		return (enemyHintCount == 0 && playerHintCount == 0);
	},
	
	countBlock: function() {
		var hint = 0;

		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];

				if (piece) {
					if (piece.m_nStatus == boardState.STATE_BLOCK)
						hint++;
				}
			}
		}

		return hint;
	},
	
	getHintCount: function(turn) {
		var hint = 0;

		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];

				if (piece) {
					if (piece.m_nStatus != boardState.STATE_EMPTY)
						continue;

					var flag = this.checkFlip(x, y, turn);

					if (flag)
						hint++;
				}
			}
		}
		
		return hint;
	},
	
	changeTurn: function() {
		this.clearHint();

		Rule.getInstance().setGameState();

		var scorePlayer = this.countScore(true);
		var scoreEnemy = this.countScore(false);

		Rule.getInstance().m_nScorePlayer = scorePlayer;
		Rule.getInstance().m_nScoreEnemy = scoreEnemy;

		var hintCount = this.showHint();

		if (hintCount == 0) {
			this.changeTurn();
			return;
		}
		
		if (Rule.getInstance().m_bGameMode && Rule.getInstance().m_nGameState == boardState.STATE_ENEMY) {
			this.aiPutChess();
		}
	},
	
	aiPutChess: function() {
		// Pick a cell based on score predefined
		var posx = 0, posy = 0;
		var score = 0;
		
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];
				
				if (piece && piece.m_nStatus == boardState.STATE_EMPTY && piece.m_bHint) {
					var pieceScore = items[x][y];
					
					if (pieceScore > score) {
						posx = x;
						posy = y;
					}
				}
			}
		}
		
		var targetPiece = this.boardArray[posx][posy];
		
		if (targetPiece) {
			if (targetPiece.placeTile(false))
				this.changeTurn();
		}
	},
	
	// Get criteria for game end and for display
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
	
	countTotal: function() {
		var count = 0;
		
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];

				if (piece && piece.m_nStatus != boardState.STATE_EMPTY && piece.m_nState != boardState.STATE_BLOCK) {
					count++;
				}
			}
		}

		return count;
	},
	
	showHint: function() {
		var turn = Rule.getInstance().m_nGameState;
		var hint = 0;
		
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];
				
				if (piece) {
					if (piece.m_nStatus != boardState.STATE_EMPTY)
						continue;
					
					var flag = this.checkFlip(x, y, turn);
					
					if (flag) {
						piece.setHint();
						hint++;
					}
				}
			}
		}
		
		return hint;
	},
	
	clearHint: function() {
		for (var x = 0; x < Board.initSize.x; x++) {
			for (var y = 0; y < Board.initSize.y; y++) {
				var piece = this.boardArray[x][y];

				if (piece) {
					piece.clearHint();
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
				this.flipChessLoop(player, x + 1, y, 1, 0);
			}
		}
		
		if (x - 1 >= 0) {
			var piece = this.boardArray[x - 1][y];

			if (piece && piece.m_nStatus == opponent) {
				this.flipChessLoop(player, x - 1, y, -1, 0);
			}
		}
		
		if (y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				this.flipChessLoop(player, x, y + 1, 0, 1);
			}
		}
		
		if (y - 1 >= 0) {
			var piece = this.boardArray[x][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				this.flipChessLoop(player, x, y - 1, 0, -1);
			}
		}

		if (x + 1 < Board.initSize.x && y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x + 1][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				this.flipChessLoop(player, x + 1, y + 1, 1, 1);
			}
		}

		if (y - 1 >= 0 && x + 1 < Board.initSize.x) {
			var piece = this.boardArray[x + 1][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				this.flipChessLoop(player, x + 1, y - 1, 1, -1);
			}
		}

		if (x - 1 >= 0 && y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x - 1][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				this.flipChessLoop(player, x - 1, y + 1, -1, 1);
			}
		}

		if (x - 1 >= 0 && y - 1 >= 0) {
			var piece = this.boardArray[x - 1][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				this.flipChessLoop(player, x - 1, y - 1, -1, -1);
			}
		}
	},
	
	flipChessLoop: function(turn, start_x, start_y, increment_x, increment_y) {
		var x = start_x;
		var y = start_y;
		
		var flip = false;
		var dest_x = 0;
		var dest_y = 0;

		while (true) {
			if (increment_x > 0) {
				if (x >= Board.initSize.x)
					break;
			} else {
				if (x < 0)
					break;
			}

			if (increment_y > 0) {
				if (y >= Board.initSize.y)
					break;
			} else {
				if (y < 0)
					break;
			}

			var piece = this.boardArray[x][y];
			
			if (piece && piece.m_nStatus == boardState.STATE_EMPTY)
				break;
			
			if (piece && piece.m_nStatus == boardState.STATE_BLOCK)
				break;

			if (piece && piece.m_nStatus == turn) {
				flip = true;
				dest_x = x;
				dest_y = y;
				break;
			}

			x += increment_x;
			y += increment_y;
		}
		
		if (flip) {
			var i = start_x;
			var j = start_y;

			while (true) {
				if (increment_x > 0) {
					if (i >= dest_x)
						break;
				} else {
					if (i < dest_x)
						break;
				}

				if (increment_y > 0) {
					if (j >= dest_y)
						break;
				} else {
					if (j < dest_y)
						break;
				}

				var piece = this.boardArray[i][j];

				if (piece)
					piece.flip(turn);
				
				i += increment_x;
				j += increment_y;
			}
		}
	},

	checkFlip: function(x, y, turn) {
		var toFlip = false;
		var opponent = 0;
		
		if (turn == boardState.STATE_ENEMY)
			opponent = boardState.STATE_PLAYER;
		else 
			opponent = boardState.STATE_ENEMY;
		
		if (x + 1 < Board.initSize.x) {
			var piece = this.boardArray[x + 1][y];
			
			if (piece && piece.m_nStatus == opponent) {
				toFlip |= this.checkFlipLoop(turn, x + 1, y, 1, 0);
			}
		}
		
		if (x - 1 >= 0) {
			var piece = this.boardArray[x - 1][y];

			if (piece && piece.m_nStatus == opponent) {
				toFlip |= this.checkFlipLoop(turn, x - 1, y, -1, 0);
			}
		}
		
		if (y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip |= this.checkFlipLoop(turn, x, y + 1, 0, 1);
			}
		}
		
		if (y - 1 >= 0) {
			var piece = this.boardArray[x][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip |= this.checkFlipLoop(turn, x, y - 1, 0, -1);
			}
		}
		
		if (x + 1 < Board.initSize.x && y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x + 1][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip |= this.checkFlipLoop(turn, x + 1, y + 1, 1, 1);
			}
		}
		
		if (y - 1 >= 0 && x + 1 < Board.initSize.x) {
			var piece = this.boardArray[x + 1][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip |= this.checkFlipLoop(turn, x + 1, y - 1, 1, -1);
			}
		}
		
		if (x - 1 >= 0 && y + 1 < Board.initSize.y) {
			var piece = this.boardArray[x - 1][y + 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip |= this.checkFlipLoop(turn, x - 1, y + 1, -1, 1);
			}
		}
		
		if (x - 1 >= 0 && y - 1 >= 0) {
			var piece = this.boardArray[x - 1][y - 1];

			if (piece && piece.m_nStatus == opponent) {
				toFlip |= this.checkFlipLoop(turn, x - 1, y - 1, -1, -1);
			}
		}
		
		return toFlip;
	},
	
	checkFlipLoop: function(turn, start_x, start_y, increment_x, increment_y) {
		var flip = false;
		
		var x = start_x;
		var y = start_y;
		
		while (true) {
			if (increment_x > 0) {
				if (x >= Board.initSize.x)
					break;
			} else {
				if (x < 0)
					break;
			}
			
			if (increment_y > 0) {
				if (y >= Board.initSize.y)
					break;
			} else {
				if (y < 0)
					break;
			}
			
			var piece = this.boardArray[x][y];

			if (piece && piece.m_nStatus == boardState.STATE_EMPTY)
				break;
			
			if (piece && piece.m_nStatus == boardState.STATE_BLOCK)
				break;

			if (piece && piece.m_nStatus == turn) {
				flip = true;
				break;
			} 
			
			x += increment_x;
			y += increment_y;
		}
		
		return flip;
	},
	
	showGameWin: function() {
		var scorePlayer = this.countScore(true);
		var scoreEnemy = this.countScore(false);

		var displayString = "";
		
		if (scorePlayer > scoreEnemy) {
			displayString = "Player 1 Wins";
		} else if (scorePlayer == scoreEnemy) {
			displayString = "Draw";
		} else {
			displayString = "Player 2 Wins";
		}
		
		var _player = cc.LabelBMFont.create(displayString, res.arial_14_fnt, 300, cc.TEXT_ALIGNMENT_CENTER, cc.p(0,0));

		_player.attr({
			x: this.width * 0.5,
			y: this.height * 0.5
		});

		this.addChild(_player, 100, 2);
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