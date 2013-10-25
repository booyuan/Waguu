/// <reference path="content.ts" />
module ClipWall {
    export class Panel {
        private modes: IClipMode[] = [];
        private panel: HTMLElement;
        private mLeft: string[] = ['0', '-300px'];
        private mIndex = 0;
        public static CreatePanel(): Panel {
            return new Panel();
        }

        constructor() {
            this.panel = g.ce('div');
            g.sat(this.panel, 'class', 'panel');
            this.panel.innerHTML = "<div id='cnt' class='left'></div>"
            + "<div id='mnu' class='right'>"
            + "<ul>"
            + "<li class='b_expand' />"
            + "<li class='b_pick' />"
            + "<li class='b_select' />"
            + "<li class='b_login' />"
            + "<li class='b_submit' />"
            + "</ul>"
            + "</div>";

            g.b.insertBefore(this.panel, g.b.firstChild);

            //set menu item click handling
            var items = this.panel.querySelectorAll("li");
            for (var i = 0; i < items.length; ++i) {
                g.sat(<HTMLElement>items[i], "onclick", "panel.mc(this);");
            }

            e.bind(Content.CADD, (args) => {
                this.newNode(<Content>args[0]);
            });

            // create default mode
            this.createMode();
        }

        private newNode(content: Content): void {
            if (!u.valid(content)) {
                return;
            }

            var div = g.ce("div");
            div.innerHTML = content.toString();
            g.ge("cnt").appendChild(div);
        }

        private createMode() {
            this.modes.push(new SelectMode(this.panel));
            this.modes.push(new ClickMode(this.panel));
            // use one clip mode for default
            this.modes[0].apply();
        }

        private mc(item: HTMLElement) {
            switch (item.className) {
                case "b_expand": this.clickExpand(); break;
                case "b_pick": this.clickPickMode(); break;
                case "b_select": this.clickSelectMode(); break;
                case "b_login": this.clickLogin(); break;
                case "b_submit": this.clickSubmit(); break;
            }
        }

        private clickExpand(): void {
            this.panel.style.marginLeft = this.mLeft[this.mIndex];
            this.mIndex = (this.mIndex + 1) % this.mLeft.length;
        }

        private clickPickMode(): void {
            var mode = this.getMode(ClickMode.Name);
            if (mode == null) {
                throw new Error('this mode is not supported');
            }

            this.disposeAll();
            mode.apply();
        }

        private clickSelectMode(): void {
            var mode = this.getMode(SelectMode.Name);
            if (mode == null) {
                throw new Error('this mode is not supported');
            }

            this.disposeAll();
            mode.apply();
        }

        private clickLogin(): void {
        }

        // submit the data to server
        private clickSubmit(): void {
            var cnt = g.ge("cnt");
            var data = {
                ID: new Date().getTime(),
                Title: g.d.title,
                URL: g.w.location.href,
                Sections: [],
                Images: [],
                Style: null
            };

            // put all content
            u.eachKid(cnt, (kid) => { data.Sections.push(kid.innerHTML); });

            // to-do: put all captured images here

            // to-do: analyze all style and put it here

            var postUri = g.h + "api/clip/post";
            u.ajax(postUri, u.AjaxMethod.POST, JSON.stringify(data), (res) => { alert(res); }, (fail) => { alert("fail status:" + fail); });
        }

        private getMode(name: string): IClipMode {
            for (var i = 0; i < this.modes.length; ++i) {
                if (this.modes[i].name === name) {
                    return this.modes[i];
                }
            }

            return null;
        }

        private disposeAll(): void {
            for (var i = 0; i < this.modes.length; ++i) {
                this.modes[i].dispose();
            }
        }
    }
}