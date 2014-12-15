game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        
        // reset the score
        game.data.score = 0;

        me.levelDirector.loadLevel("level04");

        this.resetPlayer(0, 420);

        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, 'left');
        me.input.bindKey(me.input.KEY.UP, 'jump');

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    },
    resetPlayer: function() {
        var player = me.pool.pull("fr", 0, 420, {});
        me.game.world.addChild(player, 22);
    }

});
