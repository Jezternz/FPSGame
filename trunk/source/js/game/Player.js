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

        _gravityAcceleration: 0.005,

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

            this._yawObject.translateY(100);

            this.resetActions();
        },

        tick: function (tickTime)
        {
            // delta is the time passed, movement needs to be multiplied by the time passed, as the times for each tick can be inconsistent, however movement must remain consistent
            this._delta = tickTime * 0.1;

            this.computeNextPosition(tickTime);
            this.testCollisions();
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
            if (this.actions.movement.jump /*&& this._yawObject.position.y === this._minPlayerHeight*/)
            {
                this._velocity.y += 0.03;
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
            this._collisions.length = 0;

            var newPos = [this._yawObject.position.x+this._velocity.x, this._yawObject.position.y+this._velocity.y, this._yawObject.position.z+this._velocity.z];
            var size = [20, 60, 20].map(function(r){ return r/2; });
            // PosX PosX2 PosY PosY2 PosZ PosZ2
            var playerAABB = [newPos[0]-size[0], newPos[0]+size[0], newPos[1]-size[1], newPos[1]+size[1], newPos[2]-size[2], newPos[2]+size[2]];

            this._collisions = this._program.physics.calculateAABBAgainstGeometryCollisions(playerAABB);

            if(this._yawObject.position.y+this._velocity.y<-400)
            {
                this._collisions.push(1);
            }
        },

        resolveCollisions: function()
        {

            // Update _yawObject based on _velocity changes

            if(this._collisions.length === 0)
            {
                this._yawObject.rotation.y += this._lookVelocity.y;
                this._pitchObject.rotation.x += this._lookVelocity.x;
                this._pitchObject.rotation.x = Math.max(-this._PI_2, Math.min(this._PI_2, this._pitchObject.rotation.x));
                
                this._yawObject.translateY(this._velocity.y);
                this._yawObject.translateX(this._velocity.x);
                this._yawObject.translateZ(this._velocity.z);
            }
            else
            {
                this._velocity.x = 0;
                this._velocity.y = 0;
                this._velocity.z = 0;
            }

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
}