var GameLayer = cc.Layer.extend({
	boardLayer:null,
	m_pScorePlayerLabel: null,
	m_pScoreEnemyLabel: null,
	
	ctor:function () {
		var size = cc.director.getWinSize();
		this._super();
		this.init();
		
		// Touch (tested in Win32, Android, iOS, Mac)
		cc.eventManager.addListener(cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				event.getCurrentTarget().processEvent(touch.getLocation());
				return true;
			}
		}), this);

		// add a "close" icon to exit the progress. it's an autorelease object
		var closeItem = cc.MenuItemImage.create(
				res.CloseNormal_png,
				res.CloseSelected_png,
				function () {
					cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new MenuScene()));
				}, this);
		closeItem.attr({
			x: size.width - 20,
			y: 20,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var menu = cc.Menu.create(closeItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);

		this.createBoard();
		
		this.scheduleUpdate();
	},
	
	createBoard:function() {
		var winSize = cc.director.getWinSize();
		
		// Background
		var bg = cc.Sprite.create(res.back_jpg);
		
		bg.attr({
			x: winSize.width * 0.5,
			y: winSize.height * 0.5,
			anchorX: 0.5,
			anchorY: 0.5
		});
		
		this.addChild(bg, 0, 0);
		
		// Board
		boardLayer = Board.create();
		
		boardLayer.attr({
			x: winSize.width * 0.5 - 350 * 0.5,
			y: winSize.height * 0.5 - 350 * 0.5,
			width: 350,
			height: 350,
			anchorX: 0.5,
			anchorY: 0.5
		});

		this.addChild(boardLayer, 0, 1);
		
		// Score
		var _player = cc.LabelBMFont.create("Player: ", res.arial_14_fnt, 200, cc.TEXT_ALIGNMENT_RIGHT, cc.p(0,0));

		_player.attr({
			x: winSize.width * 0.78,
			y: winSize.height * 0.8
		});
		
		this.addChild(_player, 100, 2);

		var _enemy = cc.LabelBMFont.create("Enemy: ", res.arial_14_fnt, 200, cc.TEXT_ALIGNMENT_RIGHT, cc.p(0,0));

		_enemy.attr({
			x: winSize.width * 0.78,
			y: winSize.height * 0.7
		});

		this.addChild(_enemy, 101, 2);

		//
		this.m_pScorePlayerLabel = cc.LabelBMFont.create("0", res.arial_14_fnt, 200, cc.TEXT_ALIGNMENT_LEFT, cc.p(0,0));

		this.m_pScorePlayerLabel.attr({
			x: winSize.width * 0.9,
			y: winSize.height * 0.8,
		});
		
		this.addChild(this.m_pScorePlayerLabel, 10, 2);

		this.m_pScoreEnemyLabel = cc.LabelBMFont.create("0", res.arial_14_fnt, 200, cc.TEXT_ALIGNMENT_LEFT, cc.p(0,0));

		this.m_pScoreEnemyLabel.attr({
			x: winSize.width * 0.9,
			y: winSize.height * 0.7,
		});

		this.addChild(this.m_pScoreEnemyLabel, 10, 2);
	},
	
	processEvent: function(event) {
		if (boardLayer)
			boardLayer.processEvent(event);
	},
	
	update: function(dt) {
		if (this.m_pScorePlayerLabel)
			this.m_pScorePlayerLabel.setString(Rule.getInstance().m_nScorePlayer);
		
		if (this.m_pScoreEnemyLabel)
			this.m_pScoreEnemyLabel.setString(Rule.getInstance().m_nScoreEnemy);
	}
});

GameLayer.create = function() {
	var gameLayer = new GameLayer();
	if (gameLayer)
	{
		return gameLayer;
	}
	return null;
};