var MenuLayer = cc.Layer.extend({
	helloLabel:null,

	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		// ask director the window size
		var size = cc.director.getWinSize();

		// add a "close" icon to exit the progress. it's an autorelease object
		var closeItem = cc.MenuItemImage.create(
				res.CloseNormal_png,
				res.CloseSelected_png,
				function () {
					var scene = cc.Scene.create();
					var layer = GameLayer.create();
					scene.addChild(layer);
					cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
				},this);
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

		// Label
		this.helloLabel = cc.LabelBMFont.create("Othello", res.arial_14_fnt, 200, cc.TEXT_ALIGNMENT_LEFT, cc.p(0,0));
		// position the label on the center of the screen
		this.helloLabel.x = size.width / 2;
		this.helloLabel.y = 0;
		// add the label as a child to this layer
		this.addChild(this.helloLabel, 5);
		
		this.helloLabel.runAction(cc.MoveBy.create(2.5, cc.p(0, size.height * 0.8)));

		return true;
	}
});

var MenuScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new MenuLayer();
		this.addChild(layer);
	}
});
