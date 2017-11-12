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
            styleUrls: ['pages/rss/rss_note/note.component.css', 'pages/rss/rss_note/note.css'],
            templateUrl: 'pages/rss/rss_note/note.component.html'
        }),
        __metadata("design:paramtypes", [rss_service_1.RssService, router_1.RouterExtensions])
    ], RssNoteComponent);
    return RssNoteComponent;
}());
exports.RssNoteComponent = RssNoteComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3RlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3QztBQUN4QyxvRUFBZ0U7QUFJaEUsc0RBQTZEO0FBTTdEO0lBTUksMEJBQXFCLFVBQXNCLEVBQVUsZ0JBQWtDO1FBQXZGLGlCQU1DO1FBTm9CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ25GLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BDLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBQyxXQUF3QjtZQUNuRSxLQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDbEMsS0FBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELCtCQUFJLEdBQUo7UUFBQSxpQkFJQztRQUhHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNuRSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsK0JBQUksR0FBSjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBdEJRLGdCQUFnQjtRQUo1QixnQkFBUyxDQUFDO1lBQ1AsU0FBUyxFQUFFLENBQUMsdUNBQXVDLEVBQUUsNkJBQTZCLENBQUM7WUFDbkYsV0FBVyxFQUFFLHdDQUF3QztTQUN4RCxDQUFDO3lDQU9tQyx3QkFBVSxFQUE0Qix5QkFBZ0I7T0FOOUUsZ0JBQWdCLENBdUI1QjtJQUFELHVCQUFDO0NBQUEsQUF2QkQsSUF1QkM7QUF2QlksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1Jzc1NlcnZpY2V9IGZyb20gXCIuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvcnNzLnNlcnZpY2VcIjtcbmltcG9ydCB7IFRleHRWaWV3IH0gZnJvbSBcInVpL3RleHQtdmlld1wiO1xuaW1wb3J0IHsgaXNBbmRyb2lkIH0gZnJvbSBcInBsYXRmb3JtXCI7XG5pbXBvcnQge1JzcywgQ2hhbm5lbCwgQ2hhbm5lbEltYWdlLCBJdGVtLCBDdXN0b21JdGVtfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvZW50aXRpZXMvZW50aXRpZXMnO1xuaW1wb3J0IHtSb3V0ZXJFeHRlbnNpb25zfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHN0eWxlVXJsczogWydwYWdlcy9yc3MvcnNzX25vdGUvbm90ZS5jb21wb25lbnQuY3NzJywgJ3BhZ2VzL3Jzcy9yc3Nfbm90ZS9ub3RlLmNzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvcnNzL3Jzc19ub3RlL25vdGUuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIFJzc05vdGVDb21wb25lbnQge1xuXG4gICAgcnNzSXRlbTpJdGVtO1xuICAgIHRpdGxlOnN0cmluZztcbiAgICBub3RlOnN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIHJzc1NlcnZpY2U6IFJzc1NlcnZpY2UsIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucykge1xuICAgICAgICB0aGlzLnJzc0l0ZW0gPSByc3NTZXJ2aWNlLmdldEl0ZW0oKTtcbiAgICAgICAgcnNzU2VydmljZS5nZXROb3RlZEl0ZW1Gb3IodGhpcy5yc3NJdGVtLnV1aWQsIChjdXN0b21JdGVtczpDdXN0b21JdGVtW10pPT57XG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gY3VzdG9tSXRlbXNbMF0udGl0bGU7XG4gICAgICAgICAgICB0aGlzLm5vdGUgPSBjdXN0b21JdGVtc1swXS5ub3RlO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHNhdmUoKXtcbiAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmFkZE5vdGVUb0l0ZW0odGhpcy5yc3NJdGVtLnV1aWQsdGhpcy50aXRsZSwgdGhpcy5ub3RlLCAoKT0+e1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLmJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYmFjaygpe1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMuYmFjaygpO1xuICAgIH1cbn1cbiJdfQ==