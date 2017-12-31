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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3RlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3QztBQUN4QyxvRUFBZ0U7QUFJaEUsc0RBQTZEO0FBTzdEO0lBTUksMEJBQXFCLFVBQXNCLEVBQVUsZ0JBQWtDO1FBQXZGLGlCQU1DO1FBTm9CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ25GLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BDLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBQyxXQUF3QjtZQUNuRSxLQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDbEMsS0FBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELCtCQUFJLEdBQUo7UUFBQSxpQkFJQztRQUhHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNuRSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsK0JBQUksR0FBSjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBdEJRLGdCQUFnQjtRQUw1QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLFlBQVksQ0FBQztZQUNqRCxXQUFXLEVBQUUsdUJBQXVCO1NBQ3ZDLENBQUM7eUNBT21DLHdCQUFVLEVBQTRCLHlCQUFnQjtPQU45RSxnQkFBZ0IsQ0F1QjVCO0lBQUQsdUJBQUM7Q0FBQSxBQXZCRCxJQXVCQztBQXZCWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7UnNzU2VydmljZX0gZnJvbSBcIi4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9yc3Muc2VydmljZVwiO1xuaW1wb3J0IHsgVGV4dFZpZXcgfSBmcm9tIFwidWkvdGV4dC12aWV3XCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwicGxhdGZvcm1cIjtcbmltcG9ydCB7UnNzLCBDaGFubmVsLCBDaGFubmVsSW1hZ2UsIEl0ZW0sIEN1c3RvbUl0ZW19IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9lbnRpdGllcy9lbnRpdGllcyc7XG5pbXBvcnQge1JvdXRlckV4dGVuc2lvbnN9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzdHlsZVVybHM6IFsnLi9ub3RlLmNvbXBvbmVudC5jc3MnLCAnLi9ub3RlLmNzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9ub3RlLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBSc3NOb3RlQ29tcG9uZW50IHtcblxuICAgIHJzc0l0ZW06SXRlbTtcbiAgICB0aXRsZTpzdHJpbmc7XG4gICAgbm90ZTpzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSByc3NTZXJ2aWNlOiBSc3NTZXJ2aWNlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMpIHtcbiAgICAgICAgdGhpcy5yc3NJdGVtID0gcnNzU2VydmljZS5nZXRJdGVtKCk7XG4gICAgICAgIHJzc1NlcnZpY2UuZ2V0Tm90ZWRJdGVtRm9yKHRoaXMucnNzSXRlbS51dWlkLCAoY3VzdG9tSXRlbXM6Q3VzdG9tSXRlbVtdKT0+e1xuICAgICAgICAgICAgdGhpcy50aXRsZSA9IGN1c3RvbUl0ZW1zWzBdLnRpdGxlO1xuICAgICAgICAgICAgdGhpcy5ub3RlID0gY3VzdG9tSXRlbXNbMF0ubm90ZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzYXZlKCl7XG4gICAgICAgIHRoaXMucnNzU2VydmljZS5hZGROb3RlVG9JdGVtKHRoaXMucnNzSXRlbS51dWlkLHRoaXMudGl0bGUsIHRoaXMubm90ZSwgKCk9PntcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5iYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGJhY2soKXtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLmJhY2soKTtcbiAgICB9XG59XG4iXX0=