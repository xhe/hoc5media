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
        var leftItem = swipeView.getViewById('left-stack');
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.left = leftItem.getMeasuredWidth();
        swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.1; // 20% of whole width
    };
    RssListComponent.prototype.onRightSwipeClick = function (args) {
        var _this = this;
        var index = this.listViewComponent.listView.items.indexOf(args.object.bindingContext);
        var uuid = this.rssItems[index].uuid;
        this.rssService.setItem(this.rssItems[index]);
        if (args.object.class == 'playGridLayout') {
            var url = 'rss/' + this.rssType + '/' + index;
            this.router.navigate([url]);
            this.listViewComponent.listView.notifySwipeToExecuteFinished();
        }
        else if (args.object.class == 'favoriteGridLayout') {
            this.rssService.favoriteItem(uuid, function (favorited) {
                _this._updateFavoritedItems(function () {
                    console.log("Button clicked: " + args.object.id + " for item with index: " + index);
                    _this.listViewComponent.listView.notifySwipeToExecuteFinished();
                });
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
        this.rssService.getAllMyFavoritedItemSimplified(this.rssType, function (items) {
            _this._favoritedItems = items;
            if (cb)
                cb();
        });
        // this.rssService.getAllMyFavoritedItemSimplified(this.rssType, items=>{
        //     this._rssItems.forEach(item=>{
        //         var bFound = false;
        //         items.forEach(i=>{
        //             if(item.uuid==i.uuid){
        //                 bFound = true;
        //             }
        //         });
        //         item['favorited'] = bFound;
        //     });
        //     if(cb) cb();
        // });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnNzLWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQStHO0FBQy9HLG9FQUFnRTtBQUNoRSwwQ0FBK0M7QUFDL0MsOERBQXFFO0FBQ3JFLDBDQUF1QztBQUV2QyxrRUFBOEY7QUFJOUYsZ0VBQTRFO0FBRzVFLGtFQUF5RjtBQUV6Rix1RkFBaUY7QUFDakYsMkZBQXFGO0FBRXJGLGdDQUE2QjtBQU83QjtJQXlCSSwwQkFBb0IsWUFBZ0MsRUFDeEMsbUJBQXNDLEVBQ3RDLE1BQWMsRUFDZCxVQUFzQixFQUN0QixjQUE4QixFQUM5QixLQUF1QixFQUN2QixJQUFTO1FBTkQsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQ3hDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBbUI7UUFDdEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZCLFNBQUksR0FBSixJQUFJLENBQUs7UUFwQmIsZUFBVSxHQUFXLEtBQUssQ0FBQztRQU1uQyxlQUFVLEdBQVUsRUFBRSxDQUFDO1FBZ0JuQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxlQUFlLEdBQUMsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUMsRUFBRSxDQUFDO1FBRWIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQUks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QUFnQixDQUFDO1lBQ3RELFdBQVcsRUFBRSwyQkFBMkI7U0FDM0MsQ0FBQzt5Q0EwQm9DLGlDQUFrQjtZQUNuQix3QkFBaUI7WUFDOUIsZUFBTTtZQUNGLHdCQUFVO1lBQ04sdUJBQWM7WUFDdkIsdUJBQWdCO1lBQ2xCLFdBQUk7T0EvQlosZ0JBQWdCLENBOFV4QjtJQUFELHVCQUFDO0NBQUEsQUE5VUwsSUE4VUs7QUE5VVEsNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgVmlld0NvbnRhaW5lclJlZn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7UnNzU2VydmljZX0gZnJvbSBcIi4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9yc3Muc2VydmljZVwiO1xuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZX0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7UnNzLCBDaGFubmVsLCBJdGVtfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvZW50aXRpZXMvZW50aXRpZXMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcblxuaW1wb3J0IHtSYWRTaWRlRHJhd2VyQ29tcG9uZW50LCBTaWRlRHJhd2VyVHlwZX0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlci9hbmd1bGFyXCI7XG5pbXBvcnQge1JhZFNpZGVEcmF3ZXJ9IGZyb20gJ25hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlcic7XG5cbmltcG9ydCB7UmFkTGlzdFZpZXcsIExpc3RWaWV3RXZlbnREYXRhLCBMaXN0Vmlld0xvYWRPbkRlbWFuZE1vZGV9IGZyb20gJ25hdGl2ZXNjcmlwdC1wcm8tdWkvbGlzdHZpZXcnO1xuaW1wb3J0IHsgUmFkTGlzdFZpZXdDb21wb25lbnQgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9saXN0dmlldy9hbmd1bGFyXCI7XG5cbmltcG9ydCB7IFZpZXcgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2NvcmUvdmlldyc7XG5pbXBvcnQge01vZGFsRGlhbG9nU2VydmljZSwgTW9kYWxEaWFsb2dPcHRpb25zfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5cbmltcG9ydCB7UnNzQm9va0xpc3RDb21wb25lbnR9IGZyb20gJy4uL3Jzc19maWx0ZXJfY29tcHMvcnNzLWJvb2stbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHtSc3NEYXRhUGlja2VyQ29tcG9uZW50fSBmcm9tICcuLi9yc3NfZmlsdGVyX2NvbXBzL3Jzcy1kYXRlLXBpY2tlci5jb21wb25lbnQnO1xuXG5pbXBvcnQge1BhZ2V9IGZyb20gJ3VpL3BhZ2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHN0eWxlVXJsczogWycuL3Jzcy1saXN0LWNvbW1vbi5jc3MnLCAnLi9yc3MtbGlzdC5jc3MnXSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vcnNzLWxpc3QuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIFJzc0xpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICAgIHJzc1R5cGU6IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIGxvYWRpbmc6IGJvb2xlYW47XG4gICAgY2hhbm5lbDogQ2hhbm5lbDtcblxuICAgIF9yc3NJdGVtczphbnk7XG4gICAgX2Zhdm9yaXRlZEl0ZW1zOmFueTtcbiAgICBfbm90ZWRJdGVtczphbnk7XG5cbiAgICBzZWxlY3RlZEJvb2tzOiBTdHJpbmdbXTtcbiAgICBwcml2YXRlIGJTZWFyY2hpbmc6Ym9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgc2VhcmNoUGVyaW9kOmFueTtcblxuICAgIHNlbGVjdGVkRGF0ZU9wdGlvbjpzdHJpbmc7XG4gICAgc2VsZWN0ZWREYXRlMTpzdHJpbmc7XG4gICAgc2VsZWN0ZWREYXRlMjpzdHJpbmc7XG4gICAgZGF0ZVN0cmluZzpzdHJpbmcgPSBcIlwiO1xuXG4gICAgbW9kZTpzdHJpbmc7XG5cbiAgICBwdWJsaWMgZ2V0IHJzc0l0ZW1zKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9yc3NJdGVtcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1vZGFsU2VydmljZTogTW9kYWxEaWFsb2dTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIHJzc1NlcnZpY2U6IFJzc1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICBwcml2YXRlIHBhZ2U6UGFnZVxuICAgICkge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGFubmVsID0gbmV3IENoYW5uZWwoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEJvb2tzID0gW107XG4gICAgICAgIHRoaXMuX2Zhdm9yaXRlZEl0ZW1zPVtdO1xuICAgICAgICB0aGlzLl9ub3RlZEl0ZW1zID0gW107XG4gICAgICAgIHRoaXMubW9kZT1cIlwiO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucGFnZS5vbihQYWdlLm5hdmlnYXRpbmdUb0V2ZW50LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMuX3VwZGF0ZU5vdGVkSXRlbXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgQFZpZXdDaGlsZChSYWRTaWRlRHJhd2VyQ29tcG9uZW50KSBwdWJsaWMgZHJhd2VyQ29tcG9uZW50OiBSYWRTaWRlRHJhd2VyQ29tcG9uZW50O1xuICAgIHByaXZhdGUgZHJhd2VyOiBSYWRTaWRlRHJhd2VyO1xuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLmRyYXdlciA9IHRoaXMuZHJhd2VyQ29tcG9uZW50LnNpZGVEcmF3ZXI7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdGlvblJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9wZW5EcmF3ZXIoKSB7XG4gICAgICAgIHRoaXMuZHJhd2VyLnNob3dEcmF3ZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25BcHBseUZpbHRlcigpe1xuICAgICAgICB0aGlzLnJzc1NlcnZpY2Uuc2VhcmNoU2ltcGxpZmllZFJzc09iamVjdHNGb3IodGhpcy5yc3NUeXBlLFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEJvb2tzLFt0aGlzLnNlbGVjdGVkRGF0ZU9wdGlvbiwgdGhpcy5zZWxlY3RlZERhdGUxLCB0aGlzLnNlbGVjdGVkRGF0ZTJdLCBpdGVtcz0+e1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub25DYW5jZWxGaWx0ZXIoKTtcbiAgICB9XG4gICAgcHVibGljIG9uQ2FuY2VsRmlsdGVyKCl7XG4gICAgICAgIHRoaXMuZHJhd2VyLmNsb3NlRHJhd2VyKCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucGFyYW1zLmZvckVhY2goKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChwYXJhbXNbJ3R5cGUnXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3F0JzogdGhpcy50aXRsZSA9ICB0aGlzLnJzc1NlcnZpY2UudHJhbnMoJ1FUIC0gUXVpZXQgVGltZScsJ+avj+aXpeeBteS/ricpIDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2Vla2x5X3poJzogdGhpcy50aXRsZSA9IHRoaXMucnNzU2VydmljZS50cmFucygnQ2hpbmVzZSBTZXJtb25zJywn5Lit5paH6K6y6YGTJyk7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWtseV9lbic6IHRoaXMudGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoJ0VuZ2xpc2ggU2VybW9ucycsJ+iLseaWh+iusumBkycpIDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2lzdGVyJzogdGhpcy50aXRsZSA9IHRoaXMucnNzU2VydmljZS50cmFucygnU2lzdGVyIFdvcnNoaXBzJywn5aeQ5aa55Zui5aWRJykgOyBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucnNzVHlwZSA9IHBhcmFtc1sndHlwZSddO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuXG4gICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRTaW1wbGlmaWVkUnNzT2JqZWN0c0Zvcih0aGlzLnJzc1R5cGUsIChjaGFubmVsOiBDaGFubmVsLCBpdGVtczogSXRlbVtdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVGYXZvcml0ZWRJdGVtcygoKT0+e1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU5vdGVkSXRlbXMoKTtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0aW9uUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICB0cmFucyhlbiwgemgpe1xuICAgICAgICByZXR1cm4gdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKGVuLCB6aCk7XG4gICAgfVxuXG4gICAgcHVibGljIGZhdm9yaXRlZChpdGVtOkl0ZW0pe1xuICAgICAgICBsZXQgZmF2b3JpdGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZmF2b3JpdGVkSXRlbXMuZm9yRWFjaChmYXZvcml0ZWRJdGVtPT57XG4gICAgICAgICAgICBpZihmYXZvcml0ZWRJdGVtLnV1aWQ9PT1pdGVtLnV1aWQpe1xuICAgICAgICAgICAgICAgIGZhdm9yaXRlZD10cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhdm9yaXRlZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm90ZWQoaXRlbTpJdGVtKXtcbiAgICAgICAgbGV0IG5vdGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbm90ZWRJdGVtcy5mb3JFYWNoKG5vdGVkSXRlbT0+e1xuICAgICAgICAgICAgaWYobm90ZWRJdGVtLnV1aWQ9PT1pdGVtLnV1aWQpe1xuICAgICAgICAgICAgICAgIG5vdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBub3RlZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25JdGVtVGFwKGFyZ3MpIHtcbiAgICAgICAgdmFyIHVybCA9ICdyc3MvJyArIHRoaXMucnNzVHlwZSArICcvJyArIGFyZ3MuaW5kZXg7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnb2luZyB0byAnLCB1cmwpO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsXSk7XG4gICAgfVxuXG4gICAgcHVibGljIHNob3dNeUZhdm9yaXRlKCl7XG5cbiAgICAgICAgaWYodGhpcy5tb2RlPT0nZmF2b3JpdGUnKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuaW5nIG1vZGUgdG8gbm9uZScpO1xuICAgICAgICAgICAgdGhpcy5tb2RlPScnO1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldFNpbXBsaWZpZWRSc3NPYmplY3RzRm9yKHRoaXMucnNzVHlwZSwgKGNoYW5uZWw6IENoYW5uZWwsIGl0ZW1zOiBJdGVtW10pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLm1vZGUgPSdmYXZvcml0ZSc7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmluZyBtb2RlIHRvIGZhdm9yaXRlJyk7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0U2ltcGxpZmllZEZhdm9yaXRlZFJzc09iamVjdHMocnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IHJzc0l0ZW1zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZHJhd2VyLmNsb3NlRHJhd2VyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNob3dNeU5vdGVkKCl7XG4gICAgICAgIGlmKHRoaXMubW9kZT09J25vdGVkJyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmluZyBtb2RlIHRvIG5vbmUnKTtcbiAgICAgICAgICAgIHRoaXMubW9kZT0nJztcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRTaW1wbGlmaWVkUnNzT2JqZWN0c0Zvcih0aGlzLnJzc1R5cGUsIChjaGFubmVsOiBDaGFubmVsLCBpdGVtczogSXRlbVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5tb2RlID0nbm90ZWQnO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoYW5pbmcgbW9kZSB0byBub3RlZCcpO1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldFNpbXBsaWZpZWROb3RlZFJzc09iamVjdHMocnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IHJzc0l0ZW1zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZHJhd2VyLmNsb3NlRHJhd2VyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTG9hZE1vcmVJdGVtc1JlcXVlc3RlZChhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsYW9hZGluZyBtb3JlIGhlcmUgLi4uJywgdGhpcy5tb2RlKVxuICAgICAgICB2YXIgbGlzdFZpZXc6UmFkTGlzdFZpZXcgPSBhcmdzLm9iamVjdDtcbiAgICAgICAgdmFyIHN0YXJ0aW5nQ250ID0gdGhpcy5fcnNzSXRlbXMubGVuZ3RoO1xuXG4gICAgICAgIGlmKHRoaXMubW9kZT09J25vdGVkJyl7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UubmV4dFNpbXBsaWZpZWROb3RlZFBhZ2UocnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IHJzc0l0ZW1zO1xuICAgICAgICAgICAgICAgIGxpc3RWaWV3Lm5vdGlmeUxvYWRPbkRlbWFuZEZpbmlzaGVkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2UgaWYodGhpcy5tb2RlPT0nZmF2b3JpdGUnKXtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5uZXh0U2ltcGxpZmllZEZhdm9yaXRlUGFnZShyc3NJdGVtcz0+e1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gcnNzSXRlbXM7XG4gICAgICAgICAgICAgICAgbGlzdFZpZXcubm90aWZ5TG9hZE9uRGVtYW5kRmluaXNoZWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZSBpZih0aGlzLm1vZGU9PSdzZWFyY2gnKXtcbiAgICAgICAgICAgIC8vdmFyIGxpc3RWaWV3OiBSYWRMaXN0VmlldyA9IGFyZ3Mub2JqZWN0O1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLm5leHRTaW1wbGlmaWVkU2VhcmNoUGFnZUZvcih0aGlzLnJzc1R5cGUsIHRoaXMuc2VsZWN0ZWRCb29rcyxcbiAgICAgICAgICAgICAgICBbdGhpcy5zZWxlY3RlZERhdGVPcHRpb24sIHRoaXMuc2VsZWN0ZWREYXRlMSwgdGhpcy5zZWxlY3RlZERhdGUyXSxcbiAgICAgICAgICAgICAgICBpdGVtcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RWaWV3Lm5vdGlmeUxvYWRPbkRlbWFuZEZpbmlzaGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UubmV4dFNpbXBsaWZpZWRQYWdlRm9yKHRoaXMucnNzVHlwZSwgaXRlbXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICBsaXN0Vmlldy5ub3RpZnlMb2FkT25EZW1hbmRGaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGFyZ3MucmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG9uU3dpcGVDZWxsRmluaXNoZWQoKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvblN3aXBlQ2VsbEZpbmlzaGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvblN3aXBlQ2VsbFN0YXJ0ZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcbiAgICAgICAgICAgIHZhciBzd2lwZUxpbWl0cyA9IGFyZ3MuZGF0YS5zd2lwZUxpbWl0cztcbiAgICAgICAgICAgIHZhciBzd2lwZVZpZXcgPSBhcmdzWydvYmplY3QnXTtcbiAgICAgICAgICAgIHZhciByaWdodEl0ZW0gPSBzd2lwZVZpZXcuZ2V0Vmlld0J5SWQ8Vmlldz4oJ3JpZ2h0LXN0YWNrJyk7XG4gICAgICAgICAgICB2YXIgbGVmdEl0ZW0gPSBzd2lwZVZpZXcuZ2V0Vmlld0J5SWQ8Vmlldz4oJ2xlZnQtc3RhY2snKTtcbiAgICAgICAgICAgIHN3aXBlTGltaXRzLnJpZ2h0ID0gcmlnaHRJdGVtLmdldE1lYXN1cmVkV2lkdGgoKTtcbiAgICAgICAgICAgIHN3aXBlTGltaXRzLmxlZnQgPSBsZWZ0SXRlbS5nZXRNZWFzdXJlZFdpZHRoKCk7XG4gICAgICAgICAgICBzd2lwZUxpbWl0cy50aHJlc2hvbGQgPSBhcmdzWydtYWluVmlldyddLmdldE1lYXN1cmVkV2lkdGgoKSAqIDAuMTsgLy8gMjAlIG9mIHdob2xlIHdpZHRoXG4gICAgICAgIH1cblxuXG4gICAgICAgIEBWaWV3Q2hpbGQoXCJteUxpc3RWaWV3XCIpIGxpc3RWaWV3Q29tcG9uZW50OiBSYWRMaXN0Vmlld0NvbXBvbmVudDtcblxuICAgICAgICBwdWJsaWMgb25SaWdodFN3aXBlQ2xpY2soYXJncykge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5pdGVtcy5pbmRleE9mKGFyZ3Mub2JqZWN0LmJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgIGxldCB1dWlkID0gdGhpcy5yc3NJdGVtc1tpbmRleF0udXVpZDtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5zZXRJdGVtKHRoaXMucnNzSXRlbXNbaW5kZXhdKTtcblxuICAgICAgICAgICAgaWYoYXJncy5vYmplY3QuY2xhc3M9PSdwbGF5R3JpZExheW91dCcpe1xuICAgICAgICAgICAgICAgIHZhciB1cmwgPSAncnNzLycgKyB0aGlzLnJzc1R5cGUgKyAnLycgKyBpbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XG5cbiAgICAgICAgICAgIH1lbHNlIGlmKGFyZ3Mub2JqZWN0LmNsYXNzPT0nZmF2b3JpdGVHcmlkTGF5b3V0Jyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmZhdm9yaXRlSXRlbSh1dWlkLCAoZmF2b3JpdGVkKT0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVGYXZvcml0ZWRJdGVtcyggKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnV0dG9uIGNsaWNrZWQ6IFwiICsgYXJncy5vYmplY3QuaWQgKyBcIiBmb3IgaXRlbSB3aXRoIGluZGV4OiBcIiArIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ZWxzZSBpZihhcmdzLm9iamVjdC5jbGFzcz09J25vdGVHcmlkTGF5b3V0Jyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3cml0ZSBub3RlIGZvciBpdFwiKTtcbiAgICAgICAgICAgICAgICAvL25vdyBnbyB0byBub3RlIHBhZ2UgaGVyZVxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsncnNzbm90ZSddKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJ1dHRvbiBjbGlja2VkOiBcIiArIGFyZ3Mub2JqZWN0LmlkICsgXCIgZm9yIGl0ZW0gd2l0aCBpbmRleDogXCIgKyBpbmRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XG5cbiAgICAgICAgICAgIH1lbHNlIGlmKGFyZ3Mub2JqZWN0LmNsYXNzPT0nZW1haWxHcmlkTGF5b3V0Jyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLnJldHJpZXZlUnNzSXRlbUZvcigncXQnLCBpbmRleCwgaXRlbSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBzaGFyZSBmb3IgaXRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vbm93IGdvIHRvIG5vdGUgcGFnZSBoZXJlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5zaGFyZSgnZW1haWwnLCBpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCdXR0b24gY2xpY2tlZDogXCIgKyBhcmdzLm9iamVjdC5pZCArIFwiIGZvciBpdGVtIHdpdGggaW5kZXg6IFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3Q29tcG9uZW50Lmxpc3RWaWV3Lm5vdGlmeVN3aXBlVG9FeGVjdXRlRmluaXNoZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3VwZGF0ZUZhdm9yaXRlZEl0ZW1zKGNiPW51bGwpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ191cGRhdGVGYXZvcml0ZWRJdGVtcyAnKTtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRBbGxNeUZhdm9yaXRlZEl0ZW1TaW1wbGlmaWVkKHRoaXMucnNzVHlwZSwgaXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLl9mYXZvcml0ZWRJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgICAgIGlmKGNiKSBjYigpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMucnNzU2VydmljZS5nZXRBbGxNeUZhdm9yaXRlZEl0ZW1TaW1wbGlmaWVkKHRoaXMucnNzVHlwZSwgaXRlbXM9PntcbiAgICAgICAgICAgIC8vICAgICB0aGlzLl9yc3NJdGVtcy5mb3JFYWNoKGl0ZW09PntcbiAgICAgICAgICAgIC8vICAgICAgICAgdmFyIGJGb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICAgICAgICBpdGVtcy5mb3JFYWNoKGk9PntcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmKGl0ZW0udXVpZD09aS51dWlkKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBiRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vICAgICAgICAgaXRlbVsnZmF2b3JpdGVkJ10gPSBiRm91bmQ7XG4gICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgICAgICAvLyAgICAgaWYoY2IpIGNiKCk7XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3VwZGF0ZU5vdGVkSXRlbXMoY2I9bnVsbCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ191cGRhdGVOb3RlZEl0ZW1zICcpO1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldEFsbE15Tm90ZWRJdGVtU2ltcGxpZmllZCh0aGlzLnJzc1R5cGUsIGl0ZW1zPT57XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vdGVkIGl0ZW1zIGFyZSA9PicpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9ub3RlZEl0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICAgICAgaWYoY2IpIGNiKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvbkNlbGxTd2lwaW5nKCl7XG5cbiAgICAgICAgfVxuICAgICAgICBwdWJsaWMgb25JdGVtU3dpcGluZygpe1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBzaG93Qm9va3MoKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVWaWV3KFJzc0Jvb2tMaXN0Q29tcG9uZW50KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iU2VhcmNoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGU9J3NlYXJjaCc7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEJvb2tzID0gcmVzdWx0O1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpOztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzaG93RGF0ZVBpY2tlcigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVZpZXcoUnNzRGF0YVBpY2tlckNvbXBvbmVudCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRlcGlja2VyIHJlc3VsdCBpcyAnLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlT3B0aW9uID0gcmVzdWx0WzBdO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlMSA9IHJlc3VsdFsxXTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZTIgPSByZXN1bHRbMl07XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVTdHJpbmcgPSB0aGlzLnNlbGVjdGVkRGF0ZU9wdGlvbiArJyAnK3RoaXMuc2VsZWN0ZWREYXRlMTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkRGF0ZU9wdGlvbj09J0JldHdlZW4nKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlU3RyaW5nICs9JyBhbmQgJyt0aGlzLnNlbGVjdGVkRGF0ZTI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB0aGlzLmhhbmRsZUVycm9yKGVycm9yKSk7O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY3JlYXRlVmlldyhjb21wOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uczogTW9kYWxEaWFsb2dPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXG4gICAgICAgICAgICAgICAgZnVsbHNjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb2RhbFNlcnZpY2Uuc2hvd01vZGFsKGNvbXAsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBoYW5kbGVFcnJvcihlcnJvcjogYW55KSB7XG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSB0cnkgYWdhaW4hXCIpO1xuICAgICAgICAgICAgY29uc29sZS5kaXIoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN5c3RlbUZpeGluZygpe1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWydyc3Nub3RlJ10pO1xuICAgICAgICB9XG4gICAgfVxuIl19