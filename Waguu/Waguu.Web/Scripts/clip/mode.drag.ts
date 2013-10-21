/// <reference path="mode.share.ts" />
/// <reference path="../lib/page.ts" />
/// <reference path="../lib/scrape.ts" />
/// <reference path="../lib/utils.ts" />

module ClipWall {
    export class DragMode implements IClipMode {
        public static Name: string = "m_drg";
        private overlays: c.IList<HTMLElement> = new c.List();
        private selection: Scrape;
        // mouse drag
        private lastPosition: Point;
        private dragTarget: HTMLElement;

        constructor() {
            this.selection = new Scrape(
                (selection: Scrape) => {
                    this.lastPosition = selection.position;
                    return true;
                },

                (selection: Scrape) => {
                    var newP = selection.position;
                    if (!u.valid(this.lastPosition)) {
                        this.lastPosition = newP;
                        return true;
                    }

                    var gap = newP.substract(this.lastPosition);
                    if (!u.valid(this.dragTarget)) {
                        this.dragTarget = createOverlay(null);
                        updateOverlay(this.dragTarget, this.lastPosition.x, this.lastPosition.y, gap.x, gap.y);
                    } else {
                        updateOverlay(this.dragTarget, 0, 0, gap.x, gap.y);
                    }

                    this.lastPosition = newP;
                    return true;
                },

                () => {
                    if (u.valid(this.dragTarget)) {
                        this.clearOverlap(this.dragTarget.getBoundingClientRect());
                        this.overlays.add(this.dragTarget);
                        this.dragTarget = null;
                    }

                    return true;
                });
        }

        public get name(): string {
            return DragMode.Name;
        }

        public apply(): void {
            this.selection.enable(true);
            u.mouseselect(g.b, true);
        }

        public dispose(): void {
            this.selection.enable(false);
            u.mouseselect(g.b, false);
        }

        private clearOverlap(rect: ClientRect) {
            for (var i = this.overlays.count - 1; i >= 0; i--) {
                if (this.overlap(rect, this.overlays.item(i).getBoundingClientRect())) {
                    g.b.removeChild(this.overlays.item(i));
                    this.overlays.removeAt(i);
                }
            }
        }

        private overlap(rect1: ClientRect, rect2: ClientRect): boolean {
            return true;
        }
    }
}