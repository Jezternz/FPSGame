{
    var Program = {

        _lastTickTime: 0,
        _tickTime: 0,
        _timeElapsed: 0,

        screen:
        {
            width: 0,
            height: 0
        },

        rootElement: false,

        keyboard: false,
        renderer: false,
        camera: false,
        inputs: false,

        init: function ()
        {
            this.rootElement = document.getElementById('canvas-container');
            this.calculateScreenDimensions();
            this.setupHandlers();

            this.keyboard = new KeyBoardHandler();
            this.renderer = new SceneRenderer();
            this.camera = new FPSCamera();
            this.inputs = new InputHandler();

            this.keyboard.init(this);
            this.renderer.init(this);
            this.camera.init(this);
            this.inputs.init(this);

            this._lastTickTime = this._tickTime = Date.now();
            this.tick();
        },

        tick: function ()
        {
            this._tickTime = Date.now();
            this._timeElapsed = this._tickTime - this._lastTickTime;
            requestAnimationFrame(this.tick.bind(this));

            this.inputs.tick(this._timeElapsed);
            this.renderer.tick(this._timeElapsed);

            this._lastTickTime = this._tickTime;
        },

        setupHandlers: function()
        {
            EventHandler.add('resize', this.resized.bind(this));
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
    window.start = Program.init.bind(Program);
}