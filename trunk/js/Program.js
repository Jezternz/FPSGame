{
    window.Program = {

        _lastTickTime: 0,
        _tickStartTime: 0,

        _tickTime: 0,

        screen:
        {
            width: 0,
            height: 0
        },

        rootElement: false,

        events: false,
        camera: false,
        renderer: false,
        player: false,
        inputs: false,

        init: function ()
        {
            this.rootElement = document.getElementById('canvas-container');
            this.calculateScreenDimensions();
            this.setupHandlers();

            this.events = new EventHandler();
            this.camera = new Camera();
            this.renderer = new SceneRenderer();
            this.player = new Player();
            this.inputs = new InputHandler();

            this.events.init(this);
            this.camera.init(this);
            this.renderer.init(this);
            this.player.init(this);
            this.inputs.init(this);

            this._lastTickTime = this._tickStartTime = Date.now();
            this.tick();
        },

        tick: function ()
        {
            this._tickStartTime = Date.now();
            this._tickTime = this._tickStartTime - this._lastTickTime;
            requestAnimationFrame(this.tick.bind(this));

            this.inputs.tick(this._tickTime);
            this.player.tick(this._tickTime);
            this.renderer.tick(this._tickTime);

            this._lastTickTime = this._tickStartTime;
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
        }

    };
    window.start = window.Program.init.bind(window.Program);
}