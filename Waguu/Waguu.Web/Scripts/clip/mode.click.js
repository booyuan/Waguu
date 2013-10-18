var Waguu;
(function (Waguu) {
    /// <reference path="clip.ts" />
    /// <reference path="mode.share.ts" />
    /// <reference path="../lib/page.ts" />
    /// <reference path="../lib/utils.ts" />
    /// <reference path="../lib/coll.ts" />
    /// <reference path="../lib/point.ts" />
    (function (Web) {
        var ClickMode = (function () {
            function ClickMode(panel) {
                var _this = this;
                this.panel = panel;
                this.selections = new Web.c.Dictionary();
                this.overlays = new Web.c.List();
                this.moflag = true;
                this.mouseOver = function (e) {
                    if (!_this.moflag) {
                        console.log('is this useful?');
                        return;
                    }

                    _this.moflag = false;
                    Web.g.st(function () {
                        _this.moflag = true;
                    }, 200);

                    _this.overTarget(Web.u.evt(e).target);
                    Web.u.stop(e);
                };

                this.mouseClick = function (e) {
                    _this.clickOverlay(e);
                    Web.u.stop(e);
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
                this.initOffset = new Web.Point(Web.g.w.pageXOffset, Web.g.w.pageYOffset);
                this.hook(true);
                Web.e.be(Web.g.w, "scroll", this.scroll);
            };

            ClickMode.prototype.dispose = function () {
                this.hook(false);
            };

            ClickMode.prototype.hook = function (bind) {
                var handle = bind ? Web.e.be : Web.e.ue;
                handle(Web.g.b, "mouseover", this.mouseOver);
                handle(Web.g.b, "contextmenu", this.mouseClick);

                // handle(g.b, "mousemove", this.mouseMove);
                Web.u.mouseselect(Web.g.b, bind);
            };

            ClickMode.prototype.overTarget = function (target) {
                console.log('over: ' + target.tagName + '|x:' + target.offsetLeft + '|y:' + target.offsetTop);

                if (this.lastFocus && Web.u.contains(this.lastFocus.value, target)) {
                    return;
                }

                if (this.excludeNode(target)) {
                    this.removeLastIfNotSelected();
                    return;
                }

                if (!Web.u.valid(this.lastFocus)) {
                    this.lastFocus = new Web.c.KeyValuePair(this.greyout(target), target);
                    return;
                }

                if (target != this.lastFocus.value && !this.selections.containsValue(target)) {
                    Web.cover(this.lastFocus.key, target);
                    this.lastFocus.value = target;
                }
            };

            ClickMode.prototype.greyout = function (target) {
                var s = Web.createOverlay(target);
                this.overlays.add(s);
                Web.e.be(s, "click", this.mouseClick);

                //e.be(s, "mouseout", this.removeLastIfNotSelected);
                return s;
            };

            ClickMode.prototype.clickOverlay = function (event) {
                if (!Web.u.valid(event)) {
                    return;
                }

                var overlay = Web.u.evt(event).target;
                if (event.button === 2) {
                    var lastTarget = Web.u.valid(this.lastFocus) ? this.lastFocus.value : null;
                    if (Web.u.valid(overlay) && overlay !== lastTarget) {
                        this.overTarget(overlay);
                    }
                }

                if (!Web.isOverlay(overlay)) {
                    return;
                }

                if (!this.selections.containsKey(overlay)) {
                    if (this.lastFocus && this.lastFocus.key == overlay) {
                        if (event.button === 0) {
                            this.removeChildren(this.lastFocus.value);
                            this.selections.add(this.lastFocus.key, this.lastFocus.value);
                            new Web.Content(null, this.lastFocus.value).fireAdd();
                            this.lastFocus = null;
                        }
                    }
                } else {
                    this.removeSelection(overlay);
                }
            };

            ClickMode.prototype.removeLastIfNotSelected = function () {
                if (Web.u.valid(this.lastFocus) && !this.selections.containsKey(this.lastFocus.key)) {
                    this.removeElement(this.lastFocus.key);
                    this.lastFocus = null;
                }
            };

            ClickMode.prototype.removeChildren = function (elem) {
                for (var i = this.selections.count - 1; i >= 0; i--) {
                    var pair = this.selections.pair(i);
                    if (Web.u.contains(elem, pair.value)) {
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
                    Web.g.b.removeChild(elem);
                }
            };

            ClickMode.prototype.updateSelections = function () {
                this.removeLastIfNotSelected();
                var newPoint = new Web.Point(pageXOffset, pageYOffset);
                var gap = newPoint.substract(this.initOffset);
                this.initOffset = newPoint;

                for (var i = 0; i < this.selections.count; i++) {
                    Web.updateOverlay(this.selections.pair(i).key, -gap.x, -gap.y, 0, 0);
                }
            };

            ClickMode.prototype.excludeNode = function (elem) {
                if (!Web.u.valid(elem) || Web.isOverlay(elem) || elem.tagName === "IFRAME" || elem.tagName === "FORM" || elem.tagName === "INPUT" || elem.tagName === "SELECT" || elem.tagName === "TEXTAREA") {
                    return true;
                }

                if (Web.u.eachKid(elem, this.excludeNode)) {
                    return true;
                }

                if (elem.tagName === "IMG" || Web.u.textNode(elem)) {
                    return false;
                }

                // maybe if the element's client height/width is too big, we should exclude
                return Web.u.width(Web.g.b) <= Web.u.width(elem) * 2 || Web.u.height(Web.g.b) <= Web.u.height(elem) * 2;
            };
            ClickMode.Name = "m_clk";
            return ClickMode;
        })();
        Web.ClickMode = ClickMode;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
