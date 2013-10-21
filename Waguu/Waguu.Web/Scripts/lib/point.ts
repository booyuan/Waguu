module ClipWall {
    export class Point {
        constructor(public x: number = 0, public y: number = 0) { }
        public static from(me: MouseEvent): Point {
            return new Point(me.clientX, me.clientY);
        }
        public substract(p: Point): Point {
            return new Point(this.x - p.x, this.y - p.y);
        }

        public dist(p: Point): number {
            var gap = this.substract(p);
            return Math.sqrt(gap.x * gap.x + gap.y * gap.y);
        }
    }
}