// declare system variables
declare var window: Window;
declare var document: Document;

module ClipWall {
    // define global variables
    export module g {
        export var d = document;
        export var w = window;
        export var b: HTMLElement = <HTMLElement>(d.body || gt('body')[0]);
        export var ie = !!w["ActiveXObject"];
        export var ie6 = ie && !w["XMLHttpRequest"];
        export var st = (handler: () => any, time: number) => w.setTimeout(handler, time);
        export var ge = (id: string) => d.getElementById(id);
        export var gt = (tag: string) => d.getElementsByTagName(tag);
        export var ce = (tag: string) => d.createElement(tag);
        export var gat = (elem: HTMLElement, name: string) => elem.getAttribute(name);
        export var sat = (elem: HTMLElement, name: string, val: string) => elem.setAttribute(name, val);

        //replace this with final domain when publish
        export var h = "http://localhost:22128/";
    }

    // define events utility
    export module e {
        // private fields
        var cache: any = {};

        // c_evt.fire(event, arguments);
        export function fire(e: string, ...args: any[]) {
            var handlers = cache[e];
            if (handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i](args);
                }
            }
        }

        // c_evt.bind(event, handler);
        export function bind(event: string, handler: (...args: any[]) => void) {
            var handlers = cache[event];
            if (!handlers) {
                handlers = [];
            }

            handlers.push(handler);
            cache[event] = handlers;
        }

        // c_evt.unbind(pressEvent, press);
        export function unbind(event: string, handler: () => any) {
            var handlers = cache[event];
            if (handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    if (handlers[i] == handler) {
                        handlers.splice(i, 1);
                    }
                }
            }
        }

        export function be(element: any, event: string, handler: (evt) => any) {
            if (element.addEventListener) {
                element.addEventListener(event, handler);
                return;
            }

            if (element.attachEvent) {
                element.attachEvent("on" + event, handler);
                return;
            }

            element["on" + event] = handler;
        }

        export function ue(element: any, event: string, handler: (evt) => any) {
            if (element.removeEventListener) {
                element.removeEventListener(event, handler);
                return;
            }

            if (element.detachEvent) {
                element.detachEvent("on" + event, handler);
                return;
            }

            element["on" + event] = null;
        }

        export function trigger(element: HTMLElement, event: Event) {
            if (element.dispatchEvent) {
                var e = g.d.createEvent("HTMLEvents");
                e.initEvent(event.type, true, false);
                element.dispatchEvent(e);
            } else if (element.fireEvent) {
                element.fireEvent("on" + event.type);
            }
        }
    }
}