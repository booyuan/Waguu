module ClipWall {
    export class Content {
        // add/remove event names
        public static CADD: string = "addcontent";
        public static CDEL: string = "removecontent";

        // id generation
        private static IdGen: number = 0;

        // content wrapper
        private id: number;
        constructor(private text: string= null, private dom: HTMLElement = null) {
            this.id = Content.IdGen++;
            if (u.valid(dom)) {
                this.imgRatio(dom);
                this.dom = <HTMLElement>dom.cloneNode(true);
            }
        }

        public toString(): string {
            if (!u.empty(this.text)) {
                return this.text;
            }

            if (u.valid(this.dom)) {
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
        }

        private strip(elem: HTMLElement): boolean {
            if (!u.valid(elem)) {
                return false;
            }

            elem.className = "";
            if (elem.style) {
                g.sat(elem, "style", "");
            }

            if (elem.tagName == "IMG") {
                var ratio = g.gat(elem, "data-ratio");
                if (u.valid(ratio)) {
                    g.sat(elem, "width", "250px");
                    g.sat(elem, "height", parseFloat(ratio) * 250 + "px");
                }

                return false;
            }

            u.eachKid(elem, this.strip);
            return false;
        }

        private imgRatio(elem: HTMLElement): boolean {
            if (!u.valid(elem)) {
                return false;
            }

            if (elem.tagName == "IMG") {
                var width = elem.clientWidth || elem.offsetWidth || elem.scrollWidth;
                var height = elem.clientHeight || elem.offsetHeight || elem.scrollHeight;
                if (width > 250) {
                    g.sat(elem, "data-ratio", "" + (height / width));
                }

                return false;
            }

            u.eachKid(elem, this.imgRatio);
            return false;
        }

        public fireAdd(): void {
            e.fire(Content.CADD, this);
        }

        public fireDel(): void {
            e.fire(Content.CDEL, this.id);
        }
    }
}