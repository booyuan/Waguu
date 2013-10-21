var ClipWall;
(function (ClipWall) {
    var Content = (function () {
        function Content(text, dom) {
            if (typeof text === "undefined") { text = null; }
            if (typeof dom === "undefined") { dom = null; }
            this.text = text;
            this.dom = dom;
            this.id = Content.IdGen++;
            if (ClipWall.u.valid(dom)) {
                this.imgRatio(dom);
                this.dom = dom.cloneNode(true);
            }
        }
        Content.prototype.toString = function () {
            if (!ClipWall.u.empty(this.text)) {
                return this.text;
            }

            if (ClipWall.u.valid(this.dom)) {
                // strip styles to make it consistent display
                // before stripping, clone it to a new node
                this.strip(this.dom);

                if (this.dom.tagName == "IMG") {
                    return this.dom.outerHTML;
                } else {
                    return this.dom.innerHTML;
                }
            }

            return "";
        };

        Content.prototype.strip = function (elem) {
            if (!ClipWall.u.valid(elem)) {
                return false;
            }

            elem.className = "";
            if (elem.style) {
                ClipWall.g.sat(elem, "style", "");
            }

            if (elem.tagName == "IMG") {
                var ratio = ClipWall.g.gat(elem, "data-ratio");
                if (ClipWall.u.valid(ratio)) {
                    ClipWall.g.sat(elem, "width", "250px");
                    ClipWall.g.sat(elem, "height", parseFloat(ratio) * 250 + "px");
                }

                return false;
            }

            ClipWall.u.eachKid(elem, this.strip);
            return false;
        };

        Content.prototype.imgRatio = function (elem) {
            if (!ClipWall.u.valid(elem)) {
                return false;
            }

            if (elem.tagName == "IMG") {
                var width = elem.clientWidth || elem.offsetWidth || elem.scrollWidth;
                var height = elem.clientHeight || elem.offsetHeight || elem.scrollHeight;
                if (width > 250) {
                    ClipWall.g.sat(elem, "data-ratio", "" + (height / width));
                }

                return false;
            }

            ClipWall.u.eachKid(elem, this.imgRatio);
            return false;
        };

        Content.prototype.fireAdd = function () {
            ClipWall.e.fire(Content.CADD, this);
        };

        Content.prototype.fireDel = function () {
            ClipWall.e.fire(Content.CDEL, this.id);
        };
        Content.CADD = "addcontent";
        Content.CDEL = "removecontent";

        Content.IdGen = 0;
        return Content;
    })();
    ClipWall.Content = Content;
})(ClipWall || (ClipWall = {}));
