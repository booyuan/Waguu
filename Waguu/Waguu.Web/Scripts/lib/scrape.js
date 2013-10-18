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
