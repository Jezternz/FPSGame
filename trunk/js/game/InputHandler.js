window.InputHandler = WrapClass({

    _program: false,

    init: function (program)
    {
        this._program = program;
    },

    tick: function(timeElapsed)
    {
        if (!this._program.menu.active)
        {
            this.tickMovement();
            this.tickLook();
        }
    },

    tickMovement: function()
    {
        if (this._program.events.keyDown['w'])
        {
            this._program.player.actions.movement.forward = true;
        }
        if (this._program.events.keyDown['s'])
        {
            this._program.player.actions.movement.backward = true;
        }
        if (this._program.events.keyDown['a'])
        {
            this._program.player.actions.movement.left = true;
        }
        if (this._program.events.keyDown['d'])
        {
            this._program.player.actions.movement.right = true;
        }
        if (this._program.events.keyDown['space'])
        {
            this._program.player.actions.movement.jump = true;
        }
    },

    tickLook: function()
    {      
        this._program.player.actions.look.x = this._program.events.mouseMovement.x;
        this._program.player.actions.look.y = this._program.events.mouseMovement.y;
    }

});