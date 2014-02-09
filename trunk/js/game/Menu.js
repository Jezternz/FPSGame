window.Menu = WrapClass({

    actions:
    {
        stop: true
    },

    active: true,

    init: function (program)
    {
        this._program = program;

        this.setupListeners();
        this.updateMenuState();
    },

    tick: function()
    {

    },

    setupListeners: function()
    {
        Events.add('pointerlockchange', this.pointerLockChanged.bind(this));
        Events.add('#button-play', 'click', this.playButtonPressed.bind(this));
    },

    playButtonPressed: function()
    {
        this.active = false;
        this.updateMenuState();
    },

    pointerLockChanged: function(event)
    {
        if(!pointerLockElement())
        {
            this.active = true;
            this.updateMenuState();
        }
    },

    updateMenuState: function ()
    {
        this.updateMenuDOM();
        if (!this.active)
        {
            requestPointerLock(document.body);
        }
    },

    updateMenuDOM: function()
    {
        document.getElementById('menu-overlay').style.display = (this.active ? 'block' : 'none');
    }

});