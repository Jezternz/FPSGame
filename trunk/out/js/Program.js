"use strict";
(function()
{
    window.Program = {

        _lastTickTime: 0,
        _tickStartTime: 0,

        _tickTime: 0,

        imagesDirectory: "textures/",

        screen:
        {
            width: 0,
            height: 0
        },

        menuActive: true,

        rootElement: false,

        events: false,
        camera: false,
        renderer: false,
        objects: false,
        physics: false,
        player: false,
        inputs: false,
        menu: false,

        jsonLoader: false,

        init: function ()
        {
            this.startGameSetup()
                .then(this.setupGame.bind(this))
                .then(this.initializeGame.bind(this))
                .then(this.addObjects.bind(this))
                .then(this.finalizeGameSetup.bind(this))
                .then(function()
                {
                    console.log("Setup Complete, Game running...");
                })
                .catch(console.error.bind(console));
        },

        startGameSetup: function()
        {
            return new Promise(function(resolve, reject)
            {
                this.rootElement = document.getElementById('canvas-container');
                this.jsonLoader = new THREE.JSONLoader();
                this.calculateScreenDimensions();
                this.setupHandlers();
                resolve();
            }.bind(this));
        },

        setupGame: function()
        {
            return new Promise(function(resolve, reject)
            {
                this.events = new EventHandler();
                this.camera = new Camera();
                this.renderer = new SceneRenderer();
                this.objects = new GameObjectStore();
                this.physics = new Physics();
                this.player = new Player();
                this.inputs = new InputHandler();
                this.menu = new Menu();
                resolve();
            }.bind(this));
        },

        initializeGame: function()
        {
            return new Promise(function(resolve, reject)
            {
                this.events.init(this);
                this.camera.init(this);
                this.renderer.init(this);
                this.objects.init(this);
                this.physics.init(this);
                this.player.init(this);
                this.inputs.init(this);
                this.menu.init(this);
                resolve();
            }.bind(this));
        },

        addObjects: function()
        {
            return new Promise(function(resolve, reject)
            {
                this.objects.add(new Skybox());
                this.objects.add(new Terrain());
                this.objects.add(new PlayerSelf());
                this.objects.ready()
                    .then(this.physics.ready.bind(this.physics))
                    .then(resolve);
            }.bind(this));
        },

        finalizeGameSetup: function()
        {
            return new Promise(function(resolve, reject)
            {
                this._lastTickTime = this._tickStartTime = Date.now();
                this.tick();
                resolve();
            }.bind(this));
        },

        setupHandlers: function()
        {
            Events.add('resize', this.resized.bind(this));
        },

        resized: function ()
        {
            this.calculateScreenDimensions();
        },

        calculateScreenDimensions: function()
        {
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;
        },

        tick: function ()
        {
            // Ensure next frame is fired as soon as processor is finished with any remaining work
            requestAnimationFrame(this.tick.bind(this));

            // Calculate time difference since last tick
            this._tickStartTime = Date.now();
            this._tickTime = this._tickStartTime - this._lastTickTime;

            // Inputs & Menu (If required)
            this.inputs.tick(this._tickTime);
            this.menu.tick(this._tickTime);

            // Player, world
            this.player.tick(this._tickTime);
            this.renderer.tick(this._tickTime);

            // Reset tick state
            this.events.resetEvents();
            this.player.resetActions();

            // Finally assign previous tick time to the current tick time (ready for the next tick)
            this._lastTickTime = this._tickStartTime;
        }

    };
    window.start = window.Program.init.bind(window.Program);
}
)();