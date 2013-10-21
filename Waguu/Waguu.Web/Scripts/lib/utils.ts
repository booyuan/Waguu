/// <reference path="page.ts" />
module ClipWall {
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

        export enum AjaxMethod {
            GET,
            POST
        }

        // data is a serialized json object
        export function ajax(url: string, method: AjaxMethod, data?: string, success?: (res: string) => void, fail?: (state: number) => void): void {
            // in the server side, a serialized json object is expected from json parameter name
            data = "json=" + data;

            var req: XMLHttpRequest;
            if (g.ie6) {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                req = new XMLHttpRequest();
            }

            req.open(method == AjaxMethod.GET ? "GET" : "POST", url, true);
            if (method == AjaxMethod.POST) {
                //Send the proper header information along with the request
                req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                req.setRequestHeader("Content-length", data.length.toString());
                req.setRequestHeader("Connection", "close");
            }

            req.onreadystatechange = function () {
                if (req !== null && 4 == req.readyState) {
                    // due to a webkit issue on iPhone/ipad: 
                    // the request completed state will invoke the callback more than one time
                    // we release this object to make sure it's only executed once.
                    var status = req.status;
                    var content = req.responseText;
                    req = null;

                    if (200 == status) {
                        if (content && success) {
                            success(content);
                        }
                    } else if (fail) {
                        fail(status);
                    }
                }
            };

            if (method == AjaxMethod.GET) {
                req.send();
            } else {
                req.send("json=" + data);
            }
        }
    }
}