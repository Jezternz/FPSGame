"use strict";
{
    window.Events = {

        _events: {},

        _prefixes: ['', 'moz', 'webkit'],

        getTarget: function (type)
        {
            if (type === "resize")
            {
                return window;
            }
            else
            {
                return document;
            }
        },

        sanatizeType: function (type)
        {
            var prefixedType;
            for (var i = 0; i < this._prefixes.length; i++)
            {
                prefixedType = this._prefixes[i] + type;
                if (('on' + prefixedType) in this.getTarget(type))
                {
                    return prefixedType;
                }
            }
            throw new Error("No matching event type '" + type + "'.");
        },

        add: function (a, b, c)
        {
            var target, type, fn;
            if (arguments.length === 2)
            {
                target = this.getTarget(a);
                type = a;
                fn = b;
            }
            else
            {
                target = document.querySelector(a);
                type = b;
                fn = c;
            }

            type = this.sanatizeType(type);
            if (typeof this._events[type] === 'undefined')
            {
                this._events[type] = [];
            }
            this._events[type].push(fn);
            target.addEventListener(type, this.eventOccured.bind(this), false);
        },

        remove: function (a, b, c)
        {
            var target, type, fn;
            if (arguments.length === 2)
            {
                target = this.getTarget(a);
                type = a;
                fn = b;
            }
            else
            {
                target = document.querySelector(a);
                type = b;
                fn = c;
            }

            // clear all events
            if (arguments.length < 1)
            {
                for (var ttype in this._events)
                {
                    this.getTarget(ttype).removeEventListener(ttype, this.eventOccured.bind(this), false);
                    delete this._events[ttype];
                }
                return;
            }
            type = this.sanatizeType(type);
            // clear all events of a type
            if (arguments.length < 2)
            {
                this.getTarget(type).removeEventListener(type, this.eventOccured.bind(this), false);
                delete this._events[type];
                return;
            }

            // clear specific event
            for (var i = 0; i < this._events[type].length; i++)
            {
                if (this._events[type][i] === fn)
                {
                    this._events[type].splice(i, 1);
                    break;
                }
            }
            if (this._events[type].length === 0)
            {
                this.getTarget(type).removeEventListener(type, this.eventOccured.bind(this), false);
                delete this._events[type];
            }

        },

        eventOccured: function (event)
        {
            this._events[event.type].forEach(function (fn)
            {
                fn.call(event, event);
            });
        }

    };
}