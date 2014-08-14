var HelloWorldLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    circle:null,
    sprite:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        // ask director the window size
        var size = cc.director.getWinSize();

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
        	cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new MenuScene()));
        }, this);

        this.sprite.runAction(cc.Sequence.create(easeInA, easeInB, callBack));

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
