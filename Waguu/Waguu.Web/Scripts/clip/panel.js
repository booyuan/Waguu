/// <reference path="content.ts" />
var ClipWall;
(function (ClipWall) {
    var Panel = (function () {
        function Panel() {
            var _this = this;
            this.modes = [];
            this.mLeft = ['0', '-300px'];
            this.mIndex = 0;
            this.panel = ClipWall.g.ce('div');
            ClipWall.g.sat(this.panel, 'class', 'panel');
            this.panel.innerHTML = "<div id='cnt' class='left'></div>" + "<div id='mnu' class='right'>" + "<ul>" + "<li class='b_expand' />" + "<li class='b_pick' />" + "<li class='b_select' />" + "<li class='b_login' />" + "<li class='b_submit' />" + "</ul>" + "</div>";

            ClipWall.g.b.insertBefore(this.panel, ClipWall.g.b.firstChild);

            //set menu item click handling
            var items = this.panel.querySelectorAll("li");
            for (var i = 0; i < items.length; ++i) {
                ClipWall.g.sat(items[i], "onclick", "panel.mc(this);");
            }

            ClipWall.e.bind(ClipWall.Content.CADD, function (args) {
                _this.newNode(args[0]);
            });

            // create default mode
            this.createMode();
        }
        Panel.CreatePanel = function () {
            return new Panel();
        };

        Panel.prototype.newNode = function (content) {
            if (!ClipWall.u.valid(content)) {
                return;
            }

            var div = ClipWall.g.ce("div");
            div.innerHTML = content.toString();
            ClipWall.g.ge("cnt").appendChild(div);
        };

        Panel.prototype.createMode = function () {
            this.modes.push(new ClipWall.SelectMode(this.panel));
            this.modes.push(new ClipWall.ClickMode(this.panel));

            // use one clip mode for default
            this.modes[0].apply();
        };

        Panel.prototype.mc = function (item) {
            switch (item.className) {
                case "b_expand":
                    this.clickExpand();
                    break;
                case "b_pick":
                    this.clickPickMode();
                    break;
                case "b_select":
                    this.clickSelectMode();
                    break;
                case "b_login":
                    this.clickLogin();
                    break;
                case "b_submit":
                    this.clickSubmit();
                    break;
            }
        };

        Panel.prototype.clickExpand = function () {
            this.panel.style.marginLeft = this.mLeft[this.mIndex];
            this.mIndex = (this.mIndex + 1) % this.mLeft.length;
        };

        Panel.prototype.clickPickMode = function () {
            var mode = this.getMode(ClipWall.ClickMode.Name);
            if (mode == null) {
                throw new Error('this mode is not supported');
            }

            this.disposeAll();
            mode.apply();
        };

        Panel.prototype.clickSelectMode = function () {
            var mode = this.getMode(ClipWall.SelectMode.Name);
            if (mode == null) {
                throw new Error('this mode is not supported');
            }

            this.disposeAll();
            mode.apply();
        };

        Panel.prototype.clickLogin = function () {
        };

        // submit the data to server
        Panel.prototype.clickSubmit = function () {
            var cnt = ClipWall.g.ge("cnt");
            var data = {
                ID: new Date().getTime(),
                Title: ClipWall.g.d.title,
                URL: ClipWall.g.w.location.href,
                Sections: [],
                Images: [],
                Style: null
            };

            // put all content
            ClipWall.u.eachKid(cnt, function (kid) {
                data.Sections.push(kid.innerHTML);
            });

            // to-do: put all captured images here
            // to-do: analyze all style and put it here
            var postUri = ClipWall.g.h + "api/clip/post";
            ClipWall.u.ajax(postUri, ClipWall.u.AjaxMethod.POST, JSON.stringify(data), function (res) {
                alert(res);
            }, function (fail) {
                alert("fail status:" + fail);
            });
        };

        Panel.prototype.getMode = function (name) {
            for (var i = 0; i < this.modes.length; ++i) {
                if (this.modes[i].name === name) {
                    return this.modes[i];
                }
            }

            return null;
        };

        Panel.prototype.disposeAll = function () {
            for (var i = 0; i < this.modes.length; ++i) {
                this.modes[i].dispose();
            }
        };
        return Panel;
    })();
    ClipWall.Panel = Panel;
})(ClipWall || (ClipWall = {}));
