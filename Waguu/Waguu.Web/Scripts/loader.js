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
/// <reference path="page.ts" />
var ClipWall;
(function (ClipWall) {
    //define utlity
    (function (u) {
        function evt(e) {
            var event = e || ClipWall.g.w.event;
            if (!event.target) {
                event.target = event.srcElement;
            }

            return event;
        }
        u.evt = evt;

        function cord(e) {
            var event = (e || ClipWall.g.w.event);
            if (event) {
                return new ClipWall.Point(event.pageX, event.pageY);
            }

            return null;
        }
        u.cord = cord;

        function fullpath(rel) {
            return ClipWall.g.h + rel;
        }
        u.fullpath = fullpath;

        function contains(elem1, elem2) {
            if (elem1 && elem2) {
                while (elem2) {
                    if (elem1 == elem2) {
                        return true;
                    }

                    elem2 = elem2.parentElement;
                }
            }

            return false;
        }
        u.contains = contains;

        function stop(event) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }
        u.stop = stop;

        function format(pattern) {
            var ps = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                ps[_i] = arguments[_i + 1];
            }
            if (!valid(ps)) {
                return pattern;
            }

            if (empty(pattern)) {
                return ps.join("");
            }

            for (var i = 0; i < ps.length; ++i) {
                pattern = pattern.replace(new RegExp("\\{" + i + "\\}", "gm"), ps[i]);
            }

            return pattern;
        }
        u.format = format;

        function empty(str) {
            return (!valid(str) || str.length === 0);
        }
        u.empty = empty;

        function valid(obj) {
            return (obj !== null && typeof obj !== "undefined");
        }
        u.valid = valid;

        function textNode(node) {
            return valid(node) && node.nodeType === 3;
        }
        u.textNode = textNode;

        function eachKid(dom, exec) {
            if (u.valid(dom) && u.valid(exec)) {
                for (var i = 0; i < dom.children.length; ++i) {
                    var result = exec(dom.children.item(i));
                    if (result) {
                        return result;
                    }
                }
            }

            return false;
        }
        u.eachKid = eachKid;

        function mouseselect(target, disable) {
            if (typeof target.onselectstart != "undefined")
                target.onselectstart = disable ? function () {
                    return false;
                } : null;
else if (typeof target.style.MozUserSelect != "undefined")
                target.style.MozUserSelect = disable ? "none" : null;
        }
        u.mouseselect = mouseselect;

        function width(elem) {
            return elem.offsetWidth | elem.clientWidth | elem.scrollWidth;
        }
        u.width = width;

        function height(elem) {
            return elem.offsetHeight | elem.clientHeight | elem.scrollHeight;
        }
        u.height = height;

        (function (AjaxMethod) {
            AjaxMethod[AjaxMethod["GET"] = 0] = "GET";
            AjaxMethod[AjaxMethod["POST"] = 1] = "POST";
        })(u.AjaxMethod || (u.AjaxMethod = {}));
        var AjaxMethod = u.AjaxMethod;

        // data is a serialized json object
        function ajax(url, method, data, success, fail) {
            // in the server side, a serialized json object is expected from json parameter name
            data = "json=" + data;

            var req;
            if (ClipWall.g.ie6) {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                req = new XMLHttpRequest();
            }

            req.open(method == AjaxMethod.GET ? "GET" : "POST", url, true);
            if (method == AjaxMethod.POST) {
                //Send the proper header information along with the request
                req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                req.setRequestHeader("Content-length", data.length.toString());
                req.setRequestHeader("Connection", "close");
            }

            req.onreadystatechange = function () {
                if (req !== null && 4 == req.readyState) {
                    // due to a webkit issue on iPhone/ipad:
                    // the request completed state will invoke the callback more than one time
                    // we release this object to make sure it's only executed once.
                    var status = req.status;
                    var content = req.responseText;
                    req = null;

                    if (200 == status) {
                        if (content && success) {
                            success(content);
                        }
                    } else if (fail) {
                        fail(status);
                    }
                }
            };

            if (method == AjaxMethod.GET) {
                req.send();
            } else {
                req.send("json=" + data);
            }
        }
        u.ajax = ajax;
    })(ClipWall.u || (ClipWall.u = {}));
    var u = ClipWall.u;
})(ClipWall || (ClipWall = {}));
/// <reference path="page.ts" />
/// <reference path="utils.ts" />
// define CSS utility
var ClipWall;
(function (ClipWall) {
    (function (Css) {
        function load(path) {
            var s = ClipWall.g.ce('link');
            ClipWall.g.sat(s, 'type', 'text/css');
            ClipWall.g.sat(s, 'rel', 'stylesheet');
            ClipWall.g.sat(s, 'href', ClipWall.u.fullpath(path));
            ClipWall.g.gt('body')[0].appendChild(s);
        }
        Css.load = load;
        function add(elem, className) {
            if (contains(elem, className)) {
                return;
            }

            elem.className += ' ' + className;
        }
        Css.add = add;

        function remove(elem, className) {
            if (!contains(elem, className)) {
                return;
            }

            var classList = elem.className.split(' ');
            var classId = classList.indexOf(className);
            if (classId >= 0) {
                classList.splice(classId, 1);
            }

            elem.className = classList.join(' ');
        }
        Css.remove = remove;

        function toggle(elem, className) {
            if (contains(elem, className)) {
                remove(elem, className);
            } else {
                add(elem, className);
            }
        }
        Css.toggle = toggle;

        function contains(elem, className) {
            var classList = elem.className.split(' ');
            return classList.indexOf(className) >= 0;
        }
        Css.contains = contains;

        function show(elem, show) {
            if (typeof show === "undefined") { show = true; }
            elem.style.display = show ? "block" : "none";
        }
        Css.show = show;
    })(ClipWall.Css || (ClipWall.Css = {}));
    var Css = ClipWall.Css;
})(ClipWall || (ClipWall = {}));
var ClipWall;
(function (ClipWall) {
    var Content = (function () {
        function Content(text, dom) {
            if (typeof text === "undefined") { text = null; }
            if (typeof dom === "undefined") { dom = null; }
            this.text = text;
            this.dom = dom;
            this.id = Content.IdGen++;
            if (ClipWall.u.valid(dom)) {
                this.imgRatio(dom);
                this.dom = dom.cloneNode(true);
            }
        }
        Content.prototype.toString = function () {
            if (!ClipWall.u.empty(this.text)) {
                return this.text;
            }

            if (ClipWall.u.valid(this.dom)) {
                // strip styles to make it consistent display
                // before stripping, clone it to a new node
                this.strip(this.dom);

                if (this.dom.tagName == "IMG") {
                    return this.dom.outerHTML;
                } else {
                    return this.dom.innerHTML;
                }
            }

            return "";
        };

        Content.prototype.strip = function (elem) {
            if (!ClipWall.u.valid(elem)) {
                return false;
            }

            elem.className = "";
            if (elem.style) {
                ClipWall.g.sat(elem, "style", "");
            }

            if (elem.tagName == "IMG") {
                var ratio = ClipWall.g.gat(elem, "data-ratio");
                if (ClipWall.u.valid(ratio)) {
                    ClipWall.g.sat(elem, "width", "250px");
                    ClipWall.g.sat(elem, "height", parseFloat(ratio) * 250 + "px");
                }

                return false;
            }

            ClipWall.u.eachKid(elem, this.strip);
            return false;
        };

        Content.prototype.imgRatio = function (elem) {
            if (!ClipWall.u.valid(elem)) {
                return false;
            }

            if (elem.tagName == "IMG") {
                var width = elem.clientWidth || elem.offsetWidth || elem.scrollWidth;
                var height = elem.clientHeight || elem.offsetHeight || elem.scrollHeight;
                if (width > 250) {
                    ClipWall.g.sat(elem, "data-ratio", "" + (height / width));
                }

                return false;
            }

            ClipWall.u.eachKid(elem, this.imgRatio);
            return false;
        };

        Content.prototype.fireAdd = function () {
            ClipWall.e.fire(Content.CADD, this);
        };

        Content.prototype.fireDel = function () {
            ClipWall.e.fire(Content.CDEL, this.id);
        };
        Content.CADD = "addcontent";
        Content.CDEL = "removecontent";

        Content.IdGen = 0;
        return Content;
    })();
    ClipWall.Content = Content;
})(ClipWall || (ClipWall = {}));
/// <reference path="content.ts" />
var ClipWall;
(function (ClipWall) {
    var Panel = (function () {
        function Panel() {
            var _this = this;
            this.modes = [];
            this.mLeft = ['0', '-300px'];
            this.mIndex = 0;
            this.panel = ClipWall.g.ce('div');
            ClipWall.g.sat(this.panel, 'class', 'panel');
            this.panel.innerHTML = "<div id='cnt' class='left'></div>" + "<div id='mnu' class='right'>" + "<ul>" + "<li class='b_expand' />" + "<li class='b_pick' />" + "<li class='b_select' />" + "<li class='b_login' />" + "<li class='b_submit' />" + "</ul>" + "</div>";

            ClipWall.g.b.insertBefore(this.panel, ClipWall.g.b.firstChild);

            //set menu item click handling
            var items = this.panel.querySelectorAll("li");
            for (var i = 0; i < items.length; ++i) {
                ClipWall.g.sat(items[i], "onclick", "panel.mc(this);");
            }

            ClipWall.e.bind(ClipWall.Content.CADD, function (args) {
                _this.newNode(args[0]);
            });

            // create default mode
            this.createMode();
        }
        Panel.CreatePanel = function () {
            return new Panel();
        };

        Panel.prototype.newNode = function (content) {
            if (!ClipWall.u.valid(content)) {
                return;
            }

            var div = ClipWall.g.ce("div");
            div.innerHTML = content.toString();
            ClipWall.g.ge("cnt").appendChild(div);
        };

        Panel.prototype.createMode = function () {
            this.modes.push(new ClipWall.SelectMode(this.panel));
            this.modes.push(new ClipWall.ClickMode(this.panel));

            // use one clip mode for default
            this.modes[0].apply();
        };

        Panel.prototype.mc = function (item) {
            switch (item.className) {
                case "b_expand":
                    this.clickExpand();
                    break;
                case "b_pick":
                    this.clickPickMode();
                    break;
                case "b_select":
                    this.clickSelectMode();
                    break;
                case "b_login":
                    this.clickLogin();
                    break;
                case "b_submit":
                    this.clickSubmit();
                    break;
            }
        };

        Panel.prototype.clickExpand = function () {
            this.panel.style.marginLeft = this.mLeft[this.mIndex];
            this.mIndex = (this.mIndex + 1) % this.mLeft.length;
        };

        Panel.prototype.clickPickMode = function () {
            var mode = this.getMode(ClipWall.ClickMode.Name);
            if (mode == null) {
                throw new Error('this mode is not supported');
            }

            this.disposeAll();
            mode.apply();
        };

        Panel.prototype.clickSelectMode = function () {
            var mode = this.getMode(ClipWall.SelectMode.Name);
            if (mode == null) {
                throw new Error('this mode is not supported');
            }

            this.disposeAll();
            mode.apply();
        };

        Panel.prototype.clickLogin = function () {
        };

        // submit the data to server
        Panel.prototype.clickSubmit = function () {
            var cnt = ClipWall.g.ge("cnt");
            var data = {
                ID: "1",
                URL: ClipWall.g.w.location.href,
                SECTIONS: [],
                IMAGES: [],
                STYLE: null
            };

            var postUri = ClipWall.g.h + "post";
            ClipWall.u.ajax(postUri, ClipWall.u.AjaxMethod.POST, JSON.stringify(data), function (res) {
                alert(res);
            }, function (fail) {
                alert("fail status:" + fail);
            });
        };

        Panel.prototype.getMode = function (name) {
            for (var i = 0; i < this.modes.length; ++i) {
                if (this.modes[i].name === name) {
                    return this.modes[i];
                }
            }

            return null;
        };

        Panel.prototype.disposeAll = function () {
            for (var i = 0; i < this.modes.length; ++i) {
                this.modes[i].dispose();
            }
        };
        return Panel;
    })();
    ClipWall.Panel = Panel;
})(ClipWall || (ClipWall = {}));
var ClipWall;
(function (ClipWall) {
    // pointer-events:none;
    var greyoutPattern = 'top:{0}px;left:{1}px;width:{2}px;height:{3}px';

    // if parameter is empty, create full screen to cover document
    function createOverlay(under) {
        var s = ClipWall.g.ce('div');
        if (under === ClipWall.g.b) {
            ClipWall.g.sat(s, 'class', 'greyout');
        } else {
            ClipWall.g.sat(s, 'class', 'overlay');
            cover(s, under);
            //s.innerHTML = "<p>drag to expand it...</p>";
        }

        // add identifier to it
        ClipWall.g.sat(s, "data-cw", "1");
        ClipWall.g.b.appendChild(s);
        return s;
    }
    ClipWall.createOverlay = createOverlay;

    function cover(overlay, under) {
        var rect = { top: 0, left: 0, width: 0, height: 0 };
        if (ClipWall.u.valid(under)) {
            rect = under.getBoundingClientRect();
        }

        ClipWall.g.sat(overlay, 'style', ClipWall.u.format(greyoutPattern, rect.top.toString(), rect.left.toString(), rect.width.toString(), rect.height.toString()));
    }
    ClipWall.cover = cover;

    function isOverlay(elem) {
        if (elem) {
            return ClipWall.g.gat(elem, "data-cw") === "1";
        }

        return false;
    }
    ClipWall.isOverlay = isOverlay;

    function updateOverlay(elem, x, y, w, h) {
        if (y !== 0)
            elem.style.top = (parseInt(elem.style.top) + y) + 'px';
        if (x !== 0)
            elem.style.left = (parseInt(elem.style.left) + x) + 'px';
        if (w !== 0)
            elem.style.width = (parseInt(elem.style.width) + w) + 'px';
        if (h !== 0)
            elem.style.height = (parseInt(elem.style.height) + h) + 'px';
    }
    ClipWall.updateOverlay = updateOverlay;
})(ClipWall || (ClipWall = {}));
// define some basic collections
var ClipWall;
(function (ClipWall) {
    (function (c) {
        var KeyValuePair = (function () {
            function KeyValuePair(key, value) {
                this.key = key;
                this.value = value;
            }
            return KeyValuePair;
        })();
        c.KeyValuePair = KeyValuePair;

        var List = (function () {
            function List() {
                this.data = [];
            }
            List.prototype.add = function (elem) {
                if (ClipWall.u.valid(elem)) {
                    this.data.push(elem);
                }
            };

            List.prototype.remove = function (elem) {
                var found = this.indexOf(elem);
                if (found != -1) {
                    this.removeAt(found);
                }
            };

            List.prototype.removeAt = function (i) {
                if (i >= 0 && i < this.count) {
                    this.data.splice(i, 1);
                }
            };

            List.prototype.item = function (i) {
                if (i >= 0 && i < this.count) {
                    return this.data[i];
                }

                return null;
            };

            List.prototype.indexOf = function (elem) {
                var found = -1;
                for (var i = 0; i < this.count; i++) {
                    if (elem === this.data[i]) {
                        found = i;
                        break;
                    }
                }

                return found;
            };

            Object.defineProperty(List.prototype, "count", {
                get: function () {
                    return this.data.length;
                },
                enumerable: true,
                configurable: true
            });
            return List;
        })();
        c.List = List;

        var Dictionary = (function () {
            function Dictionary() {
                this.keys = new List();
                this.values = new List();
            }
            Dictionary.prototype.add = function (key, value) {
                if (ClipWall.u.valid(key) && ClipWall.u.valid(value) && !this.containsKey(key)) {
                    this.keys.add(key);
                    this.values.add(value);
                }
            };

            Dictionary.prototype.containsKey = function (key) {
                if (ClipWall.u.valid(key)) {
                    return this.keys.indexOf(key) != -1;
                }

                return false;
            };

            Dictionary.prototype.containsValue = function (value) {
                if (ClipWall.u.valid(value)) {
                    return this.values.indexOf(value) != -1;
                }

                return false;
            };

            Dictionary.prototype.remove = function (key) {
                this.removeAt(this.keys.indexOf(key));
            };

            Dictionary.prototype.removeAt = function (index) {
                if (index >= 0 && index < this.count) {
                    this.keys.removeAt(index);
                    this.values.removeAt(index);
                }
            };

            Dictionary.prototype.pair = function (i) {
                if (i >= 0 && i < this.count) {
                    return new KeyValuePair(this.keys.item(i), this.values.item(i));
                }

                return null;
            };

            Object.defineProperty(Dictionary.prototype, "count", {
                get: function () {
                    return this.keys.count;
                },
                enumerable: true,
                configurable: true
            });
            return Dictionary;
        })();
        c.Dictionary = Dictionary;
    })(ClipWall.c || (ClipWall.c = {}));
    var c = ClipWall.c;
})(ClipWall || (ClipWall = {}));
var ClipWall;
(function (ClipWall) {
    var Point = (function () {
        function Point(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.from = function (me) {
            return new Point(me.clientX, me.clientY);
        };
        Point.prototype.substract = function (p) {
            return new Point(this.x - p.x, this.y - p.y);
        };

        Point.prototype.dist = function (p) {
            var gap = this.substract(p);
            return Math.sqrt(gap.x * gap.x + gap.y * gap.y);
        };
        return Point;
    })();
    ClipWall.Point = Point;
})(ClipWall || (ClipWall = {}));
/// <reference path="clip.ts" />
/// <reference path="mode.share.ts" />
/// <reference path="../lib/page.ts" />
/// <reference path="../lib/utils.ts" />
/// <reference path="../lib/coll.ts" />
/// <reference path="../lib/point.ts" />
var ClipWall;
(function (ClipWall) {
    var ClickMode = (function () {
        function ClickMode(panel) {
            var _this = this;
            this.panel = panel;
            this.selections = new ClipWall.c.Dictionary();
            this.overlays = new ClipWall.c.List();
            this.moflag = true;
            this.mouseOver = function (e) {
                if (!_this.moflag) {
                    console.log('is this useful?');
                    return;
                }

                _this.moflag = false;
                ClipWall.g.st(function () {
                    _this.moflag = true;
                }, 200);

                _this.overTarget(ClipWall.u.evt(e).target);
                ClipWall.u.stop(e);
            };

            this.mouseClick = function (e) {
                _this.clickOverlay(e);
                ClipWall.u.stop(e);
            };

            this.scroll = function () {
                _this.updateSelections();
            };
        }
        Object.defineProperty(ClickMode.prototype, "name", {
            get: function () {
                return ClickMode.Name;
            },
            enumerable: true,
            configurable: true
        });

        ClickMode.prototype.apply = function () {
            this.initOffset = new ClipWall.Point(ClipWall.g.w.pageXOffset, ClipWall.g.w.pageYOffset);
            this.hook(true);
            ClipWall.e.be(ClipWall.g.w, "scroll", this.scroll);
        };

        ClickMode.prototype.dispose = function () {
            this.hook(false);
        };

        ClickMode.prototype.hook = function (bind) {
            var handle = bind ? ClipWall.e.be : ClipWall.e.ue;
            handle(ClipWall.g.b, "mouseover", this.mouseOver);
            handle(ClipWall.g.b, "contextmenu", this.mouseClick);

            // handle(g.b, "mousemove", this.mouseMove);
            ClipWall.u.mouseselect(ClipWall.g.b, bind);
        };

        ClickMode.prototype.overTarget = function (target) {
            console.log('over: ' + target.tagName + '|x:' + target.offsetLeft + '|y:' + target.offsetTop);

            if (this.lastFocus && ClipWall.u.contains(this.lastFocus.value, target)) {
                return;
            }

            if (this.excludeNode(target)) {
                this.removeLastIfNotSelected();
                return;
            }

            if (!ClipWall.u.valid(this.lastFocus)) {
                this.lastFocus = new ClipWall.c.KeyValuePair(this.greyout(target), target);
                return;
            }

            if (target != this.lastFocus.value && !this.selections.containsValue(target)) {
                ClipWall.cover(this.lastFocus.key, target);
                this.lastFocus.value = target;
            }
        };

        ClickMode.prototype.greyout = function (target) {
            var s = ClipWall.createOverlay(target);
            this.overlays.add(s);
            ClipWall.e.be(s, "click", this.mouseClick);

            //e.be(s, "mouseout", this.removeLastIfNotSelected);
            return s;
        };

        ClickMode.prototype.clickOverlay = function (event) {
            if (!ClipWall.u.valid(event)) {
                return;
            }

            var overlay = ClipWall.u.evt(event).target;
            if (event.button === 2) {
                var lastTarget = ClipWall.u.valid(this.lastFocus) ? this.lastFocus.value : null;
                if (ClipWall.u.valid(overlay) && overlay !== lastTarget) {
                    this.overTarget(overlay);
                }
            }

            if (!ClipWall.isOverlay(overlay)) {
                return;
            }

            if (!this.selections.containsKey(overlay)) {
                if (this.lastFocus && this.lastFocus.key == overlay) {
                    if (event.button === 0) {
                        this.removeChildren(this.lastFocus.value);
                        this.selections.add(this.lastFocus.key, this.lastFocus.value);
                        new ClipWall.Content(null, this.lastFocus.value).fireAdd();
                        this.lastFocus = null;
                    }
                }
            } else {
                this.removeSelection(overlay);
            }
        };

        ClickMode.prototype.removeLastIfNotSelected = function () {
            if (ClipWall.u.valid(this.lastFocus) && !this.selections.containsKey(this.lastFocus.key)) {
                this.removeElement(this.lastFocus.key);
                this.lastFocus = null;
            }
        };

        ClickMode.prototype.removeChildren = function (elem) {
            for (var i = this.selections.count - 1; i >= 0; i--) {
                var pair = this.selections.pair(i);
                if (ClipWall.u.contains(elem, pair.value)) {
                    this.removeSelection(pair.key);
                }
            }
        };

        ClickMode.prototype.removeSelection = function (elem) {
            this.selections.remove(elem);
            this.removeElement(elem);
        };

        ClickMode.prototype.removeElement = function (elem) {
            var idx = this.overlays.indexOf(elem);
            if (idx !== -1) {
                this.overlays.removeAt(idx);
                ClipWall.g.b.removeChild(elem);
            }
        };

        ClickMode.prototype.updateSelections = function () {
            this.removeLastIfNotSelected();
            var newPoint = new ClipWall.Point(pageXOffset, pageYOffset);
            var gap = newPoint.substract(this.initOffset);
            this.initOffset = newPoint;

            for (var i = 0; i < this.selections.count; i++) {
                ClipWall.updateOverlay(this.selections.pair(i).key, -gap.x, -gap.y, 0, 0);
            }
        };

        ClickMode.prototype.excludeNode = function (elem) {
            if (!ClipWall.u.valid(elem) || ClipWall.isOverlay(elem) || elem.tagName === "IFRAME" || elem.tagName === "FORM" || elem.tagName === "INPUT" || elem.tagName === "SELECT" || elem.tagName === "TEXTAREA") {
                return true;
            }

            if (ClipWall.u.eachKid(elem, this.excludeNode)) {
                return true;
            }

            if (elem.tagName === "IMG" || ClipWall.u.textNode(elem)) {
                return false;
            }

            // maybe if the element's client height/width is too big, we should exclude
            return ClipWall.u.width(ClipWall.g.b) <= ClipWall.u.width(elem) * 2 || ClipWall.u.height(ClipWall.g.b) <= ClipWall.u.height(elem) * 2;
        };
        ClickMode.Name = "m_clk";
        return ClickMode;
    })();
    ClipWall.ClickMode = ClickMode;
})(ClipWall || (ClipWall = {}));
/// <reference path="utils.ts" />
var ClipWall;
(function (ClipWall) {
    var Scrape = (function () {
        function Scrape(start, selecting, selected) {
            var _this = this;
            this._flag = 0;
            this.onstart = start;
            this.onselecting = selecting;
            this.onselected = selected;

            this.mouseDown = function (e) {
                _this._target = ClipWall.u.evt(e).target;
                _this._position = ClipWall.Point.from(e);
                if (_this._flag === 0) {
                    _this._flag = 1;
                }

                if (ClipWall.u.valid(_this.onstart)) {
                    if (_this.onstart(_this)) {
                        ClipWall.u.stop(e);
                    }
                }
            };

            this.mouseMove = function (e) {
                if (_this._flag == 0) {
                    return;
                }

                _this._position = ClipWall.Point.from(e);
                if (_this._flag == 1) {
                    _this._flag = 2;
                }

                if (ClipWall.u.valid(_this.onselecting)) {
                    if (_this.onselecting(_this)) {
                        ClipWall.u.stop(e);
                    }
                }
            };

            this.mouseUp = function (e) {
                if (_this._flag != 2) {
                    return;
                }

                _this._flag = 0;
                if (ClipWall.u.valid(_this.onselected)) {
                    if (_this.onselected(_this)) {
                        ClipWall.u.stop(e);
                    }
                }

                _this._target = null;
            };
        }
        Object.defineProperty(Scrape.prototype, "target", {
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Scrape.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });

        Scrape.prototype.enable = function (bind) {
            var handle = bind ? ClipWall.e.be : ClipWall.e.ue;
            handle(ClipWall.g.b, "mousedown", this.mouseDown);
            handle(ClipWall.g.b, "mousemove", this.mouseMove);
            handle(ClipWall.g.b, "mouseup", this.mouseUp);
        };
        return Scrape;
    })();
    ClipWall.Scrape = Scrape;
})(ClipWall || (ClipWall = {}));
/// <reference path="mode.share.ts" />
/// <reference path="../lib/page.ts" />
/// <reference path="../lib/scrape.ts" />
/// <reference path="../lib/utils.ts" />
var ClipWall;
(function (ClipWall) {
    var DragMode = (function () {
        function DragMode() {
            var _this = this;
            this.overlays = new ClipWall.c.List();
            this.selection = new ClipWall.Scrape(function (selection) {
                _this.lastPosition = selection.position;
                return true;
            }, function (selection) {
                var newP = selection.position;
                if (!ClipWall.u.valid(_this.lastPosition)) {
                    _this.lastPosition = newP;
                    return true;
                }

                var gap = newP.substract(_this.lastPosition);
                if (!ClipWall.u.valid(_this.dragTarget)) {
                    _this.dragTarget = ClipWall.createOverlay(null);
                    ClipWall.updateOverlay(_this.dragTarget, _this.lastPosition.x, _this.lastPosition.y, gap.x, gap.y);
                } else {
                    ClipWall.updateOverlay(_this.dragTarget, 0, 0, gap.x, gap.y);
                }

                _this.lastPosition = newP;
                return true;
            }, function () {
                if (ClipWall.u.valid(_this.dragTarget)) {
                    _this.clearOverlap(_this.dragTarget.getBoundingClientRect());
                    _this.overlays.add(_this.dragTarget);
                    _this.dragTarget = null;
                }

                return true;
            });
        }
        Object.defineProperty(DragMode.prototype, "name", {
            get: function () {
                return DragMode.Name;
            },
            enumerable: true,
            configurable: true
        });

        DragMode.prototype.apply = function () {
            this.selection.enable(true);
            ClipWall.u.mouseselect(ClipWall.g.b, true);
        };

        DragMode.prototype.dispose = function () {
            this.selection.enable(false);
            ClipWall.u.mouseselect(ClipWall.g.b, false);
        };

        DragMode.prototype.clearOverlap = function (rect) {
            for (var i = this.overlays.count - 1; i >= 0; i--) {
                if (this.overlap(rect, this.overlays.item(i).getBoundingClientRect())) {
                    ClipWall.g.b.removeChild(this.overlays.item(i));
                    this.overlays.removeAt(i);
                }
            }
        };

        DragMode.prototype.overlap = function (rect1, rect2) {
            return true;
        };
        DragMode.Name = "m_drg";
        return DragMode;
    })();
    ClipWall.DragMode = DragMode;
})(ClipWall || (ClipWall = {}));
/// <reference path="clip.ts" />
/// <reference path="../lib/scrape.ts" />
var ClipWall;
(function (ClipWall) {
    var SelectMode = (function () {
        function SelectMode(panel) {
            var _this = this;
            this.panel = panel;
            this.scrape = new ClipWall.Scrape(function (scrape) {
                return false;
            }, function (scrape) {
                return false;
            }, function () {
                _this.detectSelection();
                return false;
            });
        }
        Object.defineProperty(SelectMode.prototype, "name", {
            get: function () {
                return SelectMode.Name;
            },
            enumerable: true,
            configurable: true
        });

        SelectMode.prototype.apply = function () {
            this.scrape.enable(true);
        };

        SelectMode.prototype.dispose = function () {
            this.scrape.enable(false);
        };

        SelectMode.prototype.detectSelection = function () {
            if (!ClipWall.u.contains(this.panel, this.scrape.target)) {
                var text = this.selectedText();
                if (!ClipWall.u.empty(text)) {
                    new ClipWall.Content(text, null).fireAdd();
                    this.highlight('yellow');
                }
            }
        };

        SelectMode.prototype.makeEditableAndHighlight = function (color) {
            var sel = ClipWall.g.w.getSelection();
            ClipWall.g.d.designMode = "on";
            if (sel.rangeCount && sel.getRangeAt) {
                var range = sel.getRangeAt(0);
                sel.removeAllRanges();
                sel.addRange(range);
            }

            if (!ClipWall.g.d.execCommand("HiliteColor", false, color)) {
                ClipWall.g.d.execCommand("BackColor", false, color);
            }
            ClipWall.g.d.designMode = "off";
        };

        SelectMode.prototype.highlight = function (color) {
            if (ClipWall.g.w.getSelection) {
                try  {
                    if (!document.execCommand("BackColor", false, color)) {
                        this.makeEditableAndHighlight(color);
                    }
                } catch (ex) {
                    this.makeEditableAndHighlight(color);
                }
            } else if (ClipWall.g.d.selection && ClipWall.g.d.selection.createRange) {
                // IE <= 8 case
                var range = ClipWall.g.d.selection.createRange();
                range.execCommand("BackColor", false, color);
            }
        };

        SelectMode.prototype.selectedText = function () {
            if (ClipWall.g.w.getSelection) {
                var sel = ClipWall.g.w.getSelection();
                if (sel.rangeCount && sel.getRangeAt) {
                    var r = sel.getRangeAt(0);
                    var bounding = r.getBoundingClientRect();
                    if (bounding.height * 2 < ClipWall.u.height(ClipWall.g.b) && bounding.width * 2 < ClipWall.u.width(ClipWall.g.b)) {
                        return sel.getRangeAt(0).toString();
                    }
                }
            } else if (ClipWall.g.d.selection.createRange) {
                var tr = ClipWall.g.d.selection.createRange();
                if (tr.boundingHeight * 2 < ClipWall.u.height(ClipWall.g.b) && tr.boundingWidth * 2 < ClipWall.u.width(ClipWall.g.b)) {
                    return tr.text;
                }
            }

            return '';
        };
        SelectMode.Name = "m_sel";
        return SelectMode;
    })();
    ClipWall.SelectMode = SelectMode;
})(ClipWall || (ClipWall = {}));
/// <reference path="../lib/page.ts" />
/// <reference path="../lib/utils.ts" />
/// <reference path="../lib/css.ts" />
/// <reference path="panel.ts" />
/// <reference path="mode.click.ts" />
/// <reference path="mode.drag.ts" />
/// <reference path="mode.select.ts" />
var loaded;
var panel = {};

if (!loaded) {
    loaded = true;

    // load css file we need
    ClipWall.Css.load("clip");

    // create a panel
    panel = ClipWall.Panel.CreatePanel();
}
