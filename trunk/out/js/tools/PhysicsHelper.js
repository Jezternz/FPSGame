"use strict";
{
    window.PhysicsHelper = WrapClass(
    {

        // Original code "AABB-triangle overlap test code by Tomas Akenine-Möller" //
        triangleIntersectsAABB: function(triFace, aabb, cellSizes)
        {

            this.boxHalfSize = vec3.fromValues.apply(vec3, cellSizes.map(function(cS){ return cS / 2; }));

            var triVerts = [
                vec3.fromValues(triFace[0][0], triFace[0][1], triFace[0][2]),
                vec3.fromValues(triFace[1][0], triFace[1][1], triFace[1][2]),
                vec3.fromValues(triFace[2][0], triFace[2][1], triFace[2][2])
            ];

            var aaBBActualPos = vec3.fromValues((aabb[0]*cellSizes[0])+this.boxHalfSize[0], (aabb[1]*cellSizes[1])+this.boxHalfSize[1], (aabb[2]*cellSizes[2])+this.boxHalfSize[2]);

            // move everything so that the boxcenter is in (0,0,0) //
            this.v0 = vec3.subtract(vec3.create(), triVerts[0], aaBBActualPos);
            this.v1 = vec3.subtract(vec3.create(), triVerts[1], aaBBActualPos);
            this.v2 = vec3.subtract(vec3.create(), triVerts[2], aaBBActualPos);

            this.min;
            this.max;
            this.rad;
            this.fex;
            this.fey;
            this.fez;

            this.normal = vec3.create();
            this.e0 = vec3.create();
            this.e1 = vec3.create();
            this.e2 = vec3.create();

            // Now complete collisiom
            var collision = this.triBoxOverlap();

            delete this.boxHalfSize;

            delete this.v0;
            delete this.v1;
            delete this.v2;

            delete this.min;
            delete this.max;
            delete this.rad;
            delete this.fex;
            delete this.fey;
            delete this.fez;

            delete this.normal;
            delete this.e0;
            delete this.e1;
            delete this.e2;

            return collision;
        },

        triBoxOverlap: function()
        {

            //    use separating axis theorem to test overlap between triangle and box //
            //    need to test for overlap in these directions: //
            //    1) crossproduct(edge from tri, {0,1,2}-directin) //
            //       this gives 3x3=9 more tests //
            //    2) the {0,1,2}-directions (actually, since we use the AABB of the triangle //
            //       we do not even need to test these) //
            //    3) this.normal of the triangle //

            // This is the fastest branch on Sun //
            // move everything so that the boxcenter is in (0,0,0) //

            // compute triangle edges //
            vec3.subtract(this.e0,this.v1,this.v0);      // tri edge 0 //
            vec3.subtract(this.e1,this.v2,this.v1);      // tri edge 1 //
            vec3.subtract(this.e2,this.v0,this.v2);      // tri edge 2 //

            // Bullet 1:  //
            //  test the 9 tests first (this was faster) //
            this.fex = Math.abs(this.e0[0]);
            this.fey = Math.abs(this.e0[1]);
            this.fez = Math.abs(this.e0[2]);
            if(this.AXISTEST_X01(this.e0[2], this.e0[1], this.fez, this.fey) === 0 || this.AXISTEST_Y02(this.e0[2], this.e0[0], this.fez, this.fex) === 0 || this.AXISTEST_Z12(this.e0[1], this.e0[0], this.fey, this.fex) === 0)
            {
                return 0;
            }

            this.fex = Math.abs(this.e1[0]);
            this.fey = Math.abs(this.e1[1]);
            this.fez = Math.abs(this.e1[2]);
            if(this.AXISTEST_X01(this.e1[2], this.e1[1], this.fez, this.fey) === 0 || this.AXISTEST_Y02(this.e1[2], this.e1[0], this.fez, this.fex) === 0 || this.AXISTEST_Z0(this.e1[1], this.e1[0], this.fey, this.fex) === 0)
            {
                return 0;
            }

            this.fex = Math.abs(this.e2[0]);
            this.fey = Math.abs(this.e2[1]);
            this.fez = Math.abs(this.e2[2]);
            if(this.AXISTEST_X2(this.e2[2], this.e2[1], this.fez, this.fey) === 0 || this.AXISTEST_Y1(this.e2[2], this.e2[0], this.fez, this.fex) === 0 || this.AXISTEST_Z12(this.e2[1], this.e2[0], this.fey, this.fex) === 0)
            {
                return 0;
            }

            // Bullet 2: //
            //  first test overlap in the {0,1,2}-directions //
            //  find this.min, this.max of the triangle each direction, and test for overlap in //
            //  that direction -- this is equivalent to testing a minimal AABB around //
            //  the triangle against the AABB //

            // test in 0-direction //
            this.min = Math.min(this.v0[0],this.v1[0],this.v2[0]);
            this.max = Math.max(this.v0[0],this.v1[0],this.v2[0]);
            if(this.min>this.boxHalfSize[0] || this.max<-this.boxHalfSize[0]) return 0;

            // test in 1-direction //
            this.min = Math.min(this.v0[1],this.v1[1],this.v2[1]);
            this.max = Math.max(this.v0[1],this.v1[1],this.v2[1]);
            if(this.min>this.boxHalfSize[1] || this.max<-this.boxHalfSize[1]) return 0;

            // test in 2-direction //
            this.min = Math.min(this.v0[2],this.v1[2],this.v2[2]);
            this.max = Math.max(this.v0[2],this.v1[2],this.v2[2]);
            if(this.min>this.boxHalfSize[2] || this.max<-this.boxHalfSize[2]) return 0;

            // Bullet 3: //
            //  test if the box intersects the plane of the triangle //
            //  compute plane equation of triangle: this.normal*0+d=0 //
            vec3.cross(this.normal,this.e0,this.e1);

            // -NJMP- (line removed here)
            if(!this.planeBoxOverlap()) return 0;    // -NJMP-

            return 1;   // box and triangle overlaps //

        },

        planeBoxOverlap: function()    // -NJMP-
        {
          var vmin=vec3.create(),vmax=vec3.create(),v;
          for(var q=0;q<=2;q++)
          {
            v=this.v0[q];                  // -NJMP-
            if(this.normal[q]>0.0)
            {
              vmin[q]=-this.boxHalfSize[q] - v;   // -NJMP-
              vmax[q]= this.boxHalfSize[q] - v;   // -NJMP-
            }
            else
            {
              vmin[q]= this.boxHalfSize[q] - v;   // -NJMP-
              vmax[q]=-this.boxHalfSize[q] - v;   // -NJMP-
            }
          }
          if(vec3.dot(this.normal,vmin)>0.0) return 0;   // -NJMP-
          if(vec3.dot(this.normal,vmax)>=0.0) return 1;  // -NJMP-
          return 0;
        },

        //======================== 0-tests ========================//

        AXISTEST_X01: function(a, b, fa, fb)
        {
            var p0 = a*this.v0[1] - b*this.v0[2];
            var p2 = a*this.v2[1] - b*this.v2[2];
            if(p0<p2) {this.min=p0; this.max=p2;} else {this.min=p2; this.max=p0;}
            this.rad = fa * this.boxHalfSize[1] + fb * this.boxHalfSize[2];
            return (this.min>this.rad || this.max<-this.rad) ? 0 : 1;
        },

        AXISTEST_X2: function(a, b, fa, fb)
        {
            var p0 = a*this.v0[1] - b*this.v0[2];
            var p1 = a*this.v1[1] - b*this.v1[2];
            if(p0<p1) {this.min=p0; this.max=p1;} else {this.min=p1; this.max=p0;}
            this.rad = fa * this.boxHalfSize[1] + fb * this.boxHalfSize[2];
            return (this.min>this.rad || this.max<-this.rad) ? 0 : 1;
        },


        //======================== 1-tests ========================//

        AXISTEST_Y02: function(a, b, fa, fb)
        {
            var p0 = -a*this.v0[0] + b*this.v0[2];
            var p2 = -a*this.v2[0] + b*this.v2[2];
            if(p0<p2) {this.min=p0; this.max=p2;} else {this.min=p2; this.max=p0;}
            this.rad = fa * this.boxHalfSize[0] + fb * this.boxHalfSize[2];
            return (this.min>this.rad || this.max<-this.rad) ? 0 : 1;
        },

        AXISTEST_Y1: function(a, b, fa, fb)
        {
            var p0 = -a*this.v0[0] + b*this.v0[2];
            var p1 = -a*this.v1[0] + b*this.v1[2];
            if(p0<p1) {this.min=p0; this.max=p1;} else {this.min=p1; this.max=p0;}
            this.rad = fa * this.boxHalfSize[0] + fb * this.boxHalfSize[2];
            return (this.min>this.rad || this.max<-this.rad) ? 0 : 1;
        },

        //======================== 2-tests ========================//

        AXISTEST_Z12: function(a, b, fa, fb)
        {
            var p1 = a*this.v1[0] - b*this.v1[1];
            var p2 = a*this.v2[0] - b*this.v2[1];
            if(p2<p1) {this.min=p2; this.max=p1;} else {this.min=p1; this.max=p2;}
            this.rad = fa * this.boxHalfSize[0] + fb * this.boxHalfSize[1];
            return (this.min>this.rad || this.max<-this.rad) ? 0 : 1;
        },

        AXISTEST_Z0: function(a, b, fa, fb)
        {
            var p0 = a*this.v0[0] - b*this.v0[1];
            var p1 = a*this.v1[0] - b*this.v1[1];
            if(p0<p1) {this.min=p0; this.max=p1;} else {this.min=p1; this.max=p0;}
            this.rad = fa * this.boxHalfSize[0] + fb * this.boxHalfSize[1];
            return (this.min>this.rad || this.max<-this.rad) ? 0 : 1;
        }

    });
}