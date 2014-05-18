"use strict";
{
    window.Terrain = WrapClass(window.GameObject, {

        _renderable: false,

        initAsync: function(essentials, complete)
        {
            essentials.jsonLoader.load( "models/level.js", function( geometry ) {
                var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
                mesh.scale.set( 1, 1, 1 );
                mesh.position.y = 0;
                mesh.position.x = 0;
                this._renderable = mesh;
                complete();
            }.bind(this));

            /*var floorTexture = new THREE.ImageUtils.loadTexture(essentials.imagesDirectory + 'checkerboard.jpg');
            floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
            floorTexture.repeat.set(60, 10);
            var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
            var floorGeometry = new THREE.PlaneGeometry(12000, 2000, 200, 200);
            var floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.y = 0;
            floor.rotation.x = Math.PI / 2;
            this._renderable = floor;
            complete();*/
        }

    });
}