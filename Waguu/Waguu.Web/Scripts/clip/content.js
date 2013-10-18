var Waguu;
(function (Waguu) {
    (function (Web) {
        var Content = (function () {
            function Content(text, dom) {
                if (typeof text === "undefined") { text = null; }
                if (typeof dom === "undefined") { dom = null; }
                this.text = text;
                this.dom = dom;
                this.id = Content.IdGen++;
                if (Web.u.valid(dom)) {
                    this.imgRatio(dom);
                    this.dom = dom.cloneNode(true);
                }
            }
            Content.prototype.toString = function () {
                if (!Web.u.empty(this.text)) {
                    return this.text;
                }

                if (Web.u.valid(this.dom)) {
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
                if (!Web.u.valid(elem)) {
                    return false;
                }

                elem.className = "";
                if (elem.style) {
                    Web.g.sat(elem, "style", "");
                }

                if (elem.tagName == "IMG") {
                    var ratio = Web.g.gat(elem, "data-ratio");
                    if (Web.u.valid(ratio)) {
                        Web.g.sat(elem, "width", "250px");
                        Web.g.sat(elem, "height", parseFloat(ratio) * 250 + "px");
                    }

                    return false;
                }

                Web.u.eachKid(elem, this.strip);
                return false;
            };

            Content.prototype.imgRatio = function (elem) {
                if (!Web.u.valid(elem)) {
                    return false;
                }

                if (elem.tagName == "IMG") {
                    var width = elem.clientWidth || elem.offsetWidth || elem.scrollWidth;
                    var height = elem.clientHeight || elem.offsetHeight || elem.scrollHeight;
                    if (width > 250) {
                        Web.g.sat(elem, "data-ratio", "" + (height / width));
                    }

                    return false;
                }

                Web.u.eachKid(elem, this.imgRatio);
                return false;
            };

            Content.prototype.fireAdd = function () {
                Web.e.fire(Content.CADD, this);
            };

            Content.prototype.fireDel = function () {
                Web.e.fire(Content.CDEL, this.id);
            };
            Content.CADD = "addcontent";
            Content.CDEL = "removecontent";

            Content.IdGen = 0;
            return Content;
        })();
        Web.Content = Content;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
