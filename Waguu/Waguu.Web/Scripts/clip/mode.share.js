var Waguu;
(function (Waguu) {
    (function (Web) {
        // pointer-events:none;
        var greyoutPattern = 'top:{0}px;left:{1}px;width:{2}px;height:{3}px';

        // if parameter is empty, create full screen to cover document
        function createOverlay(under) {
            var s = Web.g.ce('div');
            if (under === Web.g.b) {
                Web.g.sat(s, 'class', 'greyout');
            } else {
                Web.g.sat(s, 'class', 'overlay');
                cover(s, under);
                //s.innerHTML = "<p>drag to expand it...</p>";
            }

            // add identifier to it
            Web.g.sat(s, "data-cw", "1");
            Web.g.b.appendChild(s);
            return s;
        }
        Web.createOverlay = createOverlay;

        function cover(overlay, under) {
            var rect = { top: 0, left: 0, width: 0, height: 0 };
            if (Web.u.valid(under)) {
                rect = under.getBoundingClientRect();
            }

            Web.g.sat(overlay, 'style', Web.u.format(greyoutPattern, rect.top.toString(), rect.left.toString(), rect.width.toString(), rect.height.toString()));
        }
        Web.cover = cover;

        function isOverlay(elem) {
            if (elem) {
                return Web.g.gat(elem, "data-cw") === "1";
            }

            return false;
        }
        Web.isOverlay = isOverlay;

        function updateOverlay(elem, x, y, w, h) {
            if (y !== 0)
                elem.style.top = (parseInt(elem.style.top) + y) + 'px';
            if (x !== 0)
                elem.style.left = (parseInt(elem.style.left) + x) + 'px';
            if (w !== 0)
                elem.style.width = (parseInt(elem.style.width) + w) + 'px';
            if (h !== 0)
                elem.style.height = (parseInt(elem.style.height) + h) + 'px';
        }
        Web.updateOverlay = updateOverlay;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
