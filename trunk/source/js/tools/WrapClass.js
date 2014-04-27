"use strict";
{
    var copy = function (fromObj, toObj)
    {
        if (null == fromObj || "object" != typeof fromObj) return fromObj;
        var c = toObj ? toObj : (Array.isArray(fromObj) ? [] : {});
        for (var attr in fromObj)
        {
            if (fromObj.hasOwnProperty(attr)) c[attr] = copy(fromObj[attr]);
        }
        return c;
    }
    window.WrapClass = function ()
    {
        var args = Array.prototype.slice.call(arguments, 0);
        var newClass = args.pop();
        var inheritFromClasses = args;
        var combinedClass = function ()
        {
            var oiriginal = {};
            var o = {};
            for (var i = 0; i < inheritFromClasses.length; i++)
            {
                copy(new inheritFromClasses[i](), o);
            }
            copy(newClass, o);
            if (typeof o.constructor === "function")
            {
                o.constructor.apply(o, arguments);
            }
            return o;
        };
        return combinedClass;
    }
}