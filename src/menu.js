var MenuLayer = cc.Layer.extend({
	helloLabel:null,

	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		// ask director the window size
		var size = cc.director.getWinSize();

		var lazyLayer = cc.Layer.create();
		this.addChild(lazyLayer);

		// add "HelloWorld" splash screen"
		this.sprite = cc.Sprite.create(res.night_sky_png);
		this.sprite.attr({
			x: size.width / 2,
			y: size.height / 2,
		});
		lazyLayer.addChild(this.sprite, 0);

		// add a "close" icon to exit the progress. it's an autorelease object
		var playerItem = cc.MenuItemImage.create(
				res.menu_player_png,
				res.menu_player_on_png,
				function () {
					var scene = cc.Scene.create();
					var layer = GameLayer.create();
					scene.addChild(layer);
					cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
				},this);
		playerItem.attr({
			x: size.width * 0.25,
			y: size.height * 0.35,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var cpuItem = cc.MenuItemImage.create(
				res.menu_cpu_png,
				res.menu_cpu_on_png,
				function () {
					var scene = cc.Scene.create();
					var layer = GameLayer.create();
					scene.addChild(layer);
					cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
				},this);
		cpuItem.attr({
			x: size.width * 0.75,
			y: size.height * 0.35,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var menu = cc.Menu.create(playerItem, cpuItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);

		// Label
		this.helloLabel = cc.Sprite.create(res.title_png);
		// position the label on the center of the screen
		
		this.helloLabel.attr({
			x : size.width * 0.5,
			y : size.height * 1.05,
			anchorX: 0.5,
			anchorY: 0.5
		});
		
		// add the label as a child to this layer
		this.addChild(this.helloLabel, 5);
		
		this.helloLabel.runAction(cc.MoveTo.create(1.5, cc.p(size.width * 0.5, size.height * 0.75)));

		// Background Music
		cc.audioEngine.playMusic(effect.bgmus_mp3);

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
