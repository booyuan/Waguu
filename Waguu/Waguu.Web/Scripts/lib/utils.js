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
