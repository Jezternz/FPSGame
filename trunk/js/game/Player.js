window.Player = WrapClass({

    _PLAYER_CAMERA_HEIGHT: 10,

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
        this._pitchObject.add(this._program.renderer.threeCamera);

        this._yawObject = new THREE.Object3D();
        this._yawObject.position.y = 10;
        this._yawObject.add(this._pitchObject);

        this.resetActions();
    },

    tick: function(tickTime)
    {

        this._delta = tickTime * 0.1;

        // surface _velocity slow down + gravity
        this._velocity.x += (-this._velocity.x) * 0.08 * this._delta;
        this._velocity.z += (-this._velocity.z) * 0.08 * this._delta;

        this._velocity.y -= 0.25 * this._delta;

        // Process updates to looking around
        if (this.actions.look.x > 0)
        {
            this._yawObject.rotation.y -= this.actions.look.x * 0.002;
        }
        if (this.actions.look.y > 0)
        {
            this._pitchObject.rotation.x -= this.actions.look.y * 0.002;
            this._pitchObject.rotation.x = Math.max(-this._PI_2, Math.min(this._PI_2, this._pitchObject.rotation.x));
        }
        
        // Process movement
        if (this.actions.jump)
        {
            this._velocity.y += 10;
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

        if (this._yawObject.position.y < this._PLAYER_CAMERA_HEIGHT)
        {

            this._velocity.y = 0;
            this._yawObject.position.y = this._PLAYER_CAMERA_HEIGHT;

            //canJump = true;

        }

        // Finally reset action state
        this.resetActions();
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
    }


});