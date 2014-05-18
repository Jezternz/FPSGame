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
                "imagesDirectory": this._program.imagesDirectory,
                "jsonLoader": this._program.jsonLoader
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
            this.isRenderable(obj);

            // Add to array
            this._storeAr.push(obj);
            this._storeArLen = this._storeAr.length;
        },

        isRenderable: function(obj)
        {
            var renderable = obj.getRenderable();
            if (renderable)
            {
                this._program.renderer.threeScene.add(renderable);
            }
        },

        ready: function()
        {
            var _this = this;
            var initPromises = this._storeAr
                .filter(function(obj){ return typeof obj.initAsync === "function"; })
                .map(function(obj)
                    { 
                        return new Promise(function(resolve, reject)
                        { 
                            obj.initAsync(_this._essentials, function()
                            {
                                _this.isRenderable(obj);
                                resolve();
                            }); 
                        }); 
                    });
            return Promise.all(initPromises);
        },

        tickRender: function ()
        {
            for (var i = 0; i < this._storeArLen; i++)
            {
                this._storeAr[i].tickRender();
            }
        }

    });
}