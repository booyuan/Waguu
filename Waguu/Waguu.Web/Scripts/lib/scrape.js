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
