"use strict";
{
    window.Player = WrapClass({

        _minPlayerHeight: 40,

        _program: false,
        _delta: 0,

        _pitchObject: false,
        _yawObject: false,

        _lookVelocity: false,
        _velocity: false,

        _collisions: [],

        _PI_2: (Math.PI / 2),

        _gravityAcceleration: 0.05,

        // Defaults must be set in resetActions()
        actions:
        {
            movement:
            {
                forward: false,
                backward: false,
                left: false,
                right: false,
                jump: false,
                run: false
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
            this._lookVelocity = new THREE.Vector3();

            this._pitchObject = new THREE.Object3D();
            this._pitchObject.add(this._program.camera.threeCamera);

            this._yawObject = new THREE.Object3D();
            this._yawObject.position.y = this._minPlayerHeight;
            this._yawObject.add(this._pitchObject);

            this._program.renderer.threeScene.add(this._yawObject);

            this._yawObject.translateX(0);
            this._yawObject.translateY(100);
            this._yawObject.translateZ(0);

            this.resetActions();
        },

        tick: function (tickTime)
        {
            // delta is the time passed, movement needs to be multiplied by the time passed, as the times for each tick can be inconsistent, however movement must remain consistent
            this._delta = tickTime * 0.1;
            this.computeNextPosition(tickTime);
            this.resolveCollisions();

        },

        computeNextPosition: function(tickTime)
        {
            // surface _velocity slow down + gravity
            this._velocity.x += (-this._velocity.x) * 0.08 * this._delta;
            this._velocity.z += (-this._velocity.z) * 0.08 * this._delta;
            this._velocity.y -= this._gravityAcceleration * this._delta;

            // Process updates to looking around
            this._lookVelocity.y = (this.actions.look.x === 0) ? 0 : -(this.actions.look.x * 0.002);
            this._lookVelocity.x = (this.actions.look.y === 0) ? 0 : -(this.actions.look.y * 0.002);

            // Process movement
            if (this.actions.movement.jump)
            {
                this._velocity.y += 0.18;
            }

            if (this.actions.movement.forward)
            {
                this._velocity.z -= (this.actions.movement.run ? 0.4 : 0.2) * this._delta;
            }
            if (this.actions.movement.backward)
            {
                this._velocity.z += 0.2 * this._delta
            }
            if (this.actions.movement.left)
            {
                this._velocity.x -= 0.2 * this._delta;
            }
            if (this.actions.movement.right)
            {
                this._velocity.x += 0.2 * this._delta;
            }
        },

        testCollisions: function()
        {
            this._collisions = this.calculateCollisions();

            if(this._yawObject.position.y+this._velocity.y<-400)
            {
                this._collisions.push(1);
            }
        },

        resolveCollisions: function()
        {

            // Create an Object3D Clone to work out future position
            var clone = this._yawObject.clone();
            clone.translateX(this._velocity.x);
            clone.translateY(this._velocity.y);
            clone.translateZ(this._velocity.z);

            // Calculate new location
            var currentPosition = [this._yawObject.position.x, this._yawObject.position.y, this._yawObject.position.z];
            var futurePosition = [clone.position.x, clone.position.y, clone.position.z];
            var halfSizes = [10, 30, 10];
            var collidedFuturePosition = this._program.physics.computePlayerMovement(currentPosition, futurePosition, halfSizes);

            // Update (Camera look) _yawObject based on _velocity changes
            this._pitchObject.rotation.x = Math.max(-this._PI_2, Math.min(this._PI_2, (this._pitchObject.rotation.x + this._lookVelocity.x)));
            this._yawObject.rotation.y += this._lookVelocity.y;

            if(currentPosition[0] !== collidedFuturePosition[0])this._yawObject.translateX(this._velocity.x);
            else this._velocity.x = 0;

            if(currentPosition[1] !== collidedFuturePosition[1])this._yawObject.translateY(this._velocity.y);
            else this._velocity.y = 0;

            if(currentPosition[2] !== collidedFuturePosition[2])this._yawObject.translateZ(this._velocity.z);
            else this._velocity.z = 0;

        },

        resetActions: function ()
        {
            this.actions.movement.forward = false;
            this.actions.movement.backward = false;
            this.actions.movement.left = false;
            this.actions.movement.right = false;
            this.actions.movement.jump = false;
            this.actions.movement.run = false;
            this.actions.look.x = 0;
            this.actions.look.y = 0;
        }


    });
}