"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rss_service_1 = require("../../../shared/services/rss.service");
var router_1 = require("@angular/router");
var entities_1 = require("../../../shared/entities/entities");
var router_2 = require("@angular/router");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var angular_2 = require("nativescript-pro-ui/listview/angular");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var rss_book_list_component_1 = require("../rss_filter_comps/rss-book-list.component");
var rss_date_picker_component_1 = require("../rss_filter_comps/rss-date-picker.component");
var page_1 = require("ui/page");
var RssListComponent = (function () {
    function RssListComponent(modalService, _changeDetectionRef, router, rssService, activatedRoute, vcRef, page) {
        this.modalService = modalService;
        this._changeDetectionRef = _changeDetectionRef;
        this.router = router;
        this.rssService = rssService;
        this.activatedRoute = activatedRoute;
        this.vcRef = vcRef;
        this.page = page;
        this.bSearching = false;
        this.dateString = "";
        this.loading = false;
        this.channel = new entities_1.Channel();
        this.selectedBooks = [];
        this._favoritedItems = [];
        this._notedItems = [];
        this.mode = "";
        var _this = this;
        this.page.on(page_1.Page.navigatingToEvent, function () {
            _this._updateNotedItems();
        });
    }
    Object.defineProperty(RssListComponent.prototype, "rssItems", {
        get: function () {
            return this._rssItems;
        },
        enumerable: true,
        configurable: true
    });
    RssListComponent.prototype.ngAfterViewInit = function () {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    };
    RssListComponent.prototype.openDrawer = function () {
        this.drawer.showDrawer();
    };
    RssListComponent.prototype.onApplyFilter = function () {
        var _this = this;
        this.rssService.searchSimplifiedRssObjectsFor(this.rssType, this.selectedBooks, [this.selectedDateOption, this.selectedDate1, this.selectedDate2], function (items) {
            _this._rssItems = items;
        });
        this.onCancelFilter();
    };
    RssListComponent.prototype.onCancelFilter = function () {
        this.drawer.closeDrawer();
    };
    RssListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.forEach(function (params) {
            switch (params['type']) {
                case 'qt':
                    _this.title = _this.rssService.trans('QT - Quiet Time', '每日灵修');
                    break;
                case 'weekly_zh':
                    _this.title = _this.rssService.trans('Chinese Sermons', '中文讲道');
                    break;
                case 'weekly_en':
                    _this.title = _this.rssService.trans('English Sermons', '英文讲道');
                    break;
                case 'sister':
                    _this.title = _this.rssService.trans('Sister Worships', '姐妹团契');
                    break;
            }
            _this.rssType = params['type'];
        });
        this.loading = true;
        this.rssService.getSimplifiedRssObjectsFor(this.rssType, function (channel, items) {
            _this.channel = channel;
            _this._rssItems = items;
            _this.loading = false;
            _this._updateFavoritedItems(function () {
                _this._updateNotedItems();
            });
        });
        this._changeDetectionRef.detectChanges();
    };
    RssListComponent.prototype.trans = function (en, zh) {
        return this.rssService.trans(en, zh);
    };
    RssListComponent.prototype.favorited = function (item) {
        var favorited = false;
        this._favoritedItems.forEach(function (favoritedItem) {
            if (favoritedItem.uuid === item.uuid) {
                favorited = true;
            }
        });
        return favorited;
    };
    RssListComponent.prototype.noted = function (item) {
        var noted = false;
        this._notedItems.forEach(function (notedItem) {
            if (notedItem.uuid === item.uuid) {
                noted = true;
            }
        });
        return noted;
    };
    RssListComponent.prototype.onItemTap = function (args) {
        var url = 'rss/' + this.rssType + '/' + args.index;
        console.log('going to ', url);
        this.router.navigate([url]);
    };
    RssListComponent.prototype.showMyFavorite = function () {
        var _this = this;
        if (this.mode == 'favorite') {
            console.log('chaning mode to none');
            this.mode = '';
            this.rssService.getSimplifiedRssObjectsFor(this.rssType, function (channel, items) {
                _this.channel = channel;
                _this._rssItems = items;
            });
        }
        else {
            this.mode = 'favorite';
            console.log('chaning mode to favorite');
            this.rssService.getSimplifiedFavoritedRssObjects(function (rssItems) {
                _this._rssItems = rssItems;
            });
        }
        this.loading = false;
        this.drawer.closeDrawer();
    };
    RssListComponent.prototype.showMyNoted = function () {
        var _this = this;
        if (this.mode == 'noted') {
            console.log('chaning mode to none');
            this.mode = '';
            this.rssService.getSimplifiedRssObjectsFor(this.rssType, function (channel, items) {
                _this.channel = channel;
                _this._rssItems = items;
            });
        }
        else {
            this.mode = 'noted';
            console.log('chaning mode to noted');
            this.rssService.getSimplifiedNotedRssObjects(function (rssItems) {
                _this._rssItems = rssItems;
            });
        }
        this.loading = false;
        this.drawer.closeDrawer();
    };
    RssListComponent.prototype.onLoadMoreItemsRequested = function (args) {
        var _this = this;
        console.log('laoading more here ...', this.mode);
        var listView = args.object;
        var startingCnt = this._rssItems.length;
        if (this.mode == 'noted') {
            this.rssService.nextSimplifiedNotedPage(function (rssItems) {
                _this._rssItems = rssItems;
                listView.notifyLoadOnDemandFinished();
            });
        }
        else if (this.mode == 'favorite') {
            this.rssService.nextSimplifiedFavoritePage(function (rssItems) {
                _this._rssItems = rssItems;
                listView.notifyLoadOnDemandFinished();
            });
        }
        else if (this.mode == 'search') {
            //var listView: RadListView = args.object;
            this.rssService.nextSimplifiedSearchPageFor(this.rssType, this.selectedBooks, [this.selectedDateOption, this.selectedDate1, this.selectedDate2], function (items) {
                _this._rssItems = items;
                listView.notifyLoadOnDemandFinished();
            });
        }
        else {
            this.rssService.nextSimplifiedPageFor(this.rssType, function (items) {
                _this._rssItems = items;
                listView.notifyLoadOnDemandFinished();
            });
        }
        args.returnValue = true;
    };
    RssListComponent.prototype.onSwipeCellFinished = function () {
        console.log('onSwipeCellFinished');
    };
    RssListComponent.prototype.onSwipeCellStarted = function (args) {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args['object'];
        var rightItem = swipeView.getViewById('right-stack');
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.left = 0;
        swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.2; // 20% of whole width
    };
    RssListComponent.prototype.onRightSwipeClick = function (args) {
        var _this = this;
        var index = this.listViewComponent.listView.items.indexOf(args.object.bindingContext);
        var uuid = this.rssItems[index].uuid;
        this.rssService.setItem(this.rssItems[index]);
        if (args.object.class == 'favoriteGridLayout') {
            this.rssService.favoriteItem(uuid, function (favorited) {
                _this.rssItems[index]['favorited'] = favorited;
                _this.listViewComponent.listView.notifySwipeToExecuteFinished();
                //
                // //update favorited items here
                // this._updateFavoritedItems( ()=>{
                //     console.log("Button clicked: " + args.object.id + " for item with index: " + index);
                //     this.listViewComponent.listView.notifySwipeToExecuteFinished();
                //     //this.listViewComponent.listView.items[index].refresh();
                // } );
            });
        }
        else if (args.object.class == 'noteGridLayout') {
            console.log("write note for it");
            //now go to note page here
            this.router.navigate(['rssnote']);
            console.log("Button clicked: " + args.object.id + " for item with index: " + index);
            this.listViewComponent.listView.notifySwipeToExecuteFinished();
        }
        else if (args.object.class == 'emailGridLayout') {
            this.rssService.retrieveRssItemFor('qt', index, function (item) {
                console.log("Email share for it");
                //now go to note page here
                _this.rssService.share('email', item);
                console.log("Button clicked: " + args.object.id + " for item with index: " + index);
                _this.listViewComponent.listView.notifySwipeToExecuteFinished();
            });
        }
    };
    RssListComponent.prototype._updateFavoritedItems = function (cb) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        console.log('_updateFavoritedItems ');
        // this.rssService.getAllMyFavoritedItemSimplified(this.rssType, items=>{
        //     this._favoritedItems = items;
        //     if(cb) cb();
        // });
        this.rssService.getAllMyFavoritedItemSimplified(this.rssType, function (items) {
            _this._rssItems.forEach(function (item) {
                var bFound = false;
                items.forEach(function (i) {
                    if (item.uuid == i.uuid) {
                        bFound = true;
                    }
                });
                item['favorited'] = bFound;
            });
            if (cb)
                cb();
        });
    };
    RssListComponent.prototype._updateNotedItems = function (cb) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        console.log('_updateNotedItems ');
        this.rssService.getAllMyNotedItemSimplified(this.rssType, function (items) {
            console.log('noted items are =>');
            console.log(JSON.stringify(items));
            _this._notedItems = items;
            if (cb)
                cb();
        });
    };
    RssListComponent.prototype.onCellSwiping = function () {
    };
    RssListComponent.prototype.onItemSwiping = function () {
    };
    RssListComponent.prototype.showBooks = function () {
        var _this = this;
        this._createView(rss_book_list_component_1.RssBookListComponent).then(function (result) {
            _this.bSearching = true;
            _this.mode = 'search';
            _this.selectedBooks = result;
        }).catch(function (error) { return _this.handleError(error); });
        ;
    };
    RssListComponent.prototype.showDatePicker = function () {
        var _this = this;
        this._createView(rss_date_picker_component_1.RssDataPickerComponent).then(function (result) {
            console.log('datepicker result is ', result);
            _this.selectedDateOption = result[0];
            _this.selectedDate1 = result[1];
            _this.selectedDate2 = result[2];
            _this.dateString = _this.selectedDateOption + ' ' + _this.selectedDate1;
            if (_this.selectedDateOption == 'Between') {
                _this.dateString += ' and ' + _this.selectedDate2;
            }
        }).catch(function (error) { return _this.handleError(error); });
        ;
    };
    RssListComponent.prototype._createView = function (comp) {
        var options = {
            viewContainerRef: this.vcRef,
            fullscreen: false,
        };
        return this.modalService.showModal(comp, options);
    };
    RssListComponent.prototype.handleError = function (error) {
        alert("Please try again!");
        console.dir(error);
    };
    RssListComponent.prototype.systemFixing = function () {
        this.router.navigate(['rssnote']);
    };
    __decorate([
        core_1.ViewChild(angular_1.RadSideDrawerComponent),
        __metadata("design:type", angular_1.RadSideDrawerComponent)
    ], RssListComponent.prototype, "drawerComponent", void 0);
    __decorate([
        core_1.ViewChild("myListView"),
        __metadata("design:type", angular_2.RadListViewComponent)
    ], RssListComponent.prototype, "listViewComponent", void 0);
    RssListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['./rss-list-common.css', './rss-list.css'],
            templateUrl: './rss-list.component.html'
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogService,
            core_1.ChangeDetectorRef,
            router_2.Router,
            rss_service_1.RssService,
            router_1.ActivatedRoute,
            core_1.ViewContainerRef,
            page_1.Page])
    ], RssListComponent);
    return RssListComponent;
}());
exports.RssListComponent = RssListComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnNzLWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQStHO0FBQy9HLG9FQUFnRTtBQUNoRSwwQ0FBK0M7QUFDL0MsOERBQXFFO0FBQ3JFLDBDQUF1QztBQUV2QyxrRUFBOEY7QUFJOUYsZ0VBQTRFO0FBRzVFLGtFQUF5RjtBQUV6Rix1RkFBaUY7QUFDakYsMkZBQXFGO0FBRXJGLGdDQUE2QjtBQU83QjtJQXlCSSwwQkFBb0IsWUFBZ0MsRUFDeEMsbUJBQXNDLEVBQ3RDLE1BQWMsRUFDZCxVQUFzQixFQUN0QixjQUE4QixFQUM5QixLQUF1QixFQUN2QixJQUFTO1FBTkQsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQ3hDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBbUI7UUFDdEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZCLFNBQUksR0FBSixJQUFJLENBQUs7UUFwQmIsZUFBVSxHQUFXLEtBQUssQ0FBQztRQU1uQyxlQUFVLEdBQVUsRUFBRSxDQUFDO1FBZ0JuQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxlQUFlLEdBQUMsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUMsRUFBRSxDQUFDO1FBRWIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQUks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N1VMLElBNlVLO0FBN1VRLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIFZpZXdDb250YWluZXJSZWZ9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1Jzc1NlcnZpY2V9IGZyb20gXCIuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvcnNzLnNlcnZpY2VcIjtcbmltcG9ydCB7QWN0aXZhdGVkUm91dGV9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1JzcywgQ2hhbm5lbCwgSXRlbX0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2VudGl0aWVzL2VudGl0aWVzJztcbmltcG9ydCB7Um91dGVyfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5cbmltcG9ydCB7UmFkU2lkZURyYXdlckNvbXBvbmVudCwgU2lkZURyYXdlclR5cGV9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xuaW1wb3J0IHtSYWRTaWRlRHJhd2VyfSBmcm9tICduYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXInO1xuXG5pbXBvcnQge1JhZExpc3RWaWV3LCBMaXN0Vmlld0V2ZW50RGF0YSwgTGlzdFZpZXdMb2FkT25EZW1hbmRNb2RlfSBmcm9tICduYXRpdmVzY3JpcHQtcHJvLXVpL2xpc3R2aWV3JztcbmltcG9ydCB7IFJhZExpc3RWaWV3Q29tcG9uZW50IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvbGlzdHZpZXcvYW5ndWxhclwiO1xuXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9jb3JlL3ZpZXcnO1xuaW1wb3J0IHtNb2RhbERpYWxvZ1NlcnZpY2UsIE1vZGFsRGlhbG9nT3B0aW9uc30gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xuXG5pbXBvcnQge1Jzc0Jvb2tMaXN0Q29tcG9uZW50fSBmcm9tICcuLi9yc3NfZmlsdGVyX2NvbXBzL3Jzcy1ib29rLWxpc3QuY29tcG9uZW50JztcbmltcG9ydCB7UnNzRGF0YVBpY2tlckNvbXBvbmVudH0gZnJvbSAnLi4vcnNzX2ZpbHRlcl9jb21wcy9yc3MtZGF0ZS1waWNrZXIuY29tcG9uZW50JztcblxuaW1wb3J0IHtQYWdlfSBmcm9tICd1aS9wYWdlJztcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzdHlsZVVybHM6IFsnLi9yc3MtbGlzdC1jb21tb24uY3NzJywgJy4vcnNzLWxpc3QuY3NzJ10sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3Jzcy1saXN0LmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBSc3NMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgICByc3NUeXBlOiBzdHJpbmc7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICBsb2FkaW5nOiBib29sZWFuO1xuICAgIGNoYW5uZWw6IENoYW5uZWw7XG5cbiAgICBfcnNzSXRlbXM6YW55O1xuICAgIF9mYXZvcml0ZWRJdGVtczphbnk7XG4gICAgX25vdGVkSXRlbXM6YW55O1xuXG4gICAgc2VsZWN0ZWRCb29rczogU3RyaW5nW107XG4gICAgcHJpdmF0ZSBiU2VhcmNoaW5nOmJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHNlYXJjaFBlcmlvZDphbnk7XG5cbiAgICBzZWxlY3RlZERhdGVPcHRpb246c3RyaW5nO1xuICAgIHNlbGVjdGVkRGF0ZTE6c3RyaW5nO1xuICAgIHNlbGVjdGVkRGF0ZTI6c3RyaW5nO1xuICAgIGRhdGVTdHJpbmc6c3RyaW5nID0gXCJcIjtcblxuICAgIG1vZGU6c3RyaW5nO1xuXG4gICAgcHVibGljIGdldCByc3NJdGVtcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fcnNzSXRlbXM7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBtb2RhbFNlcnZpY2U6IE1vZGFsRGlhbG9nU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0aW9uUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSByc3NTZXJ2aWNlOiBSc3NTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgcHJpdmF0ZSBwYWdlOlBhZ2VcbiAgICApIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IG5ldyBDaGFubmVsKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRCb29rcyA9IFtdO1xuICAgICAgICB0aGlzLl9mYXZvcml0ZWRJdGVtcz1bXTtcbiAgICAgICAgdGhpcy5fbm90ZWRJdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLm1vZGU9XCJcIjtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBhZ2Uub24oUGFnZS5uYXZpZ2F0aW5nVG9FdmVudCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIF90aGlzLl91cGRhdGVOb3RlZEl0ZW1zKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEBWaWV3Q2hpbGQoUmFkU2lkZURyYXdlckNvbXBvbmVudCkgcHVibGljIGRyYXdlckNvbXBvbmVudDogUmFkU2lkZURyYXdlckNvbXBvbmVudDtcbiAgICBwcml2YXRlIGRyYXdlcjogUmFkU2lkZURyYXdlcjtcblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5kcmF3ZXIgPSB0aGlzLmRyYXdlckNvbXBvbmVudC5zaWRlRHJhd2VyO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rpb25SZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvcGVuRHJhd2VyKCkge1xuICAgICAgICB0aGlzLmRyYXdlci5zaG93RHJhd2VyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uQXBwbHlGaWx0ZXIoKXtcbiAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLnNlYXJjaFNpbXBsaWZpZWRSc3NPYmplY3RzRm9yKHRoaXMucnNzVHlwZSxcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRCb29rcyxbdGhpcy5zZWxlY3RlZERhdGVPcHRpb24sIHRoaXMuc2VsZWN0ZWREYXRlMSwgdGhpcy5zZWxlY3RlZERhdGUyXSwgaXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm9uQ2FuY2VsRmlsdGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBvbkNhbmNlbEZpbHRlcigpe1xuICAgICAgICB0aGlzLmRyYXdlci5jbG9zZURyYXdlcigpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5mb3JFYWNoKChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAocGFyYW1zWyd0eXBlJ10pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdxdCc6IHRoaXMudGl0bGUgPSAgdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKCdRVCAtIFF1aWV0IFRpbWUnLCfmr4/ml6XngbXkv64nKSA7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWtseV96aCc6IHRoaXMudGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoJ0NoaW5lc2UgU2VybW9ucycsJ+S4reaWh+iusumBkycpOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd3ZWVrbHlfZW4nOiB0aGlzLnRpdGxlID0gdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKCdFbmdsaXNoIFNlcm1vbnMnLCfoi7HmloforrLpgZMnKSA7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Npc3Rlcic6IHRoaXMudGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoJ1Npc3RlciBXb3JzaGlwcycsJ+WnkOWmueWbouWlkScpIDsgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJzc1R5cGUgPSBwYXJhbXNbJ3R5cGUnXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cblxuICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0U2ltcGxpZmllZFJzc09iamVjdHNGb3IodGhpcy5yc3NUeXBlLCAoY2hhbm5lbDogQ2hhbm5lbCwgaXRlbXM6IEl0ZW1bXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcbiAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRmF2b3JpdGVkSXRlbXMoKCk9PntcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVOb3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdGlvblJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgdHJhbnMoZW4sIHpoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucnNzU2VydmljZS50cmFucyhlbiwgemgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBmYXZvcml0ZWQoaXRlbTpJdGVtKXtcbiAgICAgICAgbGV0IGZhdm9yaXRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2Zhdm9yaXRlZEl0ZW1zLmZvckVhY2goZmF2b3JpdGVkSXRlbT0+e1xuICAgICAgICAgICAgaWYoZmF2b3JpdGVkSXRlbS51dWlkPT09aXRlbS51dWlkKXtcbiAgICAgICAgICAgICAgICBmYXZvcml0ZWQ9dHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYXZvcml0ZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIG5vdGVkKGl0ZW06SXRlbSl7XG4gICAgICAgIGxldCBub3RlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX25vdGVkSXRlbXMuZm9yRWFjaChub3RlZEl0ZW09PntcbiAgICAgICAgICAgIGlmKG5vdGVkSXRlbS51dWlkPT09aXRlbS51dWlkKXtcbiAgICAgICAgICAgICAgICBub3RlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbm90ZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIG9uSXRlbVRhcChhcmdzKSB7XG4gICAgICAgIHZhciB1cmwgPSAncnNzLycgKyB0aGlzLnJzc1R5cGUgKyAnLycgKyBhcmdzLmluZGV4O1xuICAgICAgICBjb25zb2xlLmxvZygnZ29pbmcgdG8gJywgdXJsKTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3VybF0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93TXlGYXZvcml0ZSgpe1xuXG4gICAgICAgIGlmKHRoaXMubW9kZT09J2Zhdm9yaXRlJyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmluZyBtb2RlIHRvIG5vbmUnKTtcbiAgICAgICAgICAgIHRoaXMubW9kZT0nJztcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRTaW1wbGlmaWVkUnNzT2JqZWN0c0Zvcih0aGlzLnJzc1R5cGUsIChjaGFubmVsOiBDaGFubmVsLCBpdGVtczogSXRlbVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5tb2RlID0nZmF2b3JpdGUnO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoYW5pbmcgbW9kZSB0byBmYXZvcml0ZScpO1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldFNpbXBsaWZpZWRGYXZvcml0ZWRSc3NPYmplY3RzKHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSByc3NJdGVtcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRyYXdlci5jbG9zZURyYXdlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93TXlOb3RlZCgpe1xuICAgICAgICBpZih0aGlzLm1vZGU9PSdub3RlZCcpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoYW5pbmcgbW9kZSB0byBub25lJyk7XG4gICAgICAgICAgICB0aGlzLm1vZGU9Jyc7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0U2ltcGxpZmllZFJzc09iamVjdHNGb3IodGhpcy5yc3NUeXBlLCAoY2hhbm5lbDogQ2hhbm5lbCwgaXRlbXM6IEl0ZW1bXSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMubW9kZSA9J25vdGVkJztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuaW5nIG1vZGUgdG8gbm90ZWQnKTtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRTaW1wbGlmaWVkTm90ZWRSc3NPYmplY3RzKHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSByc3NJdGVtcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRyYXdlci5jbG9zZURyYXdlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkxvYWRNb3JlSXRlbXNSZXF1ZXN0ZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnbGFvYWRpbmcgbW9yZSBoZXJlIC4uLicsIHRoaXMubW9kZSlcbiAgICAgICAgdmFyIGxpc3RWaWV3OlJhZExpc3RWaWV3ID0gYXJncy5vYmplY3Q7XG4gICAgICAgIHZhciBzdGFydGluZ0NudCA9IHRoaXMuX3Jzc0l0ZW1zLmxlbmd0aDtcblxuICAgICAgICBpZih0aGlzLm1vZGU9PSdub3RlZCcpe1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLm5leHRTaW1wbGlmaWVkTm90ZWRQYWdlKHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSByc3NJdGVtcztcbiAgICAgICAgICAgICAgICBsaXN0Vmlldy5ub3RpZnlMb2FkT25EZW1hbmRGaW5pc2hlZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNlIGlmKHRoaXMubW9kZT09J2Zhdm9yaXRlJyl7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UubmV4dFNpbXBsaWZpZWRGYXZvcml0ZVBhZ2UocnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IHJzc0l0ZW1zO1xuICAgICAgICAgICAgICAgIGxpc3RWaWV3Lm5vdGlmeUxvYWRPbkRlbWFuZEZpbmlzaGVkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2UgaWYodGhpcy5tb2RlPT0nc2VhcmNoJyl7XG4gICAgICAgICAgICAvL3ZhciBsaXN0VmlldzogUmFkTGlzdFZpZXcgPSBhcmdzLm9iamVjdDtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5uZXh0U2ltcGxpZmllZFNlYXJjaFBhZ2VGb3IodGhpcy5yc3NUeXBlLCB0aGlzLnNlbGVjdGVkQm9va3MsXG4gICAgICAgICAgICAgICAgW3RoaXMuc2VsZWN0ZWREYXRlT3B0aW9uLCB0aGlzLnNlbGVjdGVkRGF0ZTEsIHRoaXMuc2VsZWN0ZWREYXRlMl0sXG4gICAgICAgICAgICAgICAgaXRlbXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICBsaXN0Vmlldy5ub3RpZnlMb2FkT25EZW1hbmRGaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLm5leHRTaW1wbGlmaWVkUGFnZUZvcih0aGlzLnJzc1R5cGUsIGl0ZW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgICAgICAgICAgbGlzdFZpZXcubm90aWZ5TG9hZE9uRGVtYW5kRmluaXNoZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBhcmdzLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvblN3aXBlQ2VsbEZpbmlzaGVkKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb25Td2lwZUNlbGxGaW5pc2hlZCcpXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb25Td2lwZUNlbGxTdGFydGVkKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XG4gICAgICAgICAgICB2YXIgc3dpcGVMaW1pdHMgPSBhcmdzLmRhdGEuc3dpcGVMaW1pdHM7XG4gICAgICAgICAgICB2YXIgc3dpcGVWaWV3ID0gYXJnc1snb2JqZWN0J107XG4gICAgICAgICAgICB2YXIgcmlnaHRJdGVtID0gc3dpcGVWaWV3LmdldFZpZXdCeUlkPFZpZXc+KCdyaWdodC1zdGFjaycpO1xuICAgICAgICAgICAgc3dpcGVMaW1pdHMucmlnaHQgPSByaWdodEl0ZW0uZ2V0TWVhc3VyZWRXaWR0aCgpO1xuICAgICAgICAgICAgc3dpcGVMaW1pdHMubGVmdCA9IDA7XG4gICAgICAgICAgICBzd2lwZUxpbWl0cy50aHJlc2hvbGQgPSBhcmdzWydtYWluVmlldyddLmdldE1lYXN1cmVkV2lkdGgoKSAqIDAuMjsgLy8gMjAlIG9mIHdob2xlIHdpZHRoXG4gICAgICAgIH1cblxuXG4gICAgICAgIEBWaWV3Q2hpbGQoXCJteUxpc3RWaWV3XCIpIGxpc3RWaWV3Q29tcG9uZW50OiBSYWRMaXN0Vmlld0NvbXBvbmVudDtcblxuICAgICAgICBwdWJsaWMgb25SaWdodFN3aXBlQ2xpY2soYXJncykge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5pdGVtcy5pbmRleE9mKGFyZ3Mub2JqZWN0LmJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgIGxldCB1dWlkID0gdGhpcy5yc3NJdGVtc1tpbmRleF0udXVpZDtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5zZXRJdGVtKHRoaXMucnNzSXRlbXNbaW5kZXhdKTtcblxuICAgICAgICAgICAgaWYoYXJncy5vYmplY3QuY2xhc3M9PSdmYXZvcml0ZUdyaWRMYXlvdXQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZmF2b3JpdGVJdGVtKHV1aWQsIChmYXZvcml0ZWQpPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucnNzSXRlbXNbaW5kZXhdWydmYXZvcml0ZWQnXSA9IGZhdm9yaXRlZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgIC8vIC8vdXBkYXRlIGZhdm9yaXRlZCBpdGVtcyBoZXJlXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX3VwZGF0ZUZhdm9yaXRlZEl0ZW1zKCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJCdXR0b24gY2xpY2tlZDogXCIgKyBhcmdzLm9iamVjdC5pZCArIFwiIGZvciBpdGVtIHdpdGggaW5kZXg6IFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvL3RoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcuaXRlbXNbaW5kZXhdLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfSApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2UgaWYoYXJncy5vYmplY3QuY2xhc3M9PSdub3RlR3JpZExheW91dCcpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid3JpdGUgbm90ZSBmb3IgaXRcIik7XG4gICAgICAgICAgICAgICAgLy9ub3cgZ28gdG8gbm90ZSBwYWdlIGhlcmVcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJ3Jzc25vdGUnXSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCdXR0b24gY2xpY2tlZDogXCIgKyBhcmdzLm9iamVjdC5pZCArIFwiIGZvciBpdGVtIHdpdGggaW5kZXg6IFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihhcmdzLm9iamVjdC5jbGFzcz09J2VtYWlsR3JpZExheW91dCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5yZXRyaWV2ZVJzc0l0ZW1Gb3IoJ3F0JywgaW5kZXgsIGl0ZW0gPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgc2hhcmUgZm9yIGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAvL25vdyBnbyB0byBub3RlIHBhZ2UgaGVyZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2Uuc2hhcmUoJ2VtYWlsJywgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnV0dG9uIGNsaWNrZWQ6IFwiICsgYXJncy5vYmplY3QuaWQgKyBcIiBmb3IgaXRlbSB3aXRoIGluZGV4OiBcIiArIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF91cGRhdGVGYXZvcml0ZWRJdGVtcyhjYj1udWxsKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICdfdXBkYXRlRmF2b3JpdGVkSXRlbXMgJyk7XG4gICAgICAgICAgICAvLyB0aGlzLnJzc1NlcnZpY2UuZ2V0QWxsTXlGYXZvcml0ZWRJdGVtU2ltcGxpZmllZCh0aGlzLnJzc1R5cGUsIGl0ZW1zPT57XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5fZmF2b3JpdGVkSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgIC8vICAgICBpZihjYikgY2IoKTtcbiAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0QWxsTXlGYXZvcml0ZWRJdGVtU2ltcGxpZmllZCh0aGlzLnJzc1R5cGUsIGl0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMuZm9yRWFjaChpdGVtPT57XG4gICAgICAgICAgICAgICAgICAgIHZhciBiRm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtLnV1aWQ9PWkudXVpZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYkZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1bJ2Zhdm9yaXRlZCddID0gYkZvdW5kO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmKGNiKSBjYigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF91cGRhdGVOb3RlZEl0ZW1zKGNiPW51bGwpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coICdfdXBkYXRlTm90ZWRJdGVtcyAnKTtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRBbGxNeU5vdGVkSXRlbVNpbXBsaWZpZWQodGhpcy5yc3NUeXBlLCBpdGVtcz0+e1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub3RlZCBpdGVtcyBhcmUgPT4nKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbm90ZWRJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgICAgIGlmKGNiKSBjYigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb25DZWxsU3dpcGluZygpe1xuXG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIG9uSXRlbVN3aXBpbmcoKXtcblxuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgc2hvd0Jvb2tzKCkge1xuICAgICAgICAgICAgdGhpcy5fY3JlYXRlVmlldyhSc3NCb29rTGlzdENvbXBvbmVudCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYlNlYXJjaGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlPSdzZWFyY2gnO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRCb29rcyA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpKTs7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2hvd0RhdGVQaWNrZXIoKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVWaWV3KFJzc0RhdGFQaWNrZXJDb21wb25lbnQpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0ZXBpY2tlciByZXN1bHQgaXMgJywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZU9wdGlvbiA9IHJlc3VsdFswXTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZTEgPSByZXN1bHRbMV07XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGUyID0gcmVzdWx0WzJdO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlU3RyaW5nID0gdGhpcy5zZWxlY3RlZERhdGVPcHRpb24gKycgJyt0aGlzLnNlbGVjdGVkRGF0ZTE7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3RlZERhdGVPcHRpb249PSdCZXR3ZWVuJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVN0cmluZyArPScgYW5kICcrdGhpcy5zZWxlY3RlZERhdGUyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpOztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NyZWF0ZVZpZXcoY29tcDogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZjUmVmLFxuICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxTZXJ2aWNlLnNob3dNb2RhbChjb21wLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSkge1xuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgdHJ5IGFnYWluIVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzeXN0ZW1GaXhpbmcoKXtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsncnNzbm90ZSddKTtcbiAgICAgICAgfVxuICAgIH1cbiJdfQ==