"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rss_service_1 = require("../../../shared/services/rss.service");
var router_1 = require("nativescript-angular/router");
var RssNoteComponent = (function () {
    function RssNoteComponent(rssService, routerExtensions) {
        var _this = this;
        this.rssService = rssService;
        this.routerExtensions = routerExtensions;
        this.rssItem = rssService.getItem();
        rssService.getNotedItemFor(this.rssItem.uuid, function (customItems) {
            _this.title = customItems[0].title;
            _this.note = customItems[0].note;
        });
    }
    RssNoteComponent.prototype.save = function () {
        var _this = this;
        this.rssService.addNoteToItem(this.rssItem.uuid, this.title, this.note, function () {
            _this.routerExtensions.back();
        });
    };
    RssNoteComponent.prototype.back = function () {
        this.routerExtensions.back();
    };
    RssNoteComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['./note.component.css', './note.css'],
            templateUrl: './note.component.html'
        }),
        __metadata("design:paramtypes", [rss_service_1.RssService, router_1.RouterExtensions])
    ], RssNoteComponent);
    return RssNoteComponent;
}());
exports.RssNoteComponent = RssNoteComponent;
