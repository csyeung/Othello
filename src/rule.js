// 1: Player, 2: Enemy
var gameState = {
	STATE_PLAYER: 1,
	STATE_ENEMY: 2
};

var items = [[1,34,19,7,8,20,35,2], 
             [33,60,54,45,46,53,59,36],
             [13,55,21,25,26,22,52,18],
             [5,47,31,64,63,27,44,9],
             [6,48,32,61,62,28,43,10],
             [14,56,23,30,29,24,51,17],
             [40,57,49,41,42,50,58,37],
             [4,39,15,11,12,16,38,3]];

var Rule = cc.Class.extend({
	m_nGameState: gameState.STATE_PLAYER,
	m_nScorePlayer : 0,
	m_nScoreEnemy : 0,
	m_bGameMode : false,
	init: function() {
		this.m_nGameState = gameState.STATE_PLAYER;
		return true;
	},
	setGameState: function() {
		if (this.m_nGameState == gameState.STATE_PLAYER)
			this.m_nGameState = gameState.STATE_ENEMY;
		else
			this.m_nGameState = gameState.STATE_PLAYER;
	},
	getOpponent: function() {
		if (this.m_nGameState == gameState.STATE_PLAYER)
			return gameState.STATE_ENEMY;
		
		return gameState.STATE_PLAYER;
	}
});

Rule.getInstance = function() {
	if (!this._shared) {
		this._shared = new Rule();
		if (this._shared.init()) {
			return this._shared;
		} 
	} else {
		return this._shared;
	}
	return null;
};

Rule._shared = null;