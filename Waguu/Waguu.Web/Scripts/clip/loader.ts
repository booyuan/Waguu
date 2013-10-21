/// <reference path="../lib/page.ts" />
/// <reference path="../lib/utils.ts" />
/// <reference path="../lib/css.ts" />
/// <reference path="panel.ts" />
/// <reference path="mode.click.ts" />
/// <reference path="mode.drag.ts" />
/// <reference path="mode.select.ts" />

var loaded;
var panel = {};
// do not load twice
if (!loaded) {
    loaded = true;

    // load css file we need
    ClipWall.Css.load("clip");

    // create a panel
    panel = ClipWall.Panel.CreatePanel();
}