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
