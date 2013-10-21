/// <reference path="clip.ts" />
/// <reference path="../lib/scrape.ts" />

module ClipWall {
    export class SelectMode implements IClipMode {
        public static Name: string = "m_sel";
        private scrape: Scrape;
        constructor(private panel: HTMLElement) {
            this.scrape = new Scrape(
                (scrape: Scrape) => false,
                (scrape: Scrape) => false,
                () => {
                    this.detectSelection();
                    return false;
                });
        }

        public get name(): string {
            return SelectMode.Name;
        }

        public apply(): void {
            this.scrape.enable(true);
        }

        public dispose(): void {
            this.scrape.enable(false);
        }

        private detectSelection() {
            // exclude operations on panel
            if (!u.contains(this.panel, this.scrape.target)) {
                var text = this.selectedText();
                if (!u.empty(text)) {
                    new Content(text, null).fireAdd();
                    this.highlight('yellow');
                }
            }
        }

        private makeEditableAndHighlight(color): void {
            var sel = g.w.getSelection();
            g.d.designMode = "on";
            if (sel.rangeCount && sel.getRangeAt) {
                var range = sel.getRangeAt(0);
                sel.removeAllRanges();
                sel.addRange(range);
            }

            // Use HiliteColor since some browsers apply BackColor to the whole block
            if (!g.d.execCommand("HiliteColor", false, color)) {
                g.d.execCommand("BackColor", false, color);
            }
            g.d.designMode = "off";
        }

        private highlight(color): void {
            if (g.w.getSelection) {
                // IE9 and non-IE
                try {
                    if (!document.execCommand("BackColor", false, color)) {
                        this.makeEditableAndHighlight(color);
                    }
                } catch (ex) {
                    this.makeEditableAndHighlight(color);
                }
            } else if (g.d.selection && g.d.selection.createRange) {
                // IE <= 8 case
                var range = g.d.selection.createRange();
                range.execCommand("BackColor", false, color);
            }
        }

        private selectedText(): string {
            if (g.w.getSelection) {  // all browsers, except IE before version 9
                var sel = g.w.getSelection();
                if (sel.rangeCount && sel.getRangeAt) {
                    var r = sel.getRangeAt(0);
                    var bounding = r.getBoundingClientRect();
                    if (bounding.height * 2 < u.height(g.b) && bounding.width * 2 < u.width(g.b)) {
                        return sel.getRangeAt(0).toString();
                    }
                }
            }
            else if (g.d.selection.createRange) { // Internet Explorer
                var tr = g.d.selection.createRange();
                if (tr.boundingHeight * 2 < u.height(g.b) && tr.boundingWidth * 2 < u.width(g.b)) {
                    return tr.text;
                }
            }

            return '';
        }
    }
}