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
            templateUrl: 'pages/rss/rss_filter_comps/rss-book-list.component.html',
            styleUrls: ['pages/rss/rss_filter_comps/filter.common.css'],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLWJvb2stbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyc3MtYm9vay1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFpRDtBQUNqRCxrRUFBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9FQUFnRTtBQU1oRTtJQUlJLDhCQUFvQixNQUF5QixFQUFVLElBQVUsRUFBVSxVQUFzQjtRQUFqRyxpQkFNQztRQU5tQixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBRjFGLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFJekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFO1lBQ3JCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCx1Q0FBUSxHQUFSO1FBQUEsaUJBT0M7UUFORyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFBLEtBQUs7WUFDN0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ2QsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNILEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sd0NBQVMsR0FBaEIsVUFBaUIsSUFBSTtRQUNqQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxVQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtnQkFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFRLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHFDQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELDZDQUFjLEdBQWQ7UUFDSSxJQUFJLGFBQWEsR0FBYSxFQUFFLENBQUM7UUFDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUM5QixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQTlDUSxvQkFBb0I7UUFKaEMsZ0JBQVMsQ0FBQztZQUNQLFdBQVcsRUFBRSx5REFBeUQ7WUFDdEUsU0FBUyxFQUFFLENBQUMsOENBQThDLENBQUM7U0FDOUQsQ0FBQzt5Q0FLOEIsZ0NBQWlCLEVBQWdCLFdBQUksRUFBc0Isd0JBQVU7T0FKeEYsb0JBQW9CLENBK0NoQztJQUFELDJCQUFDO0NBQUEsQUEvQ0QsSUErQ0M7QUEvQ1ksb0RBQW9CO0FBaURqQztJQUdJLGNBQVksSUFBWTtRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFQRCxJQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ1BhcmFtcyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHtSc3NTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvcnNzLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL3Jzcy9yc3NfZmlsdGVyX2NvbXBzL3Jzcy1ib29rLWxpc3QuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWydwYWdlcy9yc3MvcnNzX2ZpbHRlcl9jb21wcy9maWx0ZXIuY29tbW9uLmNzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBSc3NCb29rTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBwdWJsaWMgYm9va0xpc3Q6IEl0ZW1bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJhbXM6IE1vZGFsRGlhbG9nUGFyYW1zLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgcnNzU2VydmljZTogUnNzU2VydmljZSkge1xuXG4gICAgICAgIHRoaXMuYm9va0xpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5wYWdlLm9uKFwidW5sb2FkZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2xvc2VDYWxsQmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldEJvb2tMaXN0KGJvb2tzID0+IHtcbiAgICAgICAgICAgIGJvb2tzLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib29rTGlzdC5wdXNoKG5ldyBJdGVtKG5hbWUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5ib29rTGlzdC51bnNoaWZ0KG5ldyBJdGVtKFwiU2VsZWN0IEFsbFwiKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkl0ZW1UYXAoYXJncykge1xuICAgICAgICBsZXQgdGFwSW5kZXggPSBhcmdzLmluZGV4O1xuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuYm9va0xpc3RbdGFwSW5kZXhdO1xuICAgICAgICBpZiAodGFwSW5kZXggPT0gMCkge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gIWl0ZW0uc2VsZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLmJvb2tMaXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gIWl0ZW0uc2VsZWN0ZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdWJtaXQoKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlQ2FsbEJhY2soKTtcbiAgICB9XG5cbiAgICBfY2xvc2VDYWxsQmFjaygpe1xuICAgICAgICBsZXQgc2VsZWN0ZWRCb29rczogU3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmJvb2tMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ib29rTGlzdFtpXS5zZWxlY3RlZClcbiAgICAgICAgICAgIHNlbGVjdGVkQm9va3MucHVzaCh0aGlzLmJvb2tMaXN0W2ldLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3RlZCBib29rcyBhcmUgJywgc2VsZWN0ZWRCb29rcyk7XG4gICAgICAgIHRoaXMucGFyYW1zLmNsb3NlQ2FsbGJhY2soc2VsZWN0ZWRCb29rcyk7XG4gICAgfVxufVxuXG5jbGFzcyBJdGVtIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xuICAgIH1cbn1cbiJdfQ==