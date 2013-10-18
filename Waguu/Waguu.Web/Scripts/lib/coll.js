var Waguu;
(function (Waguu) {
    // define some basic collections
    (function (Web) {
        (function (c) {
            var KeyValuePair = (function () {
                function KeyValuePair(key, value) {
                    this.key = key;
                    this.value = value;
                }
                return KeyValuePair;
            })();
            c.KeyValuePair = KeyValuePair;

            var List = (function () {
                function List() {
                    this.data = [];
                }
                List.prototype.add = function (elem) {
                    if (Web.u.valid(elem)) {
                        this.data.push(elem);
                    }
                };

                List.prototype.remove = function (elem) {
                    var found = this.indexOf(elem);
                    if (found != -1) {
                        this.removeAt(found);
                    }
                };

                List.prototype.removeAt = function (i) {
                    if (i >= 0 && i < this.count) {
                        this.data.splice(i, 1);
                    }
                };

                List.prototype.item = function (i) {
                    if (i >= 0 && i < this.count) {
                        return this.data[i];
                    }

                    return null;
                };

                List.prototype.indexOf = function (elem) {
                    var found = -1;
                    for (var i = 0; i < this.count; i++) {
                        if (elem === this.data[i]) {
                            found = i;
                            break;
                        }
                    }

                    return found;
                };

                Object.defineProperty(List.prototype, "count", {
                    get: function () {
                        return this.data.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                return List;
            })();
            c.List = List;

            var Dictionary = (function () {
                function Dictionary() {
                    this.keys = new List();
                    this.values = new List();
                }
                Dictionary.prototype.add = function (key, value) {
                    if (Web.u.valid(key) && Web.u.valid(value) && !this.containsKey(key)) {
                        this.keys.add(key);
                        this.values.add(value);
                    }
                };

                Dictionary.prototype.containsKey = function (key) {
                    if (Web.u.valid(key)) {
                        return this.keys.indexOf(key) != -1;
                    }

                    return false;
                };

                Dictionary.prototype.containsValue = function (value) {
                    if (Web.u.valid(value)) {
                        return this.values.indexOf(value) != -1;
                    }

                    return false;
                };

                Dictionary.prototype.remove = function (key) {
                    this.removeAt(this.keys.indexOf(key));
                };

                Dictionary.prototype.removeAt = function (index) {
                    if (index >= 0 && index < this.count) {
                        this.keys.removeAt(index);
                        this.values.removeAt(index);
                    }
                };

                Dictionary.prototype.pair = function (i) {
                    if (i >= 0 && i < this.count) {
                        return new KeyValuePair(this.keys.item(i), this.values.item(i));
                    }

                    return null;
                };

                Object.defineProperty(Dictionary.prototype, "count", {
                    get: function () {
                        return this.keys.count;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Dictionary;
            })();
            c.Dictionary = Dictionary;
        })(Web.c || (Web.c = {}));
        var c = Web.c;
    })(Waguu.Web || (Waguu.Web = {}));
    var Web = Waguu.Web;
})(Waguu || (Waguu = {}));
