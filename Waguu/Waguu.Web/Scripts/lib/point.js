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
