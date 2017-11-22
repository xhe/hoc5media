"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var page_1 = require("ui/page");
var rss_service_1 = require("../../../shared/services/rss.service");
var RssBookListComponent = (function () {
    function RssBookListComponent(params, page, rssService) {
        var _this = this;
        this.params = params;
        this.page = page;
        this.rssService = rssService;
        this.bookList = [];
        this.bookList = [];
        this.page.on("unloaded", function () {
            _this._closeCallBack();
        });
    }
    RssBookListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rssService.getBookList(function (books) {
            books.forEach(function (name) {
                _this.bookList.push(new Item(name));
            });
            _this.bookList.unshift(new Item("Select All"));
        });
    };
    RssBookListComponent.prototype.onItemTap = function (args) {
        var tapIndex = args.index;
        var item = this.bookList[tapIndex];
        if (tapIndex == 0) {
            var selected_1 = !item.selected;
            this.bookList.forEach(function (item) {
                item.selected = selected_1;
            });
        }
        else {
            item.selected = !item.selected;
        }
    };
    RssBookListComponent.prototype.submit = function () {
        this._closeCallBack();
    };
    RssBookListComponent.prototype._closeCallBack = function () {
        var selectedBooks = [];
        for (var i = 1; i < this.bookList.length; i++) {
            if (this.bookList[i].selected)
                selectedBooks.push(this.bookList[i].name);
        }
        console.log('selected books are ', selectedBooks);
        this.params.closeCallback(selectedBooks);
    };
    RssBookListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: './rss-book-list.component.html',
            styleUrls: ['./filter.common.css'],
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams, page_1.Page, rss_service_1.RssService])
    ], RssBookListComponent);
    return RssBookListComponent;
}());
exports.RssBookListComponent = RssBookListComponent;
var Item = (function () {
    function Item(name) {
        this.name = name;
        this.selected = true;
    }
    return Item;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLWJvb2stbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyc3MtYm9vay1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFpRDtBQUNqRCxrRUFBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9FQUFnRTtBQU9oRTtJQUlJLDhCQUFvQixNQUF5QixFQUFVLElBQVUsRUFBVSxVQUFzQjtRQUFqRyxpQkFNQztRQU5tQixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBRjFGLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFJekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFO1lBQ3JCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCx1Q0FBUSxHQUFSO1FBQUEsaUJBT0M7UUFORyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFBLEtBQUs7WUFDN0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ2QsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNILEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sd0NBQVMsR0FBaEIsVUFBaUIsSUFBSTtRQUNqQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxVQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtnQkFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFRLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHFDQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELDZDQUFjLEdBQWQ7UUFDSSxJQUFJLGFBQWEsR0FBYSxFQUFFLENBQUM7UUFDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUM5QixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQTlDUSxvQkFBb0I7UUFMaEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO1NBQ3JDLENBQUM7eUNBSzhCLGdDQUFpQixFQUFnQixXQUFJLEVBQXNCLHdCQUFVO09BSnhGLG9CQUFvQixDQStDaEM7SUFBRCwyQkFBQztDQUFBLEFBL0NELElBK0NDO0FBL0NZLG9EQUFvQjtBQWlEakM7SUFHSSxjQUFZLElBQVk7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTW9kYWxEaWFsb2dQYXJhbXMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7UnNzU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Jzcy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogJy4vcnNzLWJvb2stbGlzdC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZmlsdGVyLmNvbW1vbi5jc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgUnNzQm9va0xpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgcHVibGljIGJvb2tMaXN0OiBJdGVtW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyYW1zOiBNb2RhbERpYWxvZ1BhcmFtcywgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJzc1NlcnZpY2U6IFJzc1NlcnZpY2UpIHtcblxuICAgICAgICB0aGlzLmJvb2tMaXN0ID0gW107XG4gICAgICAgIHRoaXMucGFnZS5vbihcInVubG9hZGVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlQ2FsbEJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRCb29rTGlzdChib29rcyA9PiB7XG4gICAgICAgICAgICBib29rcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9va0xpc3QucHVzaChuZXcgSXRlbShuYW1lKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYm9va0xpc3QudW5zaGlmdChuZXcgSXRlbShcIlNlbGVjdCBBbGxcIikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25JdGVtVGFwKGFyZ3MpIHtcbiAgICAgICAgbGV0IHRhcEluZGV4ID0gYXJncy5pbmRleDtcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmJvb2tMaXN0W3RhcEluZGV4XTtcbiAgICAgICAgaWYgKHRhcEluZGV4ID09IDApIHtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9ICFpdGVtLnNlbGVjdGVkO1xuICAgICAgICAgICAgdGhpcy5ib29rTGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9ICFpdGVtLnNlbGVjdGVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3VibWl0KCkge1xuICAgICAgICB0aGlzLl9jbG9zZUNhbGxCYWNrKCk7XG4gICAgfVxuXG4gICAgX2Nsb3NlQ2FsbEJhY2soKXtcbiAgICAgICAgbGV0IHNlbGVjdGVkQm9va3M6IFN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ib29rTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYm9va0xpc3RbaV0uc2VsZWN0ZWQpXG4gICAgICAgICAgICBzZWxlY3RlZEJvb2tzLnB1c2godGhpcy5ib29rTGlzdFtpXS5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0ZWQgYm9va3MgYXJlICcsIHNlbGVjdGVkQm9va3MpO1xuICAgICAgICB0aGlzLnBhcmFtcy5jbG9zZUNhbGxiYWNrKHNlbGVjdGVkQm9va3MpO1xuICAgIH1cbn1cblxuY2xhc3MgSXRlbSB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHNlbGVjdGVkOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG59XG4iXX0=