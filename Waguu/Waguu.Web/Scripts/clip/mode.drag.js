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
