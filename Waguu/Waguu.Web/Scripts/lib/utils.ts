/// <reference path="page.ts" />
module Waguu.Web {
    //define utlity
    export module u {
        export function evt(e: Event) {
            var event = e || g.w.event;
            if (!event.target) {
                event.target = event.srcElement;
            }

            return event;
        }

        export function cord(e: Event) {
            var event = <MouseEvent>(e || g.w.event);
            if (event) {
                return new Point(event.pageX, event.pageY);
            }

            return null;
        }

        export function fullpath(rel: string): string {
            return g.h + rel;
        }

        export function contains(elem1: HTMLElement, elem2: HTMLElement): boolean {
            if (elem1 && elem2) {
                while (elem2) {
                    if (elem1 == elem2) {
                        return true;
                    }

                    elem2 = elem2.parentElement;
                }
            }

            return false;
        }

        export function stop(event: Event) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }

        export function format(pattern: string, ...ps: string[]): string {
            if (!valid(ps)) {
                return pattern;
            }

            if (empty(pattern)) {
                return ps.join("");
            }

            for (var i = 0; i < ps.length; ++i) {
                pattern = pattern.replace(new RegExp("\\{" + i + "\\}", "gm"), ps[i]);
            }

            return pattern;
        }

        export function empty(str: string): boolean {
            return (!valid(str) || str.length === 0);
        }

        export function valid(obj: any): boolean {
            return (obj !== null && typeof obj !== "undefined");
        }

        export function textNode(node: Element): boolean {
            return valid(node) && node.nodeType === 3;
        }

        export function eachKid(dom: HTMLElement, exec: (kid: HTMLElement) => any): any {
            if (u.valid(dom) && u.valid(exec)) {
                for (var i = 0; i < dom.children.length; ++i) {
                    var result = exec(<HTMLElement>dom.children.item(i));
                    if (result) {
                        return result;
                    }
                }
            }

            return false;
        }

        export function mouseselect(target: any, disable: boolean) {
            //For IE This code will work
            if (typeof target.onselectstart != "undefined")
                target.onselectstart = disable ? () => false : null;
            //For Firefox This code will work
            else if (typeof target.style.MozUserSelect != "undefined")
                target.style.MozUserSelect = disable ? "none" : null;
        }

        export function width(elem: HTMLElement): number {
            return elem.offsetWidth | elem.clientWidth | elem.scrollWidth;
        }

        export function height(elem: HTMLElement): number {
            return elem.offsetHeight | elem.clientHeight | elem.scrollHeight;
        }
    }
}