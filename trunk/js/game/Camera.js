window.Camera = WrapClass({

    threeCamera: false,

    _program: false,

    init: function (program)
    {
        this._program = program;

        this.setupCamera();
        this.setupListeners();

    },

    setupCamera: function ()
    {
        var VIEW_ANGLE = 45, ASPECT = this._program.screen.width / this._program.screen.height, NEAR = 0.1, FAR = 20000;
        this.threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this._program.renderer.add(this.threeCamera);
        this.threeCamera.position.set(0, 150, 400);
        this.threeCamera.rotation.set(0, 0, 0);
    },

    setupListeners: function ()
    {
        Events.add('resize', this.resized.bind(this));
    },

    resized: function ()
    {
        this.threeCamera.aspect = this._program.screen.width / this._program.screen.height;
        this.threeCamera.updateProjectionMatrix();
    }

    /*

    */


});