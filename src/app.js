var HelloWorldLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
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

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelBMFont.create("Othello", res.arial_14_fnt, 200, cc.TEXT_ALIGNMENT_LEFT, cc.p(0,0));
        // position the label on the center of the screen
        this.helloLabel.x = size.width / 2;
        this.helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        // add "HelloWorld" splash screen"
        this.sprite = cc.Sprite.create(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            opacity: 0
        });
        lazyLayer.addChild(this.sprite, 0);

        var fadeInA = cc.FadeIn.create(2);
        var easeInA = cc.EaseIn.create(fadeInA, 1);
        
        var fadeOutB = cc.FadeOut.create(2);
        var easeInB = cc.EaseIn.create(fadeOutB, 1);
        
        var callBack = cc.CallFunc.create(function(){
        	var scene = cc.Scene.create();
        	var layer = GameLayer.create();
        	scene.addChild(layer);
        	cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        }, this);

        this.sprite.runAction(cc.Sequence.create(easeInA, easeInB, callBack));
        this.helloLabel.runAction(cc.MoveBy.create(2.5, cc.p(0, size.height * 0.8)));

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
