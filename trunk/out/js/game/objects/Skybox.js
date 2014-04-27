"use strict";
{
    window.Skybox = WrapClass(window.GameObject, {

        _renderable: false,

        init: function (essentials)
        {
            var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"].map(function (tex) { return essentials.imagesDirectory + "dawnmountain-" + tex + ".png"; });
            var materialArray = directions.map(function (textureN) { return new THREE.MeshBasicMaterial({ "map": THREE.ImageUtils.loadTexture(textureN), "side": THREE.BackSide }); });
            var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
            var skyGeometry = new THREE.CubeGeometry(20000, 20000, 20000);
            var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
            this._renderable = skyBox;
        },

    });
}