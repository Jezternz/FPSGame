window.SceneRenderer = WrapClass({
    
    threeScene: false,

    _IMAGES_DIRECTORY: "textures/",

    _program: false,
    _renderer: false,

    _controlPoints: [],

    _teamColors: 
    {
        '0': 0xffffcc,
        '1': 0x9999ff,
        '2': 0xff9999
    },

    init: function (program)
    {
        this._program = program;

        this.setupListeners();
        this.setupScene();

    },

    tick: function (timeElapsed)
    {
        this._renderer.render(this.threeScene, this._program.camera.threeCamera);
    },

    setupListeners: function()
    {
        Events.add('resize', this.resized.bind(this));
    },

    setupScene: function ()
    {
        this.threeScene = new THREE.Scene();
        this.setupRenderer();

        this.setupPlayerBoundingbox();
        this.setupControlPoints();
        this.setupFloor();
        this.setupSkybox();
    },

    setupRenderer: function ()
    {
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setSize(this._program.screen.width, this._program.screen.height);
        this._program.rootElement.appendChild(this._renderer.domElement);
    },

    setupPlayerBoundingbox: function()
    {
        var cubeGeometry = new THREE.CubeGeometry(20, 100, 20, 1, 1, 1);
        var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        MovingCube = new THREE.Mesh(cubeGeometry, wireMaterial);
        MovingCube.position.set(0, 0, -80);
        this.threeScene.add(MovingCube);
    },

    setupControlPoints: function()
    {
        for (var i = -2; i <= 2; i++)
        {
            var team = i < 0 ? 1 : (i > 0 ? 2 : 0);
            this._controlPoints.push(this.createControlPoint(team, i * -2200, -200));
        }
    },

    createControlPoint: function(startTeam, xPos, yPos)
    {
        var cp = {
            threeObject: false,
            team: startTeam
        };

        var darkMaterial = new THREE.MeshBasicMaterial({ color: this._teamColors[startTeam] });
        var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
        var multiMaterial = [darkMaterial, wireframeMaterial];

        var
            radiusAtTop = 150,
            radiusAtBottom = 150,
            height = 4,
            segmentsAroundRadius = 6,
            segmentsAlongHeight = 1;

        var geom = new THREE.CylinderGeometry(radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight);

        cp.threeObject = THREE.SceneUtils.createMultiMaterialObject(geom, multiMaterial);
        cp.threeObject.position.set(xPos, (height / 2), yPos);

        this.threeScene.add(cp.threeObject);

        return cp;
    },

    setupFloor: function()
    {
        var floorTexture = new THREE.ImageUtils.loadTexture(this._IMAGES_DIRECTORY + 'checkerboard.jpg');
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(60, 10);
        var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
        var floorGeometry = new THREE.PlaneGeometry(12000, 2000, 200, 200);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = 0;
        floor.rotation.x = Math.PI / 2;
        this.threeScene.add(floor);
    },

    setupSkybox: function()
    {
        var imagesDir = this._IMAGES_DIRECTORY;
        var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"].map(function (tex) { return imagesDir + "dawnmountain-" + tex + ".png"; });
        var materialArray = directions.map(function (textureN) { return new THREE.MeshBasicMaterial({ "map": THREE.ImageUtils.loadTexture(textureN), "side": THREE.BackSide }); });
        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        var skyGeometry = new THREE.CubeGeometry(20000, 20000, 20000);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.threeScene.add(skyBox);
    },

    resized: function()
    {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

});