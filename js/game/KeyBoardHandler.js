window.KeyBoardHandler = WrapClass({

    keyStatus: {},

    _keyMappings:
    {
        8: "backspace", 9: "tab", 13: "enter", 16: "shift",
        17: "ctrl", 18: "alt", 27: "esc", 32: "space",
        33: "pageup", 34: "pagedown", 35: "end", 36: "home",
        37: "left", 38: "up", 39: "right", 40: "down",
        45: "insert", 46: "delete", 186: ";", 187: "=",
        188: ",", 189: "-", 190: ".", 191: "/",
        219: "[", 220: "\\", 221: "]", 222: "'"
    },

    init:function()
    {
        this.initDocumentListeners();
    },

    destroy: function()
    {
        this.removeDocumentListeners();
    },

    initDocumentListeners: function ()
    {
        EventHandler.add("keydown", this.keyDown.bind(this));
        EventHandler.add("keyup", this.keyUp.bind(this));
    },

    sanatizeKey: function (evt)
    {
        var keyCode = evt.keyCode;
        return (this._keyMappings[keyCode] != null ? this._keyMappings[keyCode] : String.fromCharCode(keyCode)).toLowerCase();
    },

    keyDown: function (evt)
    {
        var key = this.sanatizeKey(evt);
        if (!this.keyStatus[key])
        {
            this.keyStatus[key] = true;
        }
    },

    keyUp: function (evt)
    {
        var key = this.sanatizeKey(evt);
        if (this.keyStatus[key])
        {
            this.keyStatus[key] = false;
        }
    },

    clear: function()
    {
        for(var key in this.keyStatus)
        {
            delete this.keyStatus[key];
        }
    }

});