window.Player = WrapClass({

    _PLAYER_CAMERA_HEIGHT: 0,

    _program: false,
    _delta: 0,

    _pitchObject: false,
    _yawObject: false,
    _velocity: false,

    _PI_2: (Math.PI / 2),

    // Defaults must be set in resetActions()
    actions:
    {
        movement:
        {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false
        },
        look:
        {
            x: false,
            y: false
        }
    },

    init: function (program)
    {
        this._program = program;
        this._velocity = new THREE.Vector3();

        this._pitchObject = new THREE.Object3D();
        this._pitchObject.add(this._program.camera.threeCamera);

        this._yawObject = new THREE.Object3D();
        this._yawObject.position.y = this._PLAYER_CAMERA_HEIGHT;
        this._yawObject.add(this._pitchObject);

        this._program.renderer.threeScene.add(this._yawObject);

        this.resetActions();
    },

    tick: function(tickTime)
    {

        // delta is the time passed, movement needs to be multiplied by the time passed, as the times for each tick can be inconsistent, however movement must remain consistent
        this._delta = tickTime * 0.1;

        // surface _velocity slow down + gravity
        this._velocity.x += (-this._velocity.x) * 0.08 * this._delta;
        this._velocity.z += (-this._velocity.z) * 0.08 * this._delta;
        this._velocity.y -= 0.25 * this._delta;

        // Process updates to looking around
        if (this.actions.look.x !== 0)
        {
            this._yawObject.rotation.y -= this.actions.look.x * 0.002;
        }
        if (this.actions.look.y !== 0)
        {
            this._pitchObject.rotation.x -= this.actions.look.y * 0.002;
            this._pitchObject.rotation.x = Math.max(-this._PI_2, Math.min(this._PI_2, this._pitchObject.rotation.x));
        }
        
        // Process movement
        if (this.actions.movement.jump)
        {
            this._velocity.y += 1;
        }
        if (this.actions.movement.forward)
        {
            this._velocity.z -= 0.12 * this._delta;
        }
        if (this.actions.movement.backward)
        {
            this._velocity.z += 0.12 * this._delta
        }
        if (this.actions.movement.left)
        {
            this._velocity.x -= 0.12 * this._delta;
        }
        if (this.actions.movement.right)
        {
            this._velocity.x += 0.12 * this._delta;
        }

        // Update _yawObject based on _velocity changes
        this._yawObject.translateX(this._velocity.x);
        this._yawObject.translateY(this._velocity.y);
        this._yawObject.translateZ(this._velocity.z);

        // If camera gets below minimum height (including camera off the ground)
        if (this._yawObject.position.y <= this._PLAYER_CAMERA_HEIGHT)
        {

            // Put the player on the ground
            this._yawObject.position.y = this._PLAYER_CAMERA_HEIGHT;
            this._velocity.y = 0;

            //canJump = true;

        }
    },

    resetActions: function()
    {
        this.actions.movement.forward = false;
        this.actions.movement.backward = false;
        this.actions.movement.left = false;
        this.actions.movement.right = false;
        this.actions.movement.jump = false;
        this.actions.look.x = 0;
        this.actions.look.y = 0;
    },

    getPosition: function (vec3)
    {
        vec3 = tvec3 || new THREE.Vector3();
        var rotation = new THREE.Euler(0, 0, 0, "YXZ");
        rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
        vec3.copy(new THREE.Vector3(0, 0, -1)).applyEuler(rotation);
        return vec3;
    }


});