// TODO
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "fr",
                spritewidth: "64",
                spriteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                    //change hitbox width and height\\
                }
            }]);
        this.renderable.addAnimation("idle", [39]);
        this.renderable.addAnimation("smallWalk", [143, 144, 145, 146, 147, 148, 149, 150, 151], 80);

        this.renderable.setCurrentAnimation("idle");

        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    },
    //direction mario is walking

    update: function(delta) {

        if (me.input.isKeyPressed("right")) {
            // flip the sprite on horizontal axis
            this.flipX(false);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('left')) {
            // unflip the sprite
            this.flipX(true);
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
            }
        }




        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        //animation\\

        if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }


        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        
 // "b" represents waht were running into       
        if(response.b.type === 'badguy') {
            if(ydif <= -115){
                response.b.alive = false;
            }else {
                me.state.change(me.state.MENU);
            }
          
        }
    }


});
game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer();
    }
    
});
// Code for the bad guy
game.BadGuy = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spriteheight: "28",
                width: 60,
                height: 28,
                getShape: function() {
                    return(new me.Rect(0, 0, 60, 28)).toPolygon();
                    //change hitbox width and height\\
                }
            }]);

        this.spritewidth = 60;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endx = x + width - this.spritewidth;
        this.pos.x = x + width -this.spritewidth;
        this.updateBounds();

// alwaysUpdate tells us that even if our character is not on the screen, the bad guy should be updated
        this.alwaysUpdate = true;

        this.walkLeft = false;
        this.alive = true;
        this.type = "badguy";

        this.body.setVelocity(4, 6);

    },
    // delta tells computer last time it was updated  
    update: function(delta) {
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

// setting up the variable
        if (this.alive) {
            if (this.walkleft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            // to the left of the colon, false, but to the right of the colon, true
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;


        } else {
            me.game.world.removeChild(this);
        }

        this._super(me.Entity, "update", [delta]);
        return true;

    },
    collideHandler: function() {

    }

});