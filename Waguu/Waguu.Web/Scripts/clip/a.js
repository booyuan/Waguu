var c;
(function (c) {
    // define global variables
    (function (g) {
        g.d = document;
        g.w = window;
        g.ie = !!g.w["ActiveXObject"];
        g.ie6 = g.ie && !g.w["XMLHttpRequest"];
        g.st = g.w.setTimeout;
        g.ge = g.d.getElementById;
    })(c.g || (c.g = {}));
    var g = c.g;

    // define events utility
    (function (e) {
        // private fields
        var cache = {};

        // c_evt.fire(event, arguments);
        function fire(e) {
            var handlers = cache[e];
            if (handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i](arguments);
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
    })(c.e || (c.e = {}));
    var e = c.e;
})(c || (c = {}));
/// <reference path="../lib/page.ts" />
var lastelem;

c.e.be(c.g.d, "mouseover", function (e) {
    alert(e);
    var event = e || c.g.w.event;

    if (lastelem) {
        lastelem.style.border = "1px solid #fff";
    }

    var target = event.target || event.srcElement;

    // document.getElementById('display').innerHTML = target.previousSibling.tagName + " | " + target.tagName + " | " + (target.nextSibling ? target.nextSibling.tagName : "X");
    target.style.border = "1px solid";
    lastelem = target;
});
