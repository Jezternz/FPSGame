/**
 * A Flying Camera allows free motion around the scene using FPS style controls (WASD + mouselook)
 * This type of camera is good for displaying large scenes
 */
var FlyingCamera = Object.create(Object, {
    _angles: {
        value: null
    },

    angles: {
        get: function() {
            return this._angles;
        },
        set: function(value) {
            this._angles = value;
            this._dirty = true;
        }
    },

    _position: {
        value: null
    },

    position: {
        get: function() {
            return this._position;
        },
        set: function(value) {
            this._position = value;
            this._dirty = true;
        }
    },

    speed: {
        value: 100
    },

    _dirty: {
        value: true
    },

    _cameraMat: {
        value: null
    },

    _pressedKeys: {
        value: null
    },

    _viewMat: {
        value: null
    },

    viewMat: {
        get: function() {
            if(this._dirty) {
                var mv = this._viewMat;
                mat4.identity(mv);
                mat4.rotateX(mv, this.angles[0]-Math.PI/2.0);
                mat4.rotateZ(mv, this.angles[1]);
                mat4.rotateY(mv, this.angles[2]);
                mat4.translate(mv, [-this.position[0], -this.position[1], - this.position[2]]);
                this._dirty = false;
            }

            return this._viewMat;
        }
    },

    init: {
        value: function(canvas) {
            this.angles = vec3.create();
            this.position = vec3.create();
            this.pressedKeys = new Array(128);

            // Initialize the matricies
            this.projectionMat = mat4.create();
            this._viewMat = mat4.create();
            this._cameraMat = mat4.create();

            // Set up the appropriate event hooks
            var moving = false;
            var lastX, lastY;
            var self = this;

            window.addEventListener("keydown", function(event) {
                self.pressedKeys[event.keyCode] = true;
            }, false);

            window.addEventListener("keyup", function(event) {
                self.pressedKeys[event.keyCode] = false;
            }, false);

            canvas.addEventListener('mousedown', function(event) {
                if(event.which == 1) {
                    moving = true;
                }
                lastX = event.pageX;
                lastY = event.pageY;
            }, false);

            canvas.addEventListener('mousemove', function(event) {
                if (moving) {
                    var xDelta = event.pageX  - lastX;
                    var yDelta = event.pageY  - lastY;
                    lastX = event.pageX;
                    lastY = event.pageY;

                    self.angles[1] += xDelta*0.025;
                    while (self.angles[1] < 0)
                        self.angles[1] += Math.PI*2;
                    while (self.angles[1] >= Math.PI*2)
                        self.angles[1] -= Math.PI*2;

                    self.angles[0] += yDelta*0.025;
                    while (self.angles[0] < -Math.PI*0.5)
                        self.angles[0] = -Math.PI*0.5;
                    while (self.angles[0] > Math.PI*0.5)
                        self.angles[0] = Math.PI*0.5;

                    self._dirty = true;
                }
            }, false);

            canvas.addEventListener('mouseup', function(event) {
                moving = false;
            }, false);

            return this;
        }
    },

    update: {
        value: function(frameTime) {
            var dir = [0, 0, 0];

            var speed = (this.speed / 1000) * frameTime;

            // This is our first person movement code. It's not really pretty, but it works
            if(this.pressedKeys['W'.charCodeAt(0)]) {
                dir[1] += speed;
            }
            if(this.pressedKeys['S'.charCodeAt(0)]) {
                dir[1] -= speed;
            }
            if(this.pressedKeys['A'.charCodeAt(0)]) {
                dir[0] -= speed;
            }
            if(this.pressedKeys['D'.charCodeAt(0)]) {
                dir[0] += speed;
            }
            if(this.pressedKeys[32]) { // Space, moves up
                dir[2] += speed;
            }
            if(this.pressedKeys[17]) { // Ctrl, moves down
                dir[2] -= speed;
            }

            if(dir[0] != 0 || dir[1] != 0 || dir[2] != 0) {
                var cam = this._cameraMat;
                mat4.identity(cam);
                mat4.rotateX(cam, this.angles[0]);
                mat4.rotateZ(cam, this.angles[1]);
                mat4.inverse(cam);

                mat4.multiplyVec3(cam, dir);

                // Move the camera in the direction we are facing
                vec3.add(this.position, dir);

                this._dirty = true;
            }
        }
    }
});

/******/
// During your init code
var camera = Object.create(FlyingCamera).init(canvasElement);

// During your draw loop
camera.update(16); // 16ms per-frame == 60 FPS

// Bind a shader, etc, etc...
gl.uniformMatrix4fv(shaderUniformModelViewMat, false, camera.viewMat);