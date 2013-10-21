var ClipWall;
(function (ClipWall) {
    // define global variables
    (function (g) {
        g.d = document;
        g.w = window;
        g.b = (g.d.body || g.gt('body')[0]);
        g.ie = !!g.w["ActiveXObject"];
        g.ie6 = g.ie && !g.w["XMLHttpRequest"];
        g.st = function (handler, time) {
            return g.w.setTimeout(handler, time);
        };
        g.ge = function (id) {
            return g.d.getElementById(id);
        };
        g.gt = function (tag) {
            return g.d.getElementsByTagName(tag);
        };
        g.ce = function (tag) {
            return g.d.createElement(tag);
        };
        g.gat = function (elem, name) {
            return elem.getAttribute(name);
        };
        g.sat = function (elem, name, val) {
            return elem.setAttribute(name, val);
        };

        //replace this with final domain when publish
        g.h = "http://localhost:22128/";
    })(ClipWall.g || (ClipWall.g = {}));
    var g = ClipWall.g;

    // define events utility
    (function (e) {
        // private fields
        var cache = {};

        // c_evt.fire(event, arguments);
        function fire(e) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            var handlers = cache[e];
            if (handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i](args);
                }
            }
        }
        e.fire = fire;

        // c_evt.bind(event, handler);
        function bind(event, handler) {
            var handlers = cache[event];
            if (!handlers) {
                handlers = [];
            }

            handlers.push(handler);
            cache[event] = handlers;
        }
        e.bind = bind;

        // c_evt.unbind(pressEvent, press);
        function unbind(event, handler) {
            var handlers = cache[event];
            if (handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    if (handlers[i] == handler) {
                        handlers.splice(i, 1);
                    }
                }
            }
        }
        e.unbind = unbind;

        function be(element, event, handler) {
            if (element.addEventListener) {
                element.addEventListener(event, handler);
                return;
            }

            if (element.attachEvent) {
                element.attachEvent("on" + event, handler);
                return;
            }

            element["on" + event] = handler;
        }
        e.be = be;

        function ue(element, event, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(event, handler);
                return;
            }

            if (element.detachEvent) {
                element.detachEvent("on" + event, handler);
                return;
            }

            element["on" + event] = null;
        }
        e.ue = ue;

        function trigger(element, event) {
            if (element.dispatchEvent) {
                var e = g.d.createEvent("HTMLEvents");
                e.initEvent(event.type, true, false);
                element.dispatchEvent(e);
            } else if (element.fireEvent) {
                element.fireEvent("on" + event.type);
            }
        }
        e.trigger = trigger;
    })(ClipWall.e || (ClipWall.e = {}));
    var e = ClipWall.e;
})(ClipWall || (ClipWall = {}));
