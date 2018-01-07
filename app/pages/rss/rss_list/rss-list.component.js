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
        this.mode = "single";
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
        this.rssService.searchSimplifiedRssObjectsFor(this.rssType, this.selectedBooks, [this.selectedDateOption, this.selectedDate1, this.selectedDate2], this.playingMode, function (items) {
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
    RssListComponent.prototype.toggleContinuePlaying = function () {
        if (this.playingMode == "single") {
            this.playingMode = "continue";
        }
        else {
            this.playingMode = "single";
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnNzLWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQStHO0FBQy9HLG9FQUFnRTtBQUNoRSwwQ0FBK0M7QUFDL0MsOERBQXFFO0FBQ3JFLDBDQUF1QztBQUV2QyxrRUFBOEY7QUFJOUYsZ0VBQTRFO0FBRzVFLGtFQUF5RjtBQUV6Rix1RkFBaUY7QUFDakYsMkZBQXFGO0FBRXJGLGdDQUE2QjtBQU83QjtJQTBCSSwwQkFBb0IsWUFBZ0MsRUFDeEMsbUJBQXNDLEVBQ3RDLE1BQWMsRUFDZCxVQUFzQixFQUN0QixjQUE4QixFQUM5QixLQUF1QixFQUN2QixJQUFTO1FBTkQsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQ3hDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBbUI7UUFDdEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZCLFNBQUksR0FBSixJQUFJLENBQUs7UUFyQmIsZUFBVSxHQUFXLEtBQUssQ0FBQztRQU1uQyxlQUFVLEdBQVUsRUFBRSxDQUFDO1FBaUJuQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxlQUFlLEdBQUMsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUMsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLElBQUksR0FBQyxRQUFRLENBQUM7UUFFbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pC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SUFBSSxDQUFDLFdBQVcsR0FBQyxRQUFRLENBQUM7UUFDOUIsQ0FBQztJQUNMLENBQUM7SUF2UzhCO1FBQWxDLGdCQUFTLENBQUMsZ0NBQXNCLENBQUM7a0NBQXlCLGdDQUFzQjs2REFBQztJQTBLckQ7UUFBeEIsZ0JBQVMsQ0FBQyxZQUFZLENBQUM7a0NBQW9CLDhCQUFvQjsrREFBQztJQTFONUQsZ0JBQWdCO1FBTDVCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsU0FBUyxFQUFFLENBQUMsdUJBQXVCLEVBQUUsZ0JBQWdCLENBQUM7WUFDdEQsV0FBVyxFQUFFLDJCQUEyQjtTQUMzQyxDQUFDO3lDQTJCb0MsaUNBQWtCO1lBQ25CLHdCQUFpQjtZQUM5QixlQUFNO1lBQ0Ysd0JBQVU7WUFDTix1QkFBYztZQUN2Qix1QkFBZ0I7WUFDbEIsV0FBSTtPQWhDWixnQkFBZ0IsQ0F3VnhCO0lBQUQsdUJBQUM7Q0FBQSxBQXhWTCxJQXdWSztBQXhWUSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmLCBWaWV3Q29udGFpbmVyUmVmfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtSc3NTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Jzcy5zZXJ2aWNlXCI7XG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtSc3MsIENoYW5uZWwsIEl0ZW19IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9lbnRpdGllcy9lbnRpdGllcyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuXG5pbXBvcnQge1JhZFNpZGVEcmF3ZXJDb21wb25lbnQsIFNpZGVEcmF3ZXJUeXBlfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcbmltcG9ydCB7UmFkU2lkZURyYXdlcn0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyJztcblxuaW1wb3J0IHtSYWRMaXN0VmlldywgTGlzdFZpZXdFdmVudERhdGEsIExpc3RWaWV3TG9hZE9uRGVtYW5kTW9kZX0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9saXN0dmlldyc7XG5pbXBvcnQgeyBSYWRMaXN0Vmlld0NvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL2xpc3R2aWV3L2FuZ3VsYXJcIjtcblxuaW1wb3J0IHsgVmlldyB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvY29yZS92aWV3JztcbmltcG9ydCB7TW9kYWxEaWFsb2dTZXJ2aWNlLCBNb2RhbERpYWxvZ09wdGlvbnN9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcblxuaW1wb3J0IHtSc3NCb29rTGlzdENvbXBvbmVudH0gZnJvbSAnLi4vcnNzX2ZpbHRlcl9jb21wcy9yc3MtYm9vay1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQge1Jzc0RhdGFQaWNrZXJDb21wb25lbnR9IGZyb20gJy4uL3Jzc19maWx0ZXJfY29tcHMvcnNzLWRhdGUtcGlja2VyLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7UGFnZX0gZnJvbSAndWkvcGFnZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc3R5bGVVcmxzOiBbJy4vcnNzLWxpc3QtY29tbW9uLmNzcycsICcuL3Jzcy1saXN0LmNzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yc3MtbGlzdC5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgUnNzTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcnNzVHlwZTogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgbG9hZGluZzogYm9vbGVhbjtcbiAgICBjaGFubmVsOiBDaGFubmVsO1xuXG4gICAgX3Jzc0l0ZW1zOmFueTtcbiAgICBfZmF2b3JpdGVkSXRlbXM6YW55O1xuICAgIF9ub3RlZEl0ZW1zOmFueTtcblxuICAgIHNlbGVjdGVkQm9va3M6IFN0cmluZ1tdO1xuICAgIHByaXZhdGUgYlNlYXJjaGluZzpib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBzZWFyY2hQZXJpb2Q6YW55O1xuXG4gICAgc2VsZWN0ZWREYXRlT3B0aW9uOnN0cmluZztcbiAgICBzZWxlY3RlZERhdGUxOnN0cmluZztcbiAgICBzZWxlY3RlZERhdGUyOnN0cmluZztcbiAgICBkYXRlU3RyaW5nOnN0cmluZyA9IFwiXCI7XG5cbiAgICBtb2RlOnN0cmluZztcbiAgICBwbGF5aW5nTW9kZTpzdHJpbmc7XG5cbiAgICBwdWJsaWMgZ2V0IHJzc0l0ZW1zKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9yc3NJdGVtcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1vZGFsU2VydmljZTogTW9kYWxEaWFsb2dTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIHJzc1NlcnZpY2U6IFJzc1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICBwcml2YXRlIHBhZ2U6UGFnZVxuICAgICkge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGFubmVsID0gbmV3IENoYW5uZWwoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEJvb2tzID0gW107XG4gICAgICAgIHRoaXMuX2Zhdm9yaXRlZEl0ZW1zPVtdO1xuICAgICAgICB0aGlzLl9ub3RlZEl0ZW1zID0gW107XG4gICAgICAgIHRoaXMubW9kZT1cIlwiO1xuICAgICAgICB0aGlzLm1vZGU9XCJzaW5nbGVcIjtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBhZ2Uub24oUGFnZS5uYXZpZ2F0aW5nVG9FdmVudCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIF90aGlzLl91cGRhdGVOb3RlZEl0ZW1zKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEBWaWV3Q2hpbGQoUmFkU2lkZURyYXdlckNvbXBvbmVudCkgcHVibGljIGRyYXdlckNvbXBvbmVudDogUmFkU2lkZURyYXdlckNvbXBvbmVudDtcbiAgICBwcml2YXRlIGRyYXdlcjogUmFkU2lkZURyYXdlcjtcblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5kcmF3ZXIgPSB0aGlzLmRyYXdlckNvbXBvbmVudC5zaWRlRHJhd2VyO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rpb25SZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvcGVuRHJhd2VyKCkge1xuICAgICAgICB0aGlzLmRyYXdlci5zaG93RHJhd2VyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uQXBwbHlGaWx0ZXIoKXtcbiAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLnNlYXJjaFNpbXBsaWZpZWRSc3NPYmplY3RzRm9yKHRoaXMucnNzVHlwZSxcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRCb29rcyxbdGhpcy5zZWxlY3RlZERhdGVPcHRpb24sIHRoaXMuc2VsZWN0ZWREYXRlMSwgdGhpcy5zZWxlY3RlZERhdGUyXSwgdGhpcy5wbGF5aW5nTW9kZSwgaXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm9uQ2FuY2VsRmlsdGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBvbkNhbmNlbEZpbHRlcigpe1xuICAgICAgICB0aGlzLmRyYXdlci5jbG9zZURyYXdlcigpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5mb3JFYWNoKChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAocGFyYW1zWyd0eXBlJ10pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdxdCc6IHRoaXMudGl0bGUgPSAgdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKCdRVCAtIFF1aWV0IFRpbWUnLCfmr4/ml6XngbXkv64nKSA7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWtseV96aCc6IHRoaXMudGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoJ0NoaW5lc2UgU2VybW9ucycsJ+S4reaWh+iusumBkycpOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd3ZWVrbHlfZW4nOiB0aGlzLnRpdGxlID0gdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKCdFbmdsaXNoIFNlcm1vbnMnLCfoi7HmloforrLpgZMnKSA7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Npc3Rlcic6IHRoaXMudGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoJ1Npc3RlciBXb3JzaGlwcycsJ+WnkOWmueWbouWlkScpIDsgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJzc1R5cGUgPSBwYXJhbXNbJ3R5cGUnXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cblxuICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0U2ltcGxpZmllZFJzc09iamVjdHNGb3IodGhpcy5yc3NUeXBlLCAoY2hhbm5lbDogQ2hhbm5lbCwgaXRlbXM6IEl0ZW1bXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcbiAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRmF2b3JpdGVkSXRlbXMoKCk9PntcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVOb3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdGlvblJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgdHJhbnMoZW4sIHpoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucnNzU2VydmljZS50cmFucyhlbiwgemgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBmYXZvcml0ZWQoaXRlbTpJdGVtKXtcbiAgICAgICAgbGV0IGZhdm9yaXRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2Zhdm9yaXRlZEl0ZW1zLmZvckVhY2goZmF2b3JpdGVkSXRlbT0+e1xuICAgICAgICAgICAgaWYoZmF2b3JpdGVkSXRlbS51dWlkPT09aXRlbS51dWlkKXtcbiAgICAgICAgICAgICAgICBmYXZvcml0ZWQ9dHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYXZvcml0ZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIG5vdGVkKGl0ZW06SXRlbSl7XG4gICAgICAgIGxldCBub3RlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX25vdGVkSXRlbXMuZm9yRWFjaChub3RlZEl0ZW09PntcbiAgICAgICAgICAgIGlmKG5vdGVkSXRlbS51dWlkPT09aXRlbS51dWlkKXtcbiAgICAgICAgICAgICAgICBub3RlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbm90ZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIG9uSXRlbVRhcChhcmdzKSB7XG4gICAgICAgIHZhciB1cmwgPSAncnNzLycgKyB0aGlzLnJzc1R5cGUgKyAnLycgKyBhcmdzLmluZGV4O1xuICAgICAgICBjb25zb2xlLmxvZygnZ29pbmcgdG8gJywgdXJsKTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3VybF0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93TXlGYXZvcml0ZSgpe1xuXG4gICAgICAgIGlmKHRoaXMubW9kZT09J2Zhdm9yaXRlJyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmluZyBtb2RlIHRvIG5vbmUnKTtcbiAgICAgICAgICAgIHRoaXMubW9kZT0nJztcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRTaW1wbGlmaWVkUnNzT2JqZWN0c0Zvcih0aGlzLnJzc1R5cGUsIChjaGFubmVsOiBDaGFubmVsLCBpdGVtczogSXRlbVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5tb2RlID0nZmF2b3JpdGUnO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoYW5pbmcgbW9kZSB0byBmYXZvcml0ZScpO1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldFNpbXBsaWZpZWRGYXZvcml0ZWRSc3NPYmplY3RzKHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSByc3NJdGVtcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRyYXdlci5jbG9zZURyYXdlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93TXlOb3RlZCgpe1xuICAgICAgICBpZih0aGlzLm1vZGU9PSdub3RlZCcpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoYW5pbmcgbW9kZSB0byBub25lJyk7XG4gICAgICAgICAgICB0aGlzLm1vZGU9Jyc7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0U2ltcGxpZmllZFJzc09iamVjdHNGb3IodGhpcy5yc3NUeXBlLCAoY2hhbm5lbDogQ2hhbm5lbCwgaXRlbXM6IEl0ZW1bXSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMubW9kZSA9J25vdGVkJztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuaW5nIG1vZGUgdG8gbm90ZWQnKTtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRTaW1wbGlmaWVkTm90ZWRSc3NPYmplY3RzKHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSByc3NJdGVtcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRyYXdlci5jbG9zZURyYXdlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkxvYWRNb3JlSXRlbXNSZXF1ZXN0ZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnbGFvYWRpbmcgbW9yZSBoZXJlIC4uLicsIHRoaXMubW9kZSlcbiAgICAgICAgdmFyIGxpc3RWaWV3OlJhZExpc3RWaWV3ID0gYXJncy5vYmplY3Q7XG4gICAgICAgIHZhciBzdGFydGluZ0NudCA9IHRoaXMuX3Jzc0l0ZW1zLmxlbmd0aDtcblxuICAgICAgICBpZih0aGlzLm1vZGU9PSdub3RlZCcpe1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLm5leHRTaW1wbGlmaWVkTm90ZWRQYWdlKHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSByc3NJdGVtcztcbiAgICAgICAgICAgICAgICBsaXN0Vmlldy5ub3RpZnlMb2FkT25EZW1hbmRGaW5pc2hlZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNlIGlmKHRoaXMubW9kZT09J2Zhdm9yaXRlJyl7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UubmV4dFNpbXBsaWZpZWRGYXZvcml0ZVBhZ2UocnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IHJzc0l0ZW1zO1xuICAgICAgICAgICAgICAgIGxpc3RWaWV3Lm5vdGlmeUxvYWRPbkRlbWFuZEZpbmlzaGVkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2UgaWYodGhpcy5tb2RlPT0nc2VhcmNoJyl7XG4gICAgICAgICAgICAvL3ZhciBsaXN0VmlldzogUmFkTGlzdFZpZXcgPSBhcmdzLm9iamVjdDtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5uZXh0U2ltcGxpZmllZFNlYXJjaFBhZ2VGb3IodGhpcy5yc3NUeXBlLCB0aGlzLnNlbGVjdGVkQm9va3MsXG4gICAgICAgICAgICAgICAgW3RoaXMuc2VsZWN0ZWREYXRlT3B0aW9uLCB0aGlzLnNlbGVjdGVkRGF0ZTEsIHRoaXMuc2VsZWN0ZWREYXRlMl0sXG4gICAgICAgICAgICAgICAgaXRlbXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICBsaXN0Vmlldy5ub3RpZnlMb2FkT25EZW1hbmRGaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLm5leHRTaW1wbGlmaWVkUGFnZUZvcih0aGlzLnJzc1R5cGUsIGl0ZW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgICAgICAgICAgbGlzdFZpZXcubm90aWZ5TG9hZE9uRGVtYW5kRmluaXNoZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBhcmdzLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvblN3aXBlQ2VsbEZpbmlzaGVkKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb25Td2lwZUNlbGxGaW5pc2hlZCcpXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb25Td2lwZUNlbGxTdGFydGVkKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XG4gICAgICAgICAgICB2YXIgc3dpcGVMaW1pdHMgPSBhcmdzLmRhdGEuc3dpcGVMaW1pdHM7XG4gICAgICAgICAgICB2YXIgc3dpcGVWaWV3ID0gYXJnc1snb2JqZWN0J107XG4gICAgICAgICAgICB2YXIgcmlnaHRJdGVtID0gc3dpcGVWaWV3LmdldFZpZXdCeUlkPFZpZXc+KCdyaWdodC1zdGFjaycpO1xuICAgICAgICAgICAgdmFyIGxlZnRJdGVtID0gc3dpcGVWaWV3LmdldFZpZXdCeUlkPFZpZXc+KCdsZWZ0LXN0YWNrJyk7XG4gICAgICAgICAgICBzd2lwZUxpbWl0cy5yaWdodCA9IHJpZ2h0SXRlbS5nZXRNZWFzdXJlZFdpZHRoKCk7XG4gICAgICAgICAgICBzd2lwZUxpbWl0cy5sZWZ0ID0gbGVmdEl0ZW0uZ2V0TWVhc3VyZWRXaWR0aCgpO1xuICAgICAgICAgICAgc3dpcGVMaW1pdHMudGhyZXNob2xkID0gYXJnc1snbWFpblZpZXcnXS5nZXRNZWFzdXJlZFdpZHRoKCkgKiAwLjE7IC8vIDIwJSBvZiB3aG9sZSB3aWR0aFxuICAgICAgICB9XG5cblxuICAgICAgICBAVmlld0NoaWxkKFwibXlMaXN0Vmlld1wiKSBsaXN0Vmlld0NvbXBvbmVudDogUmFkTGlzdFZpZXdDb21wb25lbnQ7XG5cbiAgICAgICAgcHVibGljIG9uUmlnaHRTd2lwZUNsaWNrKGFyZ3MpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcuaXRlbXMuaW5kZXhPZihhcmdzLm9iamVjdC5iaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICBsZXQgdXVpZCA9IHRoaXMucnNzSXRlbXNbaW5kZXhdLnV1aWQ7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2Uuc2V0SXRlbSh0aGlzLnJzc0l0ZW1zW2luZGV4XSk7XG5cbiAgICAgICAgICAgIGlmKGFyZ3Mub2JqZWN0LmNsYXNzPT0ncGxheUdyaWRMYXlvdXQnKXtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gJ3Jzcy8nICsgdGhpcy5yc3NUeXBlICsgJy8nICsgaW5kZXg7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3VybF0pO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihhcmdzLm9iamVjdC5jbGFzcz09J2Zhdm9yaXRlR3JpZExheW91dCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5mYXZvcml0ZUl0ZW0odXVpZCwgKGZhdm9yaXRlZCk9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRmF2b3JpdGVkSXRlbXMoICgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJ1dHRvbiBjbGlja2VkOiBcIiArIGFyZ3Mub2JqZWN0LmlkICsgXCIgZm9yIGl0ZW0gd2l0aCBpbmRleDogXCIgKyBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3Q29tcG9uZW50Lmxpc3RWaWV3Lm5vdGlmeVN3aXBlVG9FeGVjdXRlRmluaXNoZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2UgaWYoYXJncy5vYmplY3QuY2xhc3M9PSdub3RlR3JpZExheW91dCcpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid3JpdGUgbm90ZSBmb3IgaXRcIik7XG4gICAgICAgICAgICAgICAgLy9ub3cgZ28gdG8gbm90ZSBwYWdlIGhlcmVcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJ3Jzc25vdGUnXSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCdXR0b24gY2xpY2tlZDogXCIgKyBhcmdzLm9iamVjdC5pZCArIFwiIGZvciBpdGVtIHdpdGggaW5kZXg6IFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihhcmdzLm9iamVjdC5jbGFzcz09J2VtYWlsR3JpZExheW91dCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5yZXRyaWV2ZVJzc0l0ZW1Gb3IoJ3F0JywgaW5kZXgsIGl0ZW0gPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgc2hhcmUgZm9yIGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAvL25vdyBnbyB0byBub3RlIHBhZ2UgaGVyZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2Uuc2hhcmUoJ2VtYWlsJywgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnV0dG9uIGNsaWNrZWQ6IFwiICsgYXJncy5vYmplY3QuaWQgKyBcIiBmb3IgaXRlbSB3aXRoIGluZGV4OiBcIiArIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF91cGRhdGVGYXZvcml0ZWRJdGVtcyhjYj1udWxsKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICdfdXBkYXRlRmF2b3JpdGVkSXRlbXMgJyk7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0QWxsTXlGYXZvcml0ZWRJdGVtU2ltcGxpZmllZCh0aGlzLnJzc1R5cGUsIGl0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fZmF2b3JpdGVkSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgICAgICBpZihjYikgY2IoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLnJzc1NlcnZpY2UuZ2V0QWxsTXlGYXZvcml0ZWRJdGVtU2ltcGxpZmllZCh0aGlzLnJzc1R5cGUsIGl0ZW1zPT57XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5fcnNzSXRlbXMuZm9yRWFjaChpdGVtPT57XG4gICAgICAgICAgICAvLyAgICAgICAgIHZhciBiRm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vICAgICAgICAgaXRlbXMuZm9yRWFjaChpPT57XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBpZihpdGVtLnV1aWQ9PWkudXVpZCl7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgYkZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyAgICAgICAgIGl0ZW1bJ2Zhdm9yaXRlZCddID0gYkZvdW5kO1xuICAgICAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAgICAgLy8gICAgIGlmKGNiKSBjYigpO1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF91cGRhdGVOb3RlZEl0ZW1zKGNiPW51bGwpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coICdfdXBkYXRlTm90ZWRJdGVtcyAnKTtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRBbGxNeU5vdGVkSXRlbVNpbXBsaWZpZWQodGhpcy5yc3NUeXBlLCBpdGVtcz0+e1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub3RlZCBpdGVtcyBhcmUgPT4nKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbm90ZWRJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgICAgIGlmKGNiKSBjYigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb25DZWxsU3dpcGluZygpe1xuXG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIG9uSXRlbVN3aXBpbmcoKXtcblxuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgc2hvd0Jvb2tzKCkge1xuICAgICAgICAgICAgdGhpcy5fY3JlYXRlVmlldyhSc3NCb29rTGlzdENvbXBvbmVudCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYlNlYXJjaGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlPSdzZWFyY2gnO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRCb29rcyA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpKTs7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2hvd0RhdGVQaWNrZXIoKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVWaWV3KFJzc0RhdGFQaWNrZXJDb21wb25lbnQpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0ZXBpY2tlciByZXN1bHQgaXMgJywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZU9wdGlvbiA9IHJlc3VsdFswXTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZTEgPSByZXN1bHRbMV07XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGUyID0gcmVzdWx0WzJdO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlU3RyaW5nID0gdGhpcy5zZWxlY3RlZERhdGVPcHRpb24gKycgJyt0aGlzLnNlbGVjdGVkRGF0ZTE7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3RlZERhdGVPcHRpb249PSdCZXR3ZWVuJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVN0cmluZyArPScgYW5kICcrdGhpcy5zZWxlY3RlZERhdGUyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcikpOztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2NyZWF0ZVZpZXcoY29tcDogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZjUmVmLFxuICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxTZXJ2aWNlLnNob3dNb2RhbChjb21wLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSkge1xuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgdHJ5IGFnYWluIVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzeXN0ZW1GaXhpbmcoKXtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsncnNzbm90ZSddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB0b2dnbGVDb250aW51ZVBsYXlpbmcoKXtcbiAgICAgICAgICAgIGlmKHRoaXMucGxheWluZ01vZGU9PVwic2luZ2xlXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWluZ01vZGU9XCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5aW5nTW9kZT1cInNpbmdsZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuIl19