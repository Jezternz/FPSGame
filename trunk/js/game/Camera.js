window.Camera = WrapClass({

    threeCamera: false,

    _program: false,

    _FIELD_OF_VIEW: 45,
    _RENDER_MIN_DISTANCE: 0.1,
    _RENDER_MAX_DISTANCE: 20000,

    init: function (program)
    {
        this._program = program;

        this.setupCamera();
        this.setupListeners();
    },

    setupCamera: function ()
    {
        this.threeCamera = new THREE.PerspectiveCamera(this._FIELD_OF_VIEW, this.aspectRatio(), this._RENDER_MIN_DISTANCE, this._RENDER_MAX_DISTANCE);
        this.threeCamera.rotation.set(0, 0, 0);
    },

    setupListeners: function ()
    {
        Events.add('resize', this.resized.bind(this));
    },

    resized: function ()
    {
        this.threeCamera.aspect = this.aspectRatio();
        this.threeCamera.updateProjectionMatrix();
    },

    aspectRatio: function()
    {
        return this._program.screen.width / this._program.screen.height;
    }   

    /*

    */


});