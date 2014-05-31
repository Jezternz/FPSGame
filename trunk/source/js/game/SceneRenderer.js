"use strict";
{
    window.SceneRenderer = WrapClass({

        threeScene: false,

        _program: false,
        _renderer: false,

        _controlPoints: [],
        _playerBoundingBox: false,

        init: function (program)
        {
            this._program = program;

            this.setupListeners();
            this.setupScene();

        },

        tick: function (timeElapsed)
        {
            this._renderer.render(this.threeScene, this._program.camera.threeCamera);
        },

        setupListeners: function ()
        {
            Events.add('resize', this.resized.bind(this));
        },

        setupScene: function ()
        {
            this.threeScene = new THREE.Scene();
            this.setupRenderer();
        },

        setupRenderer: function ()
        {
            this._renderer = new THREE.WebGLRenderer({ antialias: true });
            this._renderer.setSize(this._program.screen.width, this._program.screen.height);
            this._program.rootElement.appendChild(this._renderer.domElement);
        },

        resized: function ()
        {
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        }

    });
}