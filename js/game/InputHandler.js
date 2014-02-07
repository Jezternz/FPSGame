window.InputHandler = WrapClass({

    _program: false,

    init: function (program)
    {
        this._program = program;
    },

    tick: function(timeElapsed)
    {
        if (this._program.keyboard.keyStatus['w'])
        {
            console.log('forward!')
        }
    }


});