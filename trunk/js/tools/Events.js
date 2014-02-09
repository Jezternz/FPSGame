window.Events = {

    _events: {},

    add: function(type, fn)
    {
        if (typeof this._events[type] === 'undefined')
        {
            this._events[type] = [];
        }
        this._events[type].push(fn);
        window.addEventListener(type, this.eventOccured.bind(this), false);
    },

    remove: function(type, fn)
    {
        // clear all events
        if (arguments.length < 1)
        {
            for (var ttype in this._events)
            {
                window.removeEventListener(ttype, this.eventOccured.bind(this), false);
                delete this._events[ttype];
            }
            return;
        }
        // clear all events of a type
        if (arguments.length < 2)
        {
            window.removeEventListener(type, this.eventOccured.bind(this), false);
            delete this._events[type];
            return;
        }

        // clear specific event
        for (var i = 0; i < this._events[type].length; i++)
        {
            if(this._events[type][i] === fn)
            {
                this._events[type].splice(i, 1);
                break;
            }
        }
        if (this._events[type].length === 0)
        {
            window.removeEventListener(type, this.eventOccured.bind(this), false);
            delete this._events[type];
        }

    },

    eventOccured: function(event)
    {
        this._events[event.type].forEach(function (fn)
        {
            fn.call(event, event);
        });
    }

};