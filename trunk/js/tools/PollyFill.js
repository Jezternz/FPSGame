var requestPointerLock = function (el)
{
    if (el.RequestPointerLock)
    {
        el.RequestPointerLock();
    }
    else if (el.webkitRequestPointerLock)
    {
        el.webkitRequestPointerLock();
    }
    else if (el.mozRequestPointerLock)
    {
        el.mozRequestPointerLock();
    }
};

var exitPointerLock = function (el)
{
    if (el.exitPointerLock)
    {
        el.exitPointerLock();
    }
    else if (el.webkitExitPointerLock)
    {
        el.webkitExitPointerLock();
    }
    else if (el.mozExitPointerLock)
    {
        el.mozExitPointerLock();
    }
};

var pointerLockElement = function()
{
    return document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement
}