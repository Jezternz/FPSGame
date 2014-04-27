"use strict";
{
    window.PlayerSelf = WrapClass(window.GameObject, {

        _renderable: false,

        init: function (essentials)
        {
            var cubeGeometry = new THREE.CubeGeometry(20, 60, 20, 1, 1, 1);
            var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
            var playerBoundingBox = new THREE.Mesh(cubeGeometry, wireMaterial);
            playerBoundingBox.position.set(0, 0, 0);
            this._renderable = playerBoundingBox;
        },

    });
}