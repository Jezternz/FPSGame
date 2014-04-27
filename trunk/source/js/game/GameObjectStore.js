"use strict";
{
    window.GameObjectStore = WrapClass(
    {

        _program: false,

        _storeAr: [],
        _storeArLen: 0,
        _essentials: {},
        
        init: function(prog)
        {
            this._program = prog;
            this._essentials = {
                "imagesDirectory": this._program.imagesDirectory
            };
        },

        add: function (obj)
        {
            // Ensure it is a game object designed for this
            if (!obj._IS_GAME_OBJECT)
            {
                debugger;
                throw new Error("Attempted to add non GameObject to GameObjectStore.");
            }

            // initialize object
            if (typeof obj.init === "function")
            {
                obj.init.call(obj, this._essentials);
            }

            // Add to three scene if renderable
            var renderable = obj.getRenderable();
            if (renderable)
            {
                this._program.renderer.threeScene.add(renderable);
            }

            // Add to array
            this._storeAr.push(obj);
            this._storeArLen = this._storeAr.length;
        },

        tickRender: function ()
        {
            for (var i = 0; i < this._storeArLen; i++)
            {
                this._storeAr[i].tickRender();
            }
        },

        tickPhysics: function ()
        {
            for (var i = 0; i < this._storeArLen; i++)
            {
                this._storeAr[i].tickPhysics();
            }
        }


    });
}