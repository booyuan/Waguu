/// <reference path="clip.ts" />
/// <reference path="mode.share.ts" />
/// <reference path="../lib/page.ts" />
/// <reference path="../lib/utils.ts" />
/// <reference path="../lib/coll.ts" />
/// <reference path="../lib/point.ts" />
var ClipWall;
(function (ClipWall) {
    var ClickMode = (function () {
        function ClickMode(panel) {
            var _this = this;
            this.panel = panel;
            this.selections = new ClipWall.c.Dictionary();
            this.overlays = new ClipWall.c.List();
            this.moflag = true;
            this.mouseOver = function (e) {
                if (!_this.moflag) {
                    console.log('is this useful?');
                    return;
                }

                _this.moflag = false;
                ClipWall.g.st(function () {
                    _this.moflag = true;
                }, 200);

                _this.overTarget(ClipWall.u.evt(e).target);
                ClipWall.u.stop(e);
            };

            this.mouseClick = function (e) {
                _this.clickOverlay(e);
                ClipWall.u.stop(e);
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
            this.initOffset = new ClipWall.Point(ClipWall.g.w.pageXOffset, ClipWall.g.w.pageYOffset);
            this.hook(true);
            ClipWall.e.be(ClipWall.g.w, "scroll", this.scroll);
        };

        ClickMode.prototype.dispose = function () {
            this.hook(false);
        };

        ClickMode.prototype.hook = function (bind) {
            var handle = bind ? ClipWall.e.be : ClipWall.e.ue;
            handle(ClipWall.g.b, "mouseover", this.mouseOver);
            handle(ClipWall.g.b, "contextmenu", this.mouseClick);

            // handle(g.b, "mousemove", this.mouseMove);
            ClipWall.u.mouseselect(ClipWall.g.b, bind);
        };

        ClickMode.prototype.overTarget = function (target) {
            console.log('over: ' + target.tagName + '|x:' + target.offsetLeft + '|y:' + target.offsetTop);

            if (this.lastFocus && ClipWall.u.contains(this.lastFocus.value, target)) {
                return;
            }

            if (this.excludeNode(target)) {
                this.removeLastIfNotSelected();
                return;
            }

            if (!ClipWall.u.valid(this.lastFocus)) {
                this.lastFocus = new ClipWall.c.KeyValuePair(this.greyout(target), target);
                return;
            }

            if (target != this.lastFocus.value && !this.selections.containsValue(target)) {
                ClipWall.cover(this.lastFocus.key, target);
                this.lastFocus.value = target;
            }
        };

        ClickMode.prototype.greyout = function (target) {
            var s = ClipWall.createOverlay(target);
            this.overlays.add(s);
            ClipWall.e.be(s, "click", this.mouseClick);

            //e.be(s, "mouseout", this.removeLastIfNotSelected);
            return s;
        };

        ClickMode.prototype.clickOverlay = function (event) {
            if (!ClipWall.u.valid(event)) {
                return;
            }

            var overlay = ClipWall.u.evt(event).target;
            if (event.button === 2) {
                var lastTarget = ClipWall.u.valid(this.lastFocus) ? this.lastFocus.value : null;
                if (ClipWall.u.valid(overlay) && overlay !== lastTarget) {
                    this.overTarget(overlay);
                }
            }

            if (!ClipWall.isOverlay(overlay)) {
                return;
            }

            if (!this.selections.containsKey(overlay)) {
                if (this.lastFocus && this.lastFocus.key == overlay) {
                    if (event.button === 0) {
                        this.removeChildren(this.lastFocus.value);
                        this.selections.add(this.lastFocus.key, this.lastFocus.value);
                        new ClipWall.Content(null, this.lastFocus.value).fireAdd();
                        this.lastFocus = null;
                    }
                }
            } else {
                this.removeSelection(overlay);
            }
        };

        ClickMode.prototype.removeLastIfNotSelected = function () {
            if (ClipWall.u.valid(this.lastFocus) && !this.selections.containsKey(this.lastFocus.key)) {
                this.removeElement(this.lastFocus.key);
                this.lastFocus = null;
            }
        };

        ClickMode.prototype.removeChildren = function (elem) {
            for (var i = this.selections.count - 1; i >= 0; i--) {
                var pair = this.selections.pair(i);
                if (ClipWall.u.contains(elem, pair.value)) {
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
                ClipWall.g.b.removeChild(elem);
            }
        };

        ClickMode.prototype.updateSelections = function () {
            this.removeLastIfNotSelected();
            var newPoint = new ClipWall.Point(pageXOffset, pageYOffset);
            var gap = newPoint.substract(this.initOffset);
            this.initOffset = newPoint;

            for (var i = 0; i < this.selections.count; i++) {
                ClipWall.updateOverlay(this.selections.pair(i).key, -gap.x, -gap.y, 0, 0);
            }
        };

        ClickMode.prototype.excludeNode = function (elem) {
            if (!ClipWall.u.valid(elem) || ClipWall.isOverlay(elem) || elem.tagName === "IFRAME" || elem.tagName === "FORM" || elem.tagName === "INPUT" || elem.tagName === "SELECT" || elem.tagName === "TEXTAREA") {
                return true;
            }

            if (ClipWall.u.eachKid(elem, this.excludeNode)) {
                return true;
            }

            if (elem.tagName === "IMG" || ClipWall.u.textNode(elem)) {
                return false;
            }

            // maybe if the element's client height/width is too big, we should exclude
            return ClipWall.u.width(ClipWall.g.b) <= ClipWall.u.width(elem) * 2 || ClipWall.u.height(ClipWall.g.b) <= ClipWall.u.height(elem) * 2;
        };
        ClickMode.Name = "m_clk";
        return ClickMode;
    })();
    ClipWall.ClickMode = ClickMode;
})(ClipWall || (ClipWall = {}));
