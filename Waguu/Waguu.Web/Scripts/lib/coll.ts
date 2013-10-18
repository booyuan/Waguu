// define some basic collections
module Waguu.Web {
    export module c {
        export interface IList<T> {
            add(elem: T);
            remove(elem: T);
            removeAt(i: number);
            item(i: number): T;
            indexOf(elem: T): number;
            count: number;
        }

        export class KeyValuePair<T,S> {
            constructor(public key: T, public value: S) { }
        }

        export interface IDictionary<T, S> {
            add(key: T, value: S);
            containsKey(key: T): boolean;
            containsValue(value: S): boolean;
            remove(key: T);
            removeAt(i: number);
            pair(i: number): KeyValuePair<T, S>;
            count: number;
        }

        export class List<T> implements IList<T> {
            private data: T[];
            constructor() { this.data = []; }
            public add(elem: T) {
                if (u.valid(elem)) {
                    this.data.push(elem);
                }
            }

            public remove(elem: T) {
                var found = this.indexOf(elem);
                if (found != -1) {
                    this.removeAt(found);
                }
            }

            public removeAt(i: number) {
                if (i >= 0 && i < this.count) {
                    this.data.splice(i, 1);
                }
            }

            public item(i: number): T {
                if (i >= 0 && i < this.count) {
                    return this.data[i];
                }

                return null;
            }

            public indexOf(elem: T): number {
                var found = -1;
                for (var i = 0; i < this.count; i++) {
                    if (elem === this.data[i]) {
                        found = i;
                        break;
                    }
                }

                return found;
            }

            public get count() { return this.data.length; }
        }

        export class Dictionary<T, S> implements IDictionary<T, S> {
            private keys: IList<T>;
            private values: IList<S>;
            constructor() {
                this.keys = new List<T>();
                this.values = new List<S>();
            }

            public add(key: T, value: S) {
                if (u.valid(key) && u.valid(value) && !this.containsKey(key)) {
                    this.keys.add(key);
                    this.values.add(value);
                }
            }

            public containsKey(key: T): boolean {
                if (u.valid(key)) {
                    return this.keys.indexOf(key) != -1;
                }

                return false;
            }

            public containsValue(value: S): boolean {
                if (u.valid(value)) {
                    return this.values.indexOf(value) != -1;
                }

                return false;
            }

            public remove(key: T) {
                this.removeAt(this.keys.indexOf(key));
            }

            public removeAt(index: number) {
                if (index >= 0 && index < this.count) {
                    this.keys.removeAt(index);
                    this.values.removeAt(index);
                }
            }

            public pair(i: number): KeyValuePair<T, S> {
                if (i >= 0 && i < this.count) {
                    return new KeyValuePair(this.keys.item(i), this.values.item(i));
                }

                return null;
            }

            public get count(): number {
                return this.keys.count;
            }
        }
    }
}