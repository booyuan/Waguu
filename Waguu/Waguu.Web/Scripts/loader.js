var Waguu;
(function (Waguu) {
    (function (Web) {
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
        })(Web.g || (Web.g = {}));
        var g = Web.g;

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
        })(Web.e || (Web.e = {}));
        var e = Web.e;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    /// <reference path="page.ts" />
    (function (Web) {
        //define utlity
        (function (u) {
            function evt(e) {
                var event = e || Web.g.w.event;
                if (!event.target) {
                    event.target = event.srcElement;
                }

                return event;
            }
            u.evt = evt;

            function cord(e) {
                var event = (e || Web.g.w.event);
                if (event) {
                    return new Web.Point(event.pageX, event.pageY);
                }

                return null;
            }
            u.cord = cord;

            function fullpath(rel) {
                return Web.g.h + rel;
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
        })(Web.u || (Web.u = {}));
        var u = Web.u;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    /// <reference path="page.ts" />
    /// <reference path="utils.ts" />
    // define CSS utility
    (function (Web) {
        (function (Css) {
            function load(path) {
                var s = Web.g.ce('link');
                Web.g.sat(s, 'type', 'text/css');
                Web.g.sat(s, 'rel', 'stylesheet');
                Web.g.sat(s, 'href', Web.u.fullpath(path));
                Web.g.gt('body')[0].appendChild(s);
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
        })(Web.Css || (Web.Css = {}));
        var Css = Web.Css;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    (function (Web) {
        var Content = (function () {
            function Content(text, dom) {
                if (typeof text === "undefined") { text = null; }
                if (typeof dom === "undefined") { dom = null; }
                this.text = text;
                this.dom = dom;
                this.id = Content.IdGen++;
                if (Web.u.valid(dom)) {
                    this.imgRatio(dom);
                    this.dom = dom.cloneNode(true);
                }
            }
            Content.prototype.toString = function () {
                if (!Web.u.empty(this.text)) {
                    return this.text;
                }

                if (Web.u.valid(this.dom)) {
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
                if (!Web.u.valid(elem)) {
                    return false;
                }

                elem.className = "";
                if (elem.style) {
                    Web.g.sat(elem, "style", "");
                }

                if (elem.tagName == "IMG") {
                    var ratio = Web.g.gat(elem, "data-ratio");
                    if (Web.u.valid(ratio)) {
                        Web.g.sat(elem, "width", "250px");
                        Web.g.sat(elem, "height", parseFloat(ratio) * 250 + "px");
                    }

                    return false;
                }

                Web.u.eachKid(elem, this.strip);
                return false;
            };

            Content.prototype.imgRatio = function (elem) {
                if (!Web.u.valid(elem)) {
                    return false;
                }

                if (elem.tagName == "IMG") {
                    var width = elem.clientWidth || elem.offsetWidth || elem.scrollWidth;
                    var height = elem.clientHeight || elem.offsetHeight || elem.scrollHeight;
                    if (width > 250) {
                        Web.g.sat(elem, "data-ratio", "" + (height / width));
                    }

                    return false;
                }

                Web.u.eachKid(elem, this.imgRatio);
                return false;
            };

            Content.prototype.fireAdd = function () {
                Web.e.fire(Content.CADD, this);
            };

            Content.prototype.fireDel = function () {
                Web.e.fire(Content.CDEL, this.id);
            };
            Content.CADD = "addcontent";
            Content.CDEL = "removecontent";

            Content.IdGen = 0;
            return Content;
        })();
        Web.Content = Content;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    /// <reference path="content.ts" />
    (function (Web) {
        var Panel = (function () {
            function Panel() {
                var _this = this;
                this.modes = [];
                this.mLeft = ['0', '-300px'];
                this.mIndex = 0;
                this.panel = Web.g.ce('div');
                Web.g.sat(this.panel, 'class', 'panel');
                this.panel.innerHTML = "<div id='cnt' class='left'></div>" + "<div id='mnu' class='right'>" + "<ul>" + "<li class='b_expand' onclick='panel.mc(this);' />" + "<li class='b_pick' onclick='panel.mc(this);' />" + "<li class='b_select' onclick='panel.mc(this);' />" + "<li class='b_login' onclick='panel.mc(this);' />" + "</ul>" + "</div>";

                Web.g.b.insertBefore(this.panel, Web.g.b.firstChild);

                //set menu item click handling
                var items = this.panel.querySelectorAll("li");
                for (var i = 0; i < items.length; ++i) {
                    Web.g.sat(items[i], "onclick", "panel.mc(this);");
                }

                Web.e.bind(Web.Content.CADD, function (args) {
                    _this.newNode(args[0]);
                });

                // create default mode
                this.createMode();
            }
            Panel.CreatePanel = function () {
                return new Panel();
            };

            Panel.prototype.newNode = function (content) {
                if (!Web.u.valid(content)) {
                    return;
                }

                var div = Web.g.ce("div");
                div.innerHTML = content.toString();
                Web.g.ge("cnt").appendChild(div);
            };

            Panel.prototype.createMode = function () {
                this.modes.push(new Web.SelectMode(this.panel));
                this.modes.push(new Web.ClickMode(this.panel));

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
                }
            };

            Panel.prototype.clickExpand = function () {
                this.panel.style.marginLeft = this.mLeft[this.mIndex];
                this.mIndex = (this.mIndex + 1) % this.mLeft.length;
            };

            Panel.prototype.clickPickMode = function () {
                var mode = this.getMode(Web.ClickMode.Name);
                if (mode == null) {
                    throw new Error('this mode is not supported');
                }

                this.disposeAll();
                mode.apply();
            };

            Panel.prototype.clickSelectMode = function () {
                var mode = this.getMode(Web.SelectMode.Name);
                if (mode == null) {
                    throw new Error('this mode is not supported');
                }

                this.disposeAll();
                mode.apply();
            };

            Panel.prototype.clickLogin = function () {
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
        Web.Panel = Panel;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    (function (Web) {
        // pointer-events:none;
        var greyoutPattern = 'top:{0}px;left:{1}px;width:{2}px;height:{3}px';

        // if parameter is empty, create full screen to cover document
        function createOverlay(under) {
            var s = Web.g.ce('div');
            if (under === Web.g.b) {
                Web.g.sat(s, 'class', 'greyout');
            } else {
                Web.g.sat(s, 'class', 'overlay');
                cover(s, under);
                //s.innerHTML = "<p>drag to expand it...</p>";
            }

            // add identifier to it
            Web.g.sat(s, "data-cw", "1");
            Web.g.b.appendChild(s);
            return s;
        }
        Web.createOverlay = createOverlay;

        function cover(overlay, under) {
            var rect = { top: 0, left: 0, width: 0, height: 0 };
            if (Web.u.valid(under)) {
                rect = under.getBoundingClientRect();
            }

            Web.g.sat(overlay, 'style', Web.u.format(greyoutPattern, rect.top.toString(), rect.left.toString(), rect.width.toString(), rect.height.toString()));
        }
        Web.cover = cover;

        function isOverlay(elem) {
            if (elem) {
                return Web.g.gat(elem, "data-cw") === "1";
            }

            return false;
        }
        Web.isOverlay = isOverlay;

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
        Web.updateOverlay = updateOverlay;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    // define some basic collections
    (function (Web) {
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
                    if (Web.u.valid(elem)) {
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
                    if (Web.u.valid(key) && Web.u.valid(value) && !this.containsKey(key)) {
                        this.keys.add(key);
                        this.values.add(value);
                    }
                };

                Dictionary.prototype.containsKey = function (key) {
                    if (Web.u.valid(key)) {
                        return this.keys.indexOf(key) != -1;
                    }

                    return false;
                };

                Dictionary.prototype.containsValue = function (value) {
                    if (Web.u.valid(value)) {
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
        })(Web.c || (Web.c = {}));
        var c = Web.c;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    (function (Web) {
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
        Web.Point = Point;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    /// <reference path="clip.ts" />
    /// <reference path="mode.share.ts" />
    /// <reference path="../lib/page.ts" />
    /// <reference path="../lib/utils.ts" />
    /// <reference path="../lib/coll.ts" />
    /// <reference path="../lib/point.ts" />
    (function (Web) {
        var ClickMode = (function () {
            function ClickMode(panel) {
                var _this = this;
                this.panel = panel;
                this.selections = new Web.c.Dictionary();
                this.overlays = new Web.c.List();
                this.moflag = true;
                this.mouseOver = function (e) {
                    if (!_this.moflag) {
                        console.log('is this useful?');
                        return;
                    }

                    _this.moflag = false;
                    Web.g.st(function () {
                        _this.moflag = true;
                    }, 200);

                    _this.overTarget(Web.u.evt(e).target);
                    Web.u.stop(e);
                };

                this.mouseClick = function (e) {
                    _this.clickOverlay(e);
                    Web.u.stop(e);
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
                this.initOffset = new Web.Point(Web.g.w.pageXOffset, Web.g.w.pageYOffset);
                this.hook(true);
                Web.e.be(Web.g.w, "scroll", this.scroll);
            };

            ClickMode.prototype.dispose = function () {
                this.hook(false);
            };

            ClickMode.prototype.hook = function (bind) {
                var handle = bind ? Web.e.be : Web.e.ue;
                handle(Web.g.b, "mouseover", this.mouseOver);
                handle(Web.g.b, "contextmenu", this.mouseClick);

                // handle(g.b, "mousemove", this.mouseMove);
                Web.u.mouseselect(Web.g.b, bind);
            };

            ClickMode.prototype.overTarget = function (target) {
                console.log('over: ' + target.tagName + '|x:' + target.offsetLeft + '|y:' + target.offsetTop);

                if (this.lastFocus && Web.u.contains(this.lastFocus.value, target)) {
                    return;
                }

                if (this.excludeNode(target)) {
                    this.removeLastIfNotSelected();
                    return;
                }

                if (!Web.u.valid(this.lastFocus)) {
                    this.lastFocus = new Web.c.KeyValuePair(this.greyout(target), target);
                    return;
                }

                if (target != this.lastFocus.value && !this.selections.containsValue(target)) {
                    Web.cover(this.lastFocus.key, target);
                    this.lastFocus.value = target;
                }
            };

            ClickMode.prototype.greyout = function (target) {
                var s = Web.createOverlay(target);
                this.overlays.add(s);
                Web.e.be(s, "click", this.mouseClick);

                //e.be(s, "mouseout", this.removeLastIfNotSelected);
                return s;
            };

            ClickMode.prototype.clickOverlay = function (event) {
                if (!Web.u.valid(event)) {
                    return;
                }

                var overlay = Web.u.evt(event).target;
                if (event.button === 2) {
                    var lastTarget = Web.u.valid(this.lastFocus) ? this.lastFocus.value : null;
                    if (Web.u.valid(overlay) && overlay !== lastTarget) {
                        this.overTarget(overlay);
                    }
                }

                if (!Web.isOverlay(overlay)) {
                    return;
                }

                if (!this.selections.containsKey(overlay)) {
                    if (this.lastFocus && this.lastFocus.key == overlay) {
                        if (event.button === 0) {
                            this.removeChildren(this.lastFocus.value);
                            this.selections.add(this.lastFocus.key, this.lastFocus.value);
                            new Web.Content(null, this.lastFocus.value).fireAdd();
                            this.lastFocus = null;
                        }
                    }
                } else {
                    this.removeSelection(overlay);
                }
            };

            ClickMode.prototype.removeLastIfNotSelected = function () {
                if (Web.u.valid(this.lastFocus) && !this.selections.containsKey(this.lastFocus.key)) {
                    this.removeElement(this.lastFocus.key);
                    this.lastFocus = null;
                }
            };

            ClickMode.prototype.removeChildren = function (elem) {
                for (var i = this.selections.count - 1; i >= 0; i--) {
                    var pair = this.selections.pair(i);
                    if (Web.u.contains(elem, pair.value)) {
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
                    Web.g.b.removeChild(elem);
                }
            };

            ClickMode.prototype.updateSelections = function () {
                this.removeLastIfNotSelected();
                var newPoint = new Web.Point(pageXOffset, pageYOffset);
                var gap = newPoint.substract(this.initOffset);
                this.initOffset = newPoint;

                for (var i = 0; i < this.selections.count; i++) {
                    Web.updateOverlay(this.selections.pair(i).key, -gap.x, -gap.y, 0, 0);
                }
            };

            ClickMode.prototype.excludeNode = function (elem) {
                if (!Web.u.valid(elem) || Web.isOverlay(elem) || elem.tagName === "IFRAME" || elem.tagName === "FORM" || elem.tagName === "INPUT" || elem.tagName === "SELECT" || elem.tagName === "TEXTAREA") {
                    return true;
                }

                if (Web.u.eachKid(elem, this.excludeNode)) {
                    return true;
                }

                if (elem.tagName === "IMG" || Web.u.textNode(elem)) {
                    return false;
                }

                // maybe if the element's client height/width is too big, we should exclude
                return Web.u.width(Web.g.b) <= Web.u.width(elem) * 2 || Web.u.height(Web.g.b) <= Web.u.height(elem) * 2;
            };
            ClickMode.Name = "m_clk";
            return ClickMode;
        })();
        Web.ClickMode = ClickMode;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    /// <reference path="utils.ts" />
    (function (Web) {
        var Scrape = (function () {
            function Scrape(start, selecting, selected) {
                var _this = this;
                this._flag = 0;
                this.onstart = start;
                this.onselecting = selecting;
                this.onselected = selected;

                this.mouseDown = function (e) {
                    _this._target = Web.u.evt(e).target;
                    _this._position = Web.Point.from(e);
                    if (_this._flag === 0) {
                        _this._flag = 1;
                    }

                    if (Web.u.valid(_this.onstart)) {
                        if (_this.onstart(_this)) {
                            Web.u.stop(e);
                        }
                    }
                };

                this.mouseMove = function (e) {
                    if (_this._flag == 0) {
                        return;
                    }

                    _this._position = Web.Point.from(e);
                    if (_this._flag == 1) {
                        _this._flag = 2;
                    }

                    if (Web.u.valid(_this.onselecting)) {
                        if (_this.onselecting(_this)) {
                            Web.u.stop(e);
                        }
                    }
                };

                this.mouseUp = function (e) {
                    if (_this._flag != 2) {
                        return;
                    }

                    _this._flag = 0;
                    if (Web.u.valid(_this.onselected)) {
                        if (_this.onselected(_this)) {
                            Web.u.stop(e);
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
                var handle = bind ? Web.e.be : Web.e.ue;
                handle(Web.g.b, "mousedown", this.mouseDown);
                handle(Web.g.b, "mousemove", this.mouseMove);
                handle(Web.g.b, "mouseup", this.mouseUp);
            };
            return Scrape;
        })();
        Web.Scrape = Scrape;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    /// <reference path="mode.share.ts" />
    /// <reference path="../lib/page.ts" />
    /// <reference path="../lib/scrape.ts" />
    /// <reference path="../lib/utils.ts" />
    (function (Web) {
        var DragMode = (function () {
            function DragMode() {
                var _this = this;
                this.overlays = new Web.c.List();
                this.selection = new Web.Scrape(function (selection) {
                    _this.lastPosition = selection.position;
                    return true;
                }, function (selection) {
                    var newP = selection.position;
                    if (!Web.u.valid(_this.lastPosition)) {
                        _this.lastPosition = newP;
                        return true;
                    }

                    var gap = newP.substract(_this.lastPosition);
                    if (!Web.u.valid(_this.dragTarget)) {
                        _this.dragTarget = Web.createOverlay(null);
                        Web.updateOverlay(_this.dragTarget, _this.lastPosition.x, _this.lastPosition.y, gap.x, gap.y);
                    } else {
                        Web.updateOverlay(_this.dragTarget, 0, 0, gap.x, gap.y);
                    }

                    _this.lastPosition = newP;
                    return true;
                }, function () {
                    if (Web.u.valid(_this.dragTarget)) {
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
                Web.u.mouseselect(Web.g.b, true);
            };

            DragMode.prototype.dispose = function () {
                this.selection.enable(false);
                Web.u.mouseselect(Web.g.b, false);
            };

            DragMode.prototype.clearOverlap = function (rect) {
                for (var i = this.overlays.count - 1; i >= 0; i--) {
                    if (this.overlap(rect, this.overlays.item(i).getBoundingClientRect())) {
                        Web.g.b.removeChild(this.overlays.item(i));
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
        Web.DragMode = DragMode;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
var Waguu;
(function (Waguu) {
    /// <reference path="clip.ts" />
    /// <reference path="../lib/scrape.ts" />
    (function (Web) {
        var SelectMode = (function () {
            function SelectMode(panel) {
                var _this = this;
                this.panel = panel;
                this.scrape = new Web.Scrape(function (scrape) {
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
                if (!Web.u.contains(this.panel, this.scrape.target)) {
                    var text = this.selectedText();
                    if (!Web.u.empty(text)) {
                        new Web.Content(text, null).fireAdd();
                        this.highlight('yellow');
                    }
                }
            };

            SelectMode.prototype.makeEditableAndHighlight = function (color) {
                var sel = Web.g.w.getSelection();
                Web.g.d.designMode = "on";
                if (sel.rangeCount && sel.getRangeAt) {
                    var range = sel.getRangeAt(0);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }

                if (!Web.g.d.execCommand("HiliteColor", false, color)) {
                    Web.g.d.execCommand("BackColor", false, color);
                }
                Web.g.d.designMode = "off";
            };

            SelectMode.prototype.highlight = function (color) {
                if (Web.g.w.getSelection) {
                    try  {
                        if (!document.execCommand("BackColor", false, color)) {
                            this.makeEditableAndHighlight(color);
                        }
                    } catch (ex) {
                        this.makeEditableAndHighlight(color);
                    }
                } else if (Web.g.d.selection && Web.g.d.selection.createRange) {
                    // IE <= 8 case
                    var range = Web.g.d.selection.createRange();
                    range.execCommand("BackColor", false, color);
                }
            };

            SelectMode.prototype.selectedText = function () {
                if (Web.g.w.getSelection) {
                    var sel = Web.g.w.getSelection();
                    if (sel.rangeCount && sel.getRangeAt) {
                        var r = sel.getRangeAt(0);
                        var bounding = r.getBoundingClientRect();
                        if (bounding.height * 2 < Web.u.height(Web.g.b) && bounding.width * 2 < Web.u.width(Web.g.b)) {
                            return sel.getRangeAt(0).toString();
                        }
                    }
                } else if (Web.g.d.selection.createRange) {
                    var tr = Web.g.d.selection.createRange();
                    if (tr.boundingHeight * 2 < Web.u.height(Web.g.b) && tr.boundingWidth * 2 < Web.u.width(Web.g.b)) {
                        return tr.text;
                    }
                }

                return '';
            };
            SelectMode.Name = "m_sel";
            return SelectMode;
        })();
        Web.SelectMode = SelectMode;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
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
    Waguu.Web.Css.load("clip");

    // create a panel
    panel = Waguu.Web.Panel.CreatePanel();
}
