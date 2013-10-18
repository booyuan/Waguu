define(["require", "exports"], function(require, exports) {
    ;

    // Module
    (function (Utils) {
        // Class
        var Point = (function () {
            // Constructor
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            // Instance member
            Point.prototype.getDist = function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            };

            Object.defineProperty(Point.prototype, "name", {
                get: function () {
                    return "shawn";
                },
                enumerable: true,
                configurable: true
            });

            Point.origin = new Point(0, 0);
            return Point;
        })();
        Utils.Point = Point;

        function start() {
            // Local variables
            var p = new Utils.Point(3, 4);
        }
        Utils.start = start;
    })(exports.Utils || (exports.Utils = {}));
    var Utils = exports.Utils;
});
