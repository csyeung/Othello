var GameLayer = cc.Layer.extend({
	boardLayer:null,
	ctor:function () {
		var size = cc.director.getWinSize();
		this._super();
		this.init();
		
//		if ('touches' in cc.sys.capabilities) {
			cc.eventManager.addListener(cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: function (touch, event) {
					event.getCurrentTarget().processEvent(touch.getLocation());
					return true;
				}
			}), this);
//		}
//		else if ('mouse' in cc.sys.capabilities) {
//			cc.eventManager.addListener(cc.EventListener.create({
//				event: cc.EventListener.MOUSE,
//				onMouseUp: function (event) {
//					cc.log("onMouseUp Hello");
//					event.getCurrentTarget().processEvent(event.getLocation());
//				}
//			}), this);
//		}

		// add a "close" icon to exit the progress. it's an autorelease object
		var closeItem = cc.MenuItemImage.create(
				res.CloseNormal_png,
				res.CloseSelected_png,
				function () {
					cc.log("Menu is clicked!");
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
	},
	
	createBoard:function() {
		var winSize = cc.director.getWinSize();
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
	},
	
	processEvent: function(event) {
		if (boardLayer)
			boardLayer.processEvent(event);
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