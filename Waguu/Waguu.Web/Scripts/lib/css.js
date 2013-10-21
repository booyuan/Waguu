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
