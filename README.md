# FPSGame

<img src="https://raw.githubusercontent.com/Jezternz/FPSGame/master/trunk/source/screenshot.png" height="200" >

This was a small side-project I did a bit of work on, basically combining different examples and hacks to build a basic First Person Shooter (FPS) game in webgl, in its current state the collision needs a rewrite.

Feel free to strip what you want from it or improve upon it. I was hoping to make it a simple multiplayer game with a single weapon, and may still if I get time.

### Installation
* Checkout this repo
* Install NodeJS
* Run trunk\build\_install.bat - this will install required web-server modules
* Run trunk\build\_watch.bat - This will run a web server
* Browse to "http://localhost:8080/index.htm" in google chrome

### Controls
* [W] [S] [D] [A] for movement, 
* [space] for jetpack (hold down for more effect)
* [MouseX] / [MouseY] for look

### Implemented
* Basic build process using grunt
* Basic 3d Camera
* Basic keyboard & mouse input
* 3d Model import
* Basic collision

### Issues
* Current implementation does not handel moving along a flat surface, collision is calculated for all directions and prevented in all directions if there is a collision, this needs to be fixed!

### Improvements
* Improve / Fix collisions
* Need to implement a weapon of some sort, and projectile collision.
