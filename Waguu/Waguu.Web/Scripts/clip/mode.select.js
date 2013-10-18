var Waguu;
(function (Waguu) {
    /// <reference path="clip.ts" />
    /// <reference path="../lib/scrape.ts" />
    (function (Web) {
        var SelectMode = (function () {
            function SelectMode(panel) {
                var _this = this;
                this.panel = panel;
                this.scrape = new Web.Scrape(function (scrape) {
                    return false;
                }, function (scrape) {
                    return false;
                }, function () {
                    _this.detectSelection();
                    return false;
                });
            }
            Object.defineProperty(SelectMode.prototype, "name", {
                get: function () {
                    return SelectMode.Name;
                },
                enumerable: true,
                configurable: true
            });

            SelectMode.prototype.apply = function () {
                this.scrape.enable(true);
            };

            SelectMode.prototype.dispose = function () {
                this.scrape.enable(false);
            };

            SelectMode.prototype.detectSelection = function () {
                if (!Web.u.contains(this.panel, this.scrape.target)) {
                    var text = this.selectedText();
                    if (!Web.u.empty(text)) {
                        new Web.Content(text, null).fireAdd();
                        this.highlight('yellow');
                    }
                }
            };

            SelectMode.prototype.makeEditableAndHighlight = function (color) {
                var sel = Web.g.w.getSelection();
                Web.g.d.designMode = "on";
                if (sel.rangeCount && sel.getRangeAt) {
                    var range = sel.getRangeAt(0);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }

                if (!Web.g.d.execCommand("HiliteColor", false, color)) {
                    Web.g.d.execCommand("BackColor", false, color);
                }
                Web.g.d.designMode = "off";
            };

            SelectMode.prototype.highlight = function (color) {
                if (Web.g.w.getSelection) {
                    try  {
                        if (!document.execCommand("BackColor", false, color)) {
                            this.makeEditableAndHighlight(color);
                        }
                    } catch (ex) {
                        this.makeEditableAndHighlight(color);
                    }
                } else if (Web.g.d.selection && Web.g.d.selection.createRange) {
                    // IE <= 8 case
                    var range = Web.g.d.selection.createRange();
                    range.execCommand("BackColor", false, color);
                }
            };

            SelectMode.prototype.selectedText = function () {
                if (Web.g.w.getSelection) {
                    var sel = Web.g.w.getSelection();
                    if (sel.rangeCount && sel.getRangeAt) {
                        var r = sel.getRangeAt(0);
                        var bounding = r.getBoundingClientRect();
                        if (bounding.height * 2 < Web.u.height(Web.g.b) && bounding.width * 2 < Web.u.width(Web.g.b)) {
                            return sel.getRangeAt(0).toString();
                        }
                    }
                } else if (Web.g.d.selection.createRange) {
                    var tr = Web.g.d.selection.createRange();
                    if (tr.boundingHeight * 2 < Web.u.height(Web.g.b) && tr.boundingWidth * 2 < Web.u.width(Web.g.b)) {
                        return tr.text;
                    }
                }

                return '';
            };
            SelectMode.Name = "m_sel";
            return SelectMode;
        })();
        Web.SelectMode = SelectMode;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
