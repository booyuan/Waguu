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
