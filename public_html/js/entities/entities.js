// TODO
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        settings.image = "mario";
        settings.spritewidth = "128";
        settings.spriteheight = "128";
        settings.width = 128;
        settings.height = 128;
        this._super(me.Entity, 'init', [x, y, settings]);
        
        this.body.setVelocity(5, 0);

    },
    
    update: function(dt) {
        if (me.input.isKeyPressed("right")) {
            tis.body.vel.x += this.body.accel.x * me.timer.tick;
        }else{
            this.body
        }
    }

});