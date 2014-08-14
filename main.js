cc.game.onStart = function(){
	cc.view.setDesignResolutionSize(800, 480, cc.ResolutionPolicy.FIXED_WIDTH);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
    }, this);
};
cc.game.run();