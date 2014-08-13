// 1: Player, 2: Enemy
var gameState = {
	STATE_PLAYER: 1,
	STATE_ENEMY: 2
}

var Rule = cc.Class.extend({
	m_nGameState: gameState.STATE_PLAYER,
	init: function() {
		this.m_nGameState = gameState.STATE_PLAYER;
		return true;
	},
	getGameState: function() {
		return this.m_nGameState;
	},
	setGameState: function() {
		if (this.m_nGameState == gameState.STATE_PLAYER)
			this.m_nGameState = gameState.STATE_ENEMY;
		else
			this.m_nGameState = gameState.STATE_PLAYER;
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