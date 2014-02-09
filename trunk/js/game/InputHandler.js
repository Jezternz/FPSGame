window.InputHandler = WrapClass({

    _program: false,

    init: function (program)
    {
        this._program = program;
    },

    tick: function(timeElapsed)
    {
        this.tickMovement();
        this.tickLook();

        this._program.events.resetMouseMovement();
    },

    tickMovement: function()
    {
        if (this._program.events.keyStatus['w'])
        {
            this._program.player.actions.movement.forward = true;
        }
        if (this._program.events.keyStatus['s'])
        {
            this._program.player.actions.movement.backward = true;
        }
        if (this._program.events.keyStatus['a'])
        {
            this._program.player.actions.movement.left = true;
        }
        if (this._program.events.keyStatus['d'])
        {
            this._program.player.actions.movement.right = true;
        }
        if (this._program.events.keyStatus['space'])
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