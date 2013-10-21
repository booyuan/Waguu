/// <reference path="page.ts" />
/// <reference path="utils.ts" />

// define CSS utility
module ClipWall {
    export module Css {
        export function load(path: string): void {
            var s = g.ce('link');
            g.sat(s, 'type', 'text/css');
            g.sat(s, 'rel', 'stylesheet');
            g.sat(s, 'href', u.fullpath(path));
            g.gt('body')[0].appendChild(s);
        }
        export function add(elem: HTMLElement, className: string): void {
            if (contains(elem, className)) {
                return;
            }

            elem.className += ' ' + className;
        }

        export function remove(elem: HTMLElement, className: string): void {
            if (!contains(elem, className)) {
                return;
            }

            var classList = elem.className.split(' ');
            var classId = classList.indexOf(className);
            if (classId >= 0) {
                classList.splice(classId, 1);
            }

            elem.className = classList.join(' ');
        }

        export function toggle(elem: HTMLElement, className: string): void {
            if (contains(elem, className)) {
                remove(elem, className);
            }
            else {
                add(elem, className);
            }
        }

        export function contains(elem: HTMLElement, className: string): boolean {
            var classList = elem.className.split(' ');
            return classList.indexOf(className) >= 0;
        }

        export function show(elem: HTMLElement, show: boolean = true): void {
            elem.style.display = show ? "block" : "none";
        }
    }
}