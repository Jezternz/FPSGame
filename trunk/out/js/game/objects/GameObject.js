"use strict";
{
    window.GameObject = WrapClass({

        _IS_GAME_OBJECT: true,

        _renderable: false,

        getRenderable: function()
        {
            return this._renderable;
        },

        tickRender: function ()
        {
            // shim for render
        },

        tickPhysics: function ()
        {
            // shim for physics calculate
        }

    });
}