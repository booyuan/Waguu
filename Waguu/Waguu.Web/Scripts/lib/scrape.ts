/// <reference path="utils.ts" />

module ClipWall {
    export class Scrape {
        private mouseDown: (e) => any;
        private mouseUp: (e) => any;
        private mouseMove: (e) => any;
        private _target: HTMLElement;
        private _position: Point;
        private _flag: number = 0;

        private onstart: (s: Scrape) => boolean;
        private onselecting: (s: Scrape) => boolean;
        private onselected: (s: Scrape) => boolean;

        constructor(
            start: (s: Scrape) => boolean,
            selecting: (s: Scrape) => boolean,
            selected: (s: Scrape) => boolean) {

            this.onstart = start;
            this.onselecting = selecting;
            this.onselected = selected;

            this.mouseDown = (e) => {
                this._target = <HTMLElement>u.evt(e).target;
                this._position = Point.from(<MouseEvent>e);
                if (this._flag === 0) {
                    this._flag = 1;
                }

                if (u.valid(this.onstart)) {
                    if (this.onstart(this)) {
                        u.stop(e);
                    }
                }
            };

            this.mouseMove = (e) => {
                if (this._flag == 0) {
                    return;
                }

                this._position = Point.from(<MouseEvent>e);
                if (this._flag == 1) {
                    this._flag = 2;
                }

                if (u.valid(this.onselecting)) {
                    if (this.onselecting(this)) {
                        u.stop(e);
                    }
                }
            };

            this.mouseUp = (e) => {
                if (this._flag != 2) {
                    return;
                }

                this._flag = 0;
                if (u.valid(this.onselected)) {
                    if (this.onselected(this)) {
                        u.stop(e);
                    }
                }

                this._target = null;
            };
        }

        public get target(): HTMLElement {
            return this._target;
        }

        public get position(): Point {
            return this._position;
        }

        public enable(bind: boolean) {
            var handle = bind ? e.be : e.ue;
            handle(g.b, "mousedown", this.mouseDown);
            handle(g.b, "mousemove", this.mouseMove);
            handle(g.b, "mouseup", this.mouseUp);
        }
    }
}