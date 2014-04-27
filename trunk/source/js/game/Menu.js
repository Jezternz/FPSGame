"use strict";
{
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

        tick: function ()
        {

        },

        setupListeners: function ()
        {
            Events.add('pointerlockchange', this.pointerLockChanged.bind(this));
            Events.add('#button-play', 'click', this.playButtonPressed.bind(this));
            Events.add('#form-menu', 'submit', this.preventDefault);
        },

        playButtonPressed: function ()
        {
            this.active = false;
            this.updateMenuState();
        },

        preventDefault: function (evt)
        {
            evt.preventDefault();
        },

        pointerLockChanged: function (event)
        {
            if (!pointerLockElement())
            {
                this.active = true;
                this.updateMenuState();
            }
        },

        updateMenuState: function ()
        {
            this.updateMenuDOM();
            if (this.active)
            {
                document.getElementById('button-play').focus();
            }
            else (!this.active)
            {
                requestPointerLock(document.body);
            }
        },

        updateMenuDOM: function ()
        {
            document.getElementById('menu-overlay').style.display = (this.active ? 'block' : 'none');
        }

    });
}