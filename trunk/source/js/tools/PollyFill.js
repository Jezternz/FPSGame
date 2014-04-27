"use strict";
{
    window.requestPointerLock = function (el)
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

    window.exitPointerLock = function (el)
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

    window.pointerLockElement = function ()
    {
        return document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement
    }
}