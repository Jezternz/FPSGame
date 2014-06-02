"use strict";
{
    window.Physics = WrapClass(
    {

        _maxGridSize: 30,
        _program: false,

        grid: {},
        physicsHelper: false,

        divider: "|",

        xMin: Number.MAX_VALUE, 
        xMax: Number.MIN_VALUE, 
        yMin: Number.MAX_VALUE, 
        yMax: Number.MIN_VALUE,
        zMin: Number.MAX_VALUE, 
        zMax: Number.MIN_VALUE,

        cellSize: 0,

        vertices:[],
        faces:[],
        
        init: function(prog)
        {
            this._program = prog;
            this.physicsHelper = new PhysicsHelper();
        },

        ready: function()
        {
            return new Promise(function(resolve, reject)
            {
                this._program.jsonLoader.load( "models/level.js", function( geometry ) {
                    this.setupPhysicsEngine(geometry);
                    if(this._program._debuggingActive)
                    {
                        this.addHitboxRendering();
                    }
                    resolve();
                }.bind(this));                
            }.bind(this));
        },

        computePlayerMovement: function(currentPosition, futurePosition, halfSizes)
        {
            // NEED TO GO ACROSS ALL AABB's at some point and make them consistent. -- Make them Float32Ar ?


            var aabb = [futurePosition[0]-halfSizes[0], futurePosition[0]+halfSizes[0], futurePosition[1]-halfSizes[1], futurePosition[1]+halfSizes[1], futurePosition[2]-halfSizes[2], futurePosition[2]+halfSizes[2]];

            var
                name,
                cellAABB = this.translateCoordinatesAABBToCellsAABB(aabb),
                xCell=cellAABB[0],
                xCellMax=cellAABB[1],
                yCell=cellAABB[2],
                yCellMax=cellAABB[3],
                zCell=cellAABB[4],
                zCellMax=cellAABB[5];

            var checks = [];


            var rAr = [];

            // Loop through all cells
            for(var x=xCell;x <= xCellMax;x++)
            {
                for(var y=yCell;y <= yCellMax;y++)
                {
                    for(var z=zCell;z <= zCellMax;z++)
                    {
                        // If there are faces in the cell, loop through them
                        name = x+this.divider+y+this.divider+z;
                        rAr.push(name);
                        if(typeof this.grid[name] !== "undefined")
                        {
                            for(var i=0;i<this.grid[name].length;i++)
                            {
                                if(checks.indexOf(this.grid[name][i]) === -1)
                                {
                                    checks.push(this.grid[name][i]);
                                }
                            }
                        }
                        
                    }                    
                }                
            }

            // loop through faces and test collisions.
            var collisions = [];
            for(var j=0;j<checks.length;j++)
            {
                var faceIndices = this.faces[checks[j]];
                var face = [this.vertices[faceIndices[0]], this.vertices[faceIndices[1]], this.vertices[faceIndices[2]]];

                var aabb2 = [
                    ((aabb[0]+aabb[1])/2),
                    ((aabb[2]+aabb[3])/2),
                    ((aabb[4]+aabb[5])/2),
                    ((aabb[0] > aabb[1])? aabb[0]-aabb[1] : aabb[1]-aabb[0]) /2,
                    ((aabb[2] > aabb[3])? aabb[2]-aabb[3] : aabb[3]-aabb[2]) /2,
                    ((aabb[4] > aabb[5])? aabb[4]-aabb[5] : aabb[5]-aabb[4]) /2
                ];

                // Format actual central pos x y z size x y z
                if(this.physicsHelper.aabbIntersectsTriangle(aabb2, face))
                {
                    collisions.push(checks[j]);
                }
            }

            if(this._program._debuggingActive)
            {                
                this.addUserHitBoxRendering(aabb, cellAABB, rAr, checks, collisions);
            }

            return collisions.length > 0 ? currentPosition : futurePosition;

        },

        addUserHitBoxRendering: function(playerAABB, playerCellsAABB, overlappingCells, overlappingFaces, actualCollisionFaces)
        {
            if(this.updateFlat || ((typeof this.lastHappen !== "undefined") && (this.lastHappen+100 > performance.now())))
            {
                return;
            }       
            this.lastHappen = performance.now();
            playerAABB = playerAABB.map(function(aa, i){return (aa).toFixed(3);});
            if(this.rAr)
            {
                this.rAr.forEach(function(box){ this._program.renderer.threeScene.remove(box); }.bind(this));
            }

            Stats.update("physics", (
                "CellSize:<br />" + this.cellSize + "<br /><br />" +
                "OriginalAABB<br />" + playerAABB.join(", ") + "<br /><br />"+
                "CellsAABB:<br />" + playerCellsAABB.join(", ") + "<br /><br />" +
                "OverlappingCellsList:<br />" + overlappingCells.join(", ") + "<br /><br />" +
                "PossibleOverlappingFaceList (" + overlappingFaces.length + "):<br />" + overlappingFaces.join(", ") + "<br /><br />" +
                "ActualOverlappingFaceList (" + actualCollisionFaces.length + "):<br />" + actualCollisionFaces.join(", ")
            ));

            if(typeof this.statsListenerSet==="undefined")
            {
                document.addEventListener("keydown", function(evt){ 
                    // pressing or q
                    if(evt.which === 81){ this.updateFlat = !this.updateFlat; }; 
                }.bind(this), false);
                this.statsListenerSet = true;
            }

            this.updatePlayerBoundingBox.apply(this, playerAABB.map(function(num){ return parseFloat(num); }));

            this.rAr = [];
            var half=(this.cellSize/2);
            overlappingCells.forEach(function(key)
            {
                var pos = key.split(this.divider);
                var geometry = new THREE.CubeGeometry(this.cellSize, this.cellSize, this.cellSize, 1, 1, 1);
                var material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
                var box = new THREE.Mesh(geometry, material);
                box.position.set((pos[0]*this.cellSize)+half, (pos[1]*this.cellSize)+half, (pos[2]*this.cellSize)+half);
                this._program.renderer.threeScene.add(box);
                this.rAr.push(box);
            }.bind(this));
        },

        updatePlayerBoundingBox: function(x, x2, y, y2, z, z2)
        {

            x = ((x + x2) / 2);
            y = ((y + y2) / 2);
            z = ((z + z2) / 2);

            if(!this.playerBoundingBox)
            {
                var cubeGeometry = new THREE.CubeGeometry(20, 60, 20, 1, 1, 1);
                var wireMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                this.playerBoundingBox = new THREE.Mesh(cubeGeometry, wireMaterial);
                this.playerBoundingBox.position.set(0, 0, 0);
                this._program.renderer.threeScene.add(this.playerBoundingBox);
            }
            this.playerBoundingBox.position.x = x;
            this.playerBoundingBox.position.y = y;
            this.playerBoundingBox.position.z = z;
        },



        addHitboxRendering: function()
        {
            var half=this.cellSize/2;
            Object.keys(this.grid).forEach(function(key)
            {
                var pos = key.split(this.divider);
                var geometry = new THREE.CubeGeometry(this.cellSize, this.cellSize, this.cellSize, 1, 1, 1);
                var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
                var box = new THREE.Mesh(geometry, material);
                box.position.set((pos[0]*this.cellSize)+half, (pos[1]*this.cellSize)+half, (pos[2]*this.cellSize)+half);
                this._program.renderer.threeScene.add(box);
            }.bind(this));
        },

        setupPhysicsEngine: function(geometry)
        {
            this.vertices = geometry.vertices.map(function(vertex){ return [vertex.x, vertex.y, vertex.z]; });
            this.faces = geometry.faces.map(function(face){ return [face.a, face.b, face.c]; });
            this.calculateGridSizing();
            this.buildCollisionMap();
        },

        calculateGridSizing: function()
        {
            this.vertices.forEach(function(vertex)
            {
                if(vertex[0] > this.xMax)this.xMax = vertex[0];
                else if(vertex[0] < this.xMin)this.xMin = vertex[0];
                if(vertex[1] > this.yMax)this.yMax = vertex[1];
                else if(vertex[1] < this.yMin)this.yMin = vertex[1];
                if(vertex[2] > this.zMax)this.zMax = vertex[2];
                else if(vertex[2] < this.zMin)this.zMin = vertex[2];
            }.bind(this));
            var 
                xTotal=this.xMax-this.xMin, 
                yTotal=this.yMax-this.yMin, 
                zTotal=this.zMax-this.zMin;
            var maxAxisSize = Math.max(xTotal, yTotal, zTotal);
            this.cellSize = maxAxisSize / this._maxGridSize;
            console.log('x=', xTotal, ' y=', yTotal, ' z=', zTotal, ' max=', maxAxisSize, ' cell=', this.cellSize);
        },

        buildCollisionMap: function()
        {
            this.faces.forEach(this.insertFaceIntoGrid.bind(this));
        },

        insertFaceIntoGrid: function(face, faceIndx)
        {
            this.calculateIntersectingCells(face).forEach(function(cellIndexStr)
            {
                if(typeof this.grid[cellIndexStr] === "undefined")
                {
                    this.grid[cellIndexStr] = [];
                }
                this.grid[cellIndexStr].push(faceIndx);
            }.bind(this));
        },

        calculateIntersectingCells: function(face)
        {
            // Calculate an AABB for face
            var faceAABB = this.calculateFaceAABB(face);

            var indices = [];
            if(indices.some(function(index){ return face === this.faces[index]; }.bind(this)))console.log(face.toString(), '--------------------->');
            if(indices.some(function(index){ return face === this.faces[index]; }.bind(this)))console.log(face.toString(), '-CellSize------------>', this.cellSize);
            if(indices.some(function(index){ return face === this.faces[index]; }.bind(this)))console.log(face.toString(), '-CoordinatesAABB----->', faceAABB);

            var cellsAABB = this.translateCoordinatesAABBToCellsAABB(faceAABB);

            if(indices.some(function(index){ return face === this.faces[index]; }.bind(this)))console.log(face.toString(), '-CellsAABB----------->', cellsAABB);

            // Work out possible cells using aabb
            var matchingCells = this.calculateCellsUsingAABB(cellsAABB);

            if(indices.some(function(index){ return face === this.faces[index]; }.bind(this)))console.log(face.toString(), '-Cells(', matchingCells.length, ')--------->', matchingCells.join(this.divider));

            // Eliminate not valid cells
            matchingCells = this.eliminateNonMatchingCells(face, matchingCells);

            if(indices.some(function(index){ return face === this.faces[index]; }.bind(this)))console.log(face.toString(), '-CulledCells(', matchingCells.length, ')--->', matchingCells.join(this.divider));

            // Generate strings
            return matchingCells.map(function(cellPos){ return cellPos.join(this.divider); }.bind(this)); 
        },

        calculateFaceAABB: function(face)
        {
            return [
                // xMin
                Math.min(this.vertices[face[0]][0], this.vertices[face[1]][0], this.vertices[face[2]][0]),
                // xMax
                Math.max(this.vertices[face[0]][0], this.vertices[face[1]][0], this.vertices[face[2]][0]),
                // yMin
                Math.min(this.vertices[face[0]][1], this.vertices[face[1]][1], this.vertices[face[2]][1]),
                // yMax
                Math.max(this.vertices[face[0]][1], this.vertices[face[1]][1], this.vertices[face[2]][1]),
                // zMin
                Math.min(this.vertices[face[0]][2], this.vertices[face[1]][2], this.vertices[face[2]][2]),
                // zMax
                Math.max(this.vertices[face[0]][2], this.vertices[face[1]][2], this.vertices[face[2]][2])
            ];
        },

        // AABB is currently lowerX, upperX, lowerY, upperY, lowerZ, upperZ
        translateCoordinatesAABBToCellsAABB: function(aabb)
        {
            var temp, aabbOut = aabb.map(function(n){ return n/this.cellSize; }.bind(this));
            if(aabbOut[0] > aabbOut[1])
            {
                temp = aabbOut[0];
                aabbOut[0] = aabbOut[1];
                aabbOut[1] = temp;
            }
            if(aabbOut[2] > aabbOut[3])
            {
                temp = aabbOut[2];
                aabbOut[2] = aabbOut[3];
                aabbOut[3] = temp;
            }
            if(aabbOut[4] > aabbOut[5])
            {
                temp = aabbOut[4];
                aabbOut[4] = aabbOut[5];
                aabbOut[5] = temp;
            }            
            return aabbOut.map(function(n, i){ return Math.floor(n); });
        },

        calculateCellsUsingAABB: function(aabb)
        {
            var cells = [];
            for(var x=aabb[0];x<=aabb[1];x++)
            {
                for(var y=aabb[2];y<=aabb[3];y++)
                {
                    for(var z=aabb[4];z<=aabb[5];z++)
                    {
                        cells.push([x,y,z]);
                    }
                }
            }
            return cells;
        },

        eliminateNonMatchingCells: function(face, matchingCells)
        {
            return matchingCells.filter(function(aabb)
            {
                var sFace = face.map(function(vI){ return this.vertices[vI]; }.bind(this));

                // AABB is X-center-point, Y-center-point, Z-center-point, x-half-size, y-half-size, z-half-size
                var halfSize = this.cellSize/2;
                var completeAABB = [
                    ((aabb[0]*this.cellSize)+halfSize), 
                    ((aabb[1]*this.cellSize)+halfSize), 
                    ((aabb[2]*this.cellSize)+halfSize), 
                    halfSize, 
                    halfSize, 
                    halfSize
                ];

                return this.physicsHelper.aabbIntersectsTriangle(completeAABB, sFace);
            }.bind(this));
        }

    });
}