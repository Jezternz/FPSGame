{
    var copy = function (obj)
    {
        if (null == obj || "object" != typeof obj) return obj;
        var c = Array.isArray(obj) ? [] : {};
        for (var attr in obj)
        {
            if (obj.hasOwnProperty(attr)) c[attr] = copy(obj[attr]);
        }
        return c;
    }
    window.WrapClass = function (obj)
    {
        return function ()
        {
            var o = copy(obj);
            if (typeof o.constructor === "function")
            {
                o.constructor.apply(o, arguments);
            }
            return o;
        };
    }
}