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
