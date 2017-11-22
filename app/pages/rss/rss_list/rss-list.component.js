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
                // this.rssItems[index]['favorited'] = favorited;
                // this.listViewComponent.listView.notifySwipeToExecuteFinished();
                //
                // //update favorited items here
                _this._updateFavoritedItems(function () {
                    console.log("Button clicked: " + args.object.id + " for item with index: " + index);
                    _this.listViewComponent.listView.notifySwipeToExecuteFinished();
                    //this.listViewComponent.listView.items[index].refresh();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnNzLWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQStHO0FBQy9HLG9FQUFnRTtBQUNoRSwwQ0FBK0M7QUFDL0MsOERBQXFFO0FBQ3JFLDBDQUF1QztBQUV2QyxrRUFBOEY7QUFJOUYsZ0VBQTRFO0FBRzVFLGtFQUF5RjtBQUV6Rix1RkFBaUY7QUFDakYsMkZBQXFGO0FBRXJGLGdDQUE2QjtBQU83QjtJQXlCSSwwQkFBb0IsWUFBZ0MsRUFDeEMsbUJBQXNDLEVBQ3RDLE1BQWMsRUFDZCxVQUFzQixFQUN0QixjQUE4QixFQUM5QixLQUF1QixFQUN2QixJQUFTO1FBTkQsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQ3hDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBbUI7UUFDdEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZCLFNBQUksR0FBSixJQUFJLENBQUs7UUFwQmIsZUFBVSxHQUFXLEtBQUssQ0FBQztRQU1uQyxlQUFVLEdBQVUsRUFBRSxDQUFDO1FBZ0JuQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxlQUFlLEdBQUMsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUMsRUFBRSxDQUFDO1FBRWIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQUks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SUFDaEQsQ0FBQztJQUVPLHNDQUFXLEdBQW5CLFVBQW9CLElBQVM7UUFDekIsSUFBTSxPQUFPLEdBQXVCO1lBQ2hDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLO1lBQzVCLFVBQVUsRUFBRSxLQUFLO1NBQ3BCLENBQUE7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTyxzQ0FBVyxHQUFuQixVQUFvQixLQUFVO1FBQzFCLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLHVDQUFZLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUE5UjhCO1FBQWxDLGdCQUFTLENBQUMsZ0NBQXNCLENBQUM7a0NBQXlCLGdDQUFzQjs2REFBQztJQXlLckQ7UUFBeEIsZ0JBQVMsQ0FBQyxZQUFZLENBQUM7a0NBQW9CLDhCQUFvQjsrREFBQztJQXZONUQsZ0JBQWdCO1FBTDVCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsU0FBUyxFQUFFLENBQUMsdUJBQXVCLEVBQUUsZ0JBQWdCLENBQUM7WUFDdEQsV0FBVyxFQUFFLDJCQUEyQjtTQUMzQyxDQUFDO3lDQTBCb0MsaUNBQWtCO1lBQ25CLHdCQUFpQjtZQUM5QixlQUFNO1lBQ0Ysd0JBQVU7WUFDTix1QkFBYztZQUN2Qix1QkFBZ0I7WUFDbEIsV0FBSTtPQS9CWixnQkFBZ0IsQ0E2VXhCO0lBQUQsdUJBQUM7Q0FBQSxBQTdVTCxJQTZVSztBQTdVUSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmLCBWaWV3Q29udGFpbmVyUmVmfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtSc3NTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Jzcy5zZXJ2aWNlXCI7XG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtSc3MsIENoYW5uZWwsIEl0ZW19IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9lbnRpdGllcy9lbnRpdGllcyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuXG5pbXBvcnQge1JhZFNpZGVEcmF3ZXJDb21wb25lbnQsIFNpZGVEcmF3ZXJUeXBlfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcbmltcG9ydCB7UmFkU2lkZURyYXdlcn0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyJztcblxuaW1wb3J0IHtSYWRMaXN0VmlldywgTGlzdFZpZXdFdmVudERhdGEsIExpc3RWaWV3TG9hZE9uRGVtYW5kTW9kZX0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9saXN0dmlldyc7XG5pbXBvcnQgeyBSYWRMaXN0Vmlld0NvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL2xpc3R2aWV3L2FuZ3VsYXJcIjtcblxuaW1wb3J0IHsgVmlldyB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvY29yZS92aWV3JztcbmltcG9ydCB7TW9kYWxEaWFsb2dTZXJ2aWNlLCBNb2RhbERpYWxvZ09wdGlvbnN9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcblxuaW1wb3J0IHtSc3NCb29rTGlzdENvbXBvbmVudH0gZnJvbSAnLi4vcnNzX2ZpbHRlcl9jb21wcy9yc3MtYm9vay1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQge1Jzc0RhdGFQaWNrZXJDb21wb25lbnR9IGZyb20gJy4uL3Jzc19maWx0ZXJfY29tcHMvcnNzLWRhdGUtcGlja2VyLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7UGFnZX0gZnJvbSAndWkvcGFnZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc3R5bGVVcmxzOiBbJy4vcnNzLWxpc3QtY29tbW9uLmNzcycsICcuL3Jzcy1saXN0LmNzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yc3MtbGlzdC5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgUnNzTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcnNzVHlwZTogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgbG9hZGluZzogYm9vbGVhbjtcbiAgICBjaGFubmVsOiBDaGFubmVsO1xuXG4gICAgX3Jzc0l0ZW1zOmFueTtcbiAgICBfZmF2b3JpdGVkSXRlbXM6YW55O1xuICAgIF9ub3RlZEl0ZW1zOmFueTtcblxuICAgIHNlbGVjdGVkQm9va3M6IFN0cmluZ1tdO1xuICAgIHByaXZhdGUgYlNlYXJjaGluZzpib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBzZWFyY2hQZXJpb2Q6YW55O1xuXG4gICAgc2VsZWN0ZWREYXRlT3B0aW9uOnN0cmluZztcbiAgICBzZWxlY3RlZERhdGUxOnN0cmluZztcbiAgICBzZWxlY3RlZERhdGUyOnN0cmluZztcbiAgICBkYXRlU3RyaW5nOnN0cmluZyA9IFwiXCI7XG5cbiAgICBtb2RlOnN0cmluZztcblxuICAgIHB1YmxpYyBnZXQgcnNzSXRlbXMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jzc0l0ZW1zO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdGlvblJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgcnNzU2VydmljZTogUnNzU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgIHByaXZhdGUgcGFnZTpQYWdlXG4gICAgKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNoYW5uZWwgPSBuZXcgQ2hhbm5lbCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkQm9va3MgPSBbXTtcbiAgICAgICAgdGhpcy5fZmF2b3JpdGVkSXRlbXM9W107XG4gICAgICAgIHRoaXMuX25vdGVkSXRlbXMgPSBbXTtcbiAgICAgICAgdGhpcy5tb2RlPVwiXCI7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5wYWdlLm9uKFBhZ2UubmF2aWdhdGluZ1RvRXZlbnQsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy5fdXBkYXRlTm90ZWRJdGVtcygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBAVmlld0NoaWxkKFJhZFNpZGVEcmF3ZXJDb21wb25lbnQpIHB1YmxpYyBkcmF3ZXJDb21wb25lbnQ6IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQ7XG4gICAgcHJpdmF0ZSBkcmF3ZXI6IFJhZFNpZGVEcmF3ZXI7XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuZHJhd2VyID0gdGhpcy5kcmF3ZXJDb21wb25lbnQuc2lkZURyYXdlcjtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0aW9uUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb3BlbkRyYXdlcigpIHtcbiAgICAgICAgdGhpcy5kcmF3ZXIuc2hvd0RyYXdlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkFwcGx5RmlsdGVyKCl7XG4gICAgICAgIHRoaXMucnNzU2VydmljZS5zZWFyY2hTaW1wbGlmaWVkUnNzT2JqZWN0c0Zvcih0aGlzLnJzc1R5cGUsXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkQm9va3MsW3RoaXMuc2VsZWN0ZWREYXRlT3B0aW9uLCB0aGlzLnNlbGVjdGVkRGF0ZTEsIHRoaXMuc2VsZWN0ZWREYXRlMl0sIGl0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5vbkNhbmNlbEZpbHRlcigpO1xuICAgIH1cbiAgICBwdWJsaWMgb25DYW5jZWxGaWx0ZXIoKXtcbiAgICAgICAgdGhpcy5kcmF3ZXIuY2xvc2VEcmF3ZXIoKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5wYXJhbXMuZm9yRWFjaCgocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBhcmFtc1sndHlwZSddKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAncXQnOiB0aGlzLnRpdGxlID0gIHRoaXMucnNzU2VydmljZS50cmFucygnUVQgLSBRdWlldCBUaW1lJywn5q+P5pel54G15L+uJykgOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd3ZWVrbHlfemgnOiB0aGlzLnRpdGxlID0gdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKCdDaGluZXNlIFNlcm1vbnMnLCfkuK3mloforrLpgZMnKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2Vla2x5X2VuJzogdGhpcy50aXRsZSA9IHRoaXMucnNzU2VydmljZS50cmFucygnRW5nbGlzaCBTZXJtb25zJywn6Iux5paH6K6y6YGTJykgOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzaXN0ZXInOiB0aGlzLnRpdGxlID0gdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKCdTaXN0ZXIgV29yc2hpcHMnLCflp5Dlprnlm6LlpZEnKSA7IGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yc3NUeXBlID0gcGFyYW1zWyd0eXBlJ107XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG5cbiAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldFNpbXBsaWZpZWRSc3NPYmplY3RzRm9yKHRoaXMucnNzVHlwZSwgKGNoYW5uZWw6IENoYW5uZWwsIGl0ZW1zOiBJdGVtW10pID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICAgICAgICB0aGlzLl9yc3NJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUZhdm9yaXRlZEl0ZW1zKCgpPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTm90ZWRJdGVtcygpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rpb25SZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIHRyYW5zKGVuLCB6aCl7XG4gICAgICAgIHJldHVybiB0aGlzLnJzc1NlcnZpY2UudHJhbnMoZW4sIHpoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmF2b3JpdGVkKGl0ZW06SXRlbSl7XG4gICAgICAgIGxldCBmYXZvcml0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mYXZvcml0ZWRJdGVtcy5mb3JFYWNoKGZhdm9yaXRlZEl0ZW09PntcbiAgICAgICAgICAgIGlmKGZhdm9yaXRlZEl0ZW0udXVpZD09PWl0ZW0udXVpZCl7XG4gICAgICAgICAgICAgICAgZmF2b3JpdGVkPXRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmF2b3JpdGVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3RlZChpdGVtOkl0ZW0pe1xuICAgICAgICBsZXQgbm90ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9ub3RlZEl0ZW1zLmZvckVhY2gobm90ZWRJdGVtPT57XG4gICAgICAgICAgICBpZihub3RlZEl0ZW0udXVpZD09PWl0ZW0udXVpZCl7XG4gICAgICAgICAgICAgICAgbm90ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5vdGVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkl0ZW1UYXAoYXJncykge1xuICAgICAgICB2YXIgdXJsID0gJ3Jzcy8nICsgdGhpcy5yc3NUeXBlICsgJy8nICsgYXJncy5pbmRleDtcbiAgICAgICAgY29uc29sZS5sb2coJ2dvaW5nIHRvICcsIHVybCk7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt1cmxdKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvd015RmF2b3JpdGUoKXtcblxuICAgICAgICBpZih0aGlzLm1vZGU9PSdmYXZvcml0ZScpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoYW5pbmcgbW9kZSB0byBub25lJyk7XG4gICAgICAgICAgICB0aGlzLm1vZGU9Jyc7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0U2ltcGxpZmllZFJzc09iamVjdHNGb3IodGhpcy5yc3NUeXBlLCAoY2hhbm5lbDogQ2hhbm5lbCwgaXRlbXM6IEl0ZW1bXSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMubW9kZSA9J2Zhdm9yaXRlJztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuaW5nIG1vZGUgdG8gZmF2b3JpdGUnKTtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXRTaW1wbGlmaWVkRmF2b3JpdGVkUnNzT2JqZWN0cyhyc3NJdGVtcz0+e1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gcnNzSXRlbXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kcmF3ZXIuY2xvc2VEcmF3ZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvd015Tm90ZWQoKXtcbiAgICAgICAgaWYodGhpcy5tb2RlPT0nbm90ZWQnKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuaW5nIG1vZGUgdG8gbm9uZScpO1xuICAgICAgICAgICAgdGhpcy5tb2RlPScnO1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldFNpbXBsaWZpZWRSc3NPYmplY3RzRm9yKHRoaXMucnNzVHlwZSwgKGNoYW5uZWw6IENoYW5uZWwsIGl0ZW1zOiBJdGVtW10pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLm1vZGUgPSdub3RlZCc7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmluZyBtb2RlIHRvIG5vdGVkJyk7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0U2ltcGxpZmllZE5vdGVkUnNzT2JqZWN0cyhyc3NJdGVtcz0+e1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gcnNzSXRlbXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kcmF3ZXIuY2xvc2VEcmF3ZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Mb2FkTW9yZUl0ZW1zUmVxdWVzdGVkKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2xhb2FkaW5nIG1vcmUgaGVyZSAuLi4nLCB0aGlzLm1vZGUpXG4gICAgICAgIHZhciBsaXN0VmlldzpSYWRMaXN0VmlldyA9IGFyZ3Mub2JqZWN0O1xuICAgICAgICB2YXIgc3RhcnRpbmdDbnQgPSB0aGlzLl9yc3NJdGVtcy5sZW5ndGg7XG5cbiAgICAgICAgaWYodGhpcy5tb2RlPT0nbm90ZWQnKXtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5uZXh0U2ltcGxpZmllZE5vdGVkUGFnZShyc3NJdGVtcz0+e1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gcnNzSXRlbXM7XG4gICAgICAgICAgICAgICAgbGlzdFZpZXcubm90aWZ5TG9hZE9uRGVtYW5kRmluaXNoZWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZSBpZih0aGlzLm1vZGU9PSdmYXZvcml0ZScpe1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLm5leHRTaW1wbGlmaWVkRmF2b3JpdGVQYWdlKHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSByc3NJdGVtcztcbiAgICAgICAgICAgICAgICBsaXN0Vmlldy5ub3RpZnlMb2FkT25EZW1hbmRGaW5pc2hlZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNlIGlmKHRoaXMubW9kZT09J3NlYXJjaCcpe1xuICAgICAgICAgICAgLy92YXIgbGlzdFZpZXc6IFJhZExpc3RWaWV3ID0gYXJncy5vYmplY3Q7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UubmV4dFNpbXBsaWZpZWRTZWFyY2hQYWdlRm9yKHRoaXMucnNzVHlwZSwgdGhpcy5zZWxlY3RlZEJvb2tzLFxuICAgICAgICAgICAgICAgIFt0aGlzLnNlbGVjdGVkRGF0ZU9wdGlvbiwgdGhpcy5zZWxlY3RlZERhdGUxLCB0aGlzLnNlbGVjdGVkRGF0ZTJdLFxuICAgICAgICAgICAgICAgIGl0ZW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcnNzSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgICAgICAgICAgbGlzdFZpZXcubm90aWZ5TG9hZE9uRGVtYW5kRmluaXNoZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5uZXh0U2ltcGxpZmllZFBhZ2VGb3IodGhpcy5yc3NUeXBlLCBpdGVtcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jzc0l0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RWaWV3Lm5vdGlmeUxvYWRPbkRlbWFuZEZpbmlzaGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgYXJncy5yZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb25Td2lwZUNlbGxGaW5pc2hlZCgpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ29uU3dpcGVDZWxsRmluaXNoZWQnKVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG9uU3dpcGVDZWxsU3RhcnRlZChhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xuICAgICAgICAgICAgdmFyIHN3aXBlTGltaXRzID0gYXJncy5kYXRhLnN3aXBlTGltaXRzO1xuICAgICAgICAgICAgdmFyIHN3aXBlVmlldyA9IGFyZ3NbJ29iamVjdCddO1xuICAgICAgICAgICAgdmFyIHJpZ2h0SXRlbSA9IHN3aXBlVmlldy5nZXRWaWV3QnlJZDxWaWV3PigncmlnaHQtc3RhY2snKTtcbiAgICAgICAgICAgIHN3aXBlTGltaXRzLnJpZ2h0ID0gcmlnaHRJdGVtLmdldE1lYXN1cmVkV2lkdGgoKTtcbiAgICAgICAgICAgIHN3aXBlTGltaXRzLmxlZnQgPSAwO1xuICAgICAgICAgICAgc3dpcGVMaW1pdHMudGhyZXNob2xkID0gYXJnc1snbWFpblZpZXcnXS5nZXRNZWFzdXJlZFdpZHRoKCkgKiAwLjI7IC8vIDIwJSBvZiB3aG9sZSB3aWR0aFxuICAgICAgICB9XG5cblxuICAgICAgICBAVmlld0NoaWxkKFwibXlMaXN0Vmlld1wiKSBsaXN0Vmlld0NvbXBvbmVudDogUmFkTGlzdFZpZXdDb21wb25lbnQ7XG5cbiAgICAgICAgcHVibGljIG9uUmlnaHRTd2lwZUNsaWNrKGFyZ3MpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcuaXRlbXMuaW5kZXhPZihhcmdzLm9iamVjdC5iaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICBsZXQgdXVpZCA9IHRoaXMucnNzSXRlbXNbaW5kZXhdLnV1aWQ7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2Uuc2V0SXRlbSh0aGlzLnJzc0l0ZW1zW2luZGV4XSk7XG5cbiAgICAgICAgICAgIGlmKGFyZ3Mub2JqZWN0LmNsYXNzPT0nZmF2b3JpdGVHcmlkTGF5b3V0Jyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmZhdm9yaXRlSXRlbSh1dWlkLCAoZmF2b3JpdGVkKT0+e1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnJzc0l0ZW1zW2luZGV4XVsnZmF2b3JpdGVkJ10gPSBmYXZvcml0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAvLyAvL3VwZGF0ZSBmYXZvcml0ZWQgaXRlbXMgaGVyZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVGYXZvcml0ZWRJdGVtcyggKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnV0dG9uIGNsaWNrZWQ6IFwiICsgYXJncy5vYmplY3QuaWQgKyBcIiBmb3IgaXRlbSB3aXRoIGluZGV4OiBcIiArIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLmxpc3RWaWV3Q29tcG9uZW50Lmxpc3RWaWV3Lml0ZW1zW2luZGV4XS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKGFyZ3Mub2JqZWN0LmNsYXNzPT0nbm90ZUdyaWRMYXlvdXQnKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIndyaXRlIG5vdGUgZm9yIGl0XCIpO1xuICAgICAgICAgICAgICAgIC8vbm93IGdvIHRvIG5vdGUgcGFnZSBoZXJlXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWydyc3Nub3RlJ10pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnV0dG9uIGNsaWNrZWQ6IFwiICsgYXJncy5vYmplY3QuaWQgKyBcIiBmb3IgaXRlbSB3aXRoIGluZGV4OiBcIiArIGluZGV4KTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3Q29tcG9uZW50Lmxpc3RWaWV3Lm5vdGlmeVN3aXBlVG9FeGVjdXRlRmluaXNoZWQoKTtcblxuICAgICAgICAgICAgfWVsc2UgaWYoYXJncy5vYmplY3QuY2xhc3M9PSdlbWFpbEdyaWRMYXlvdXQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UucmV0cmlldmVSc3NJdGVtRm9yKCdxdCcsIGluZGV4LCBpdGVtID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIHNoYXJlIGZvciBpdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy9ub3cgZ28gdG8gbm90ZSBwYWdlIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLnNoYXJlKCdlbWFpbCcsIGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJ1dHRvbiBjbGlja2VkOiBcIiArIGFyZ3Mub2JqZWN0LmlkICsgXCIgZm9yIGl0ZW0gd2l0aCBpbmRleDogXCIgKyBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfdXBkYXRlRmF2b3JpdGVkSXRlbXMoY2I9bnVsbCl7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnX3VwZGF0ZUZhdm9yaXRlZEl0ZW1zICcpO1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldEFsbE15RmF2b3JpdGVkSXRlbVNpbXBsaWZpZWQodGhpcy5yc3NUeXBlLCBpdGVtcz0+e1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zhdm9yaXRlZEl0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICAgICAgaWYoY2IpIGNiKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gdGhpcy5yc3NTZXJ2aWNlLmdldEFsbE15RmF2b3JpdGVkSXRlbVNpbXBsaWZpZWQodGhpcy5yc3NUeXBlLCBpdGVtcz0+e1xuICAgICAgICAgICAgLy8gICAgIHRoaXMuX3Jzc0l0ZW1zLmZvckVhY2goaXRlbT0+e1xuICAgICAgICAgICAgLy8gICAgICAgICB2YXIgYkZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAvLyAgICAgICAgIGl0ZW1zLmZvckVhY2goaT0+e1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYoaXRlbS51dWlkPT1pLnV1aWQpe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gICAgICAgICBpdGVtWydmYXZvcml0ZWQnXSA9IGJGb3VuZDtcbiAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgICAgIC8vICAgICBpZihjYikgY2IoKTtcbiAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfdXBkYXRlTm90ZWRJdGVtcyhjYj1udWxsKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnX3VwZGF0ZU5vdGVkSXRlbXMgJyk7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0QWxsTXlOb3RlZEl0ZW1TaW1wbGlmaWVkKHRoaXMucnNzVHlwZSwgaXRlbXM9PntcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm90ZWQgaXRlbXMgYXJlID0+Jyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX25vdGVkSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgICAgICBpZihjYikgY2IoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG9uQ2VsbFN3aXBpbmcoKXtcblxuICAgICAgICB9XG4gICAgICAgIHB1YmxpYyBvbkl0ZW1Td2lwaW5nKCl7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIHNob3dCb29rcygpIHtcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVZpZXcoUnNzQm9va0xpc3RDb21wb25lbnQpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJTZWFyY2hpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZT0nc2VhcmNoJztcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQm9va3MgPSByZXN1bHQ7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB0aGlzLmhhbmRsZUVycm9yKGVycm9yKSk7O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNob3dEYXRlUGlja2VyKCkge1xuICAgICAgICAgICAgdGhpcy5fY3JlYXRlVmlldyhSc3NEYXRhUGlja2VyQ29tcG9uZW50KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGVwaWNrZXIgcmVzdWx0IGlzICcsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVPcHRpb24gPSByZXN1bHRbMF07XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGUxID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlMiA9IHJlc3VsdFsyXTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVN0cmluZyA9IHRoaXMuc2VsZWN0ZWREYXRlT3B0aW9uICsnICcrdGhpcy5zZWxlY3RlZERhdGUxO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWREYXRlT3B0aW9uPT0nQmV0d2Vlbicpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVTdHJpbmcgKz0nIGFuZCAnK3RoaXMuc2VsZWN0ZWREYXRlMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpKTs7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jcmVhdGVWaWV3KGNvbXA6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zOiBNb2RhbERpYWxvZ09wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdmlld0NvbnRhaW5lclJlZjogdGhpcy52Y1JlZixcbiAgICAgICAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGFsU2VydmljZS5zaG93TW9kYWwoY29tcCwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHRyeSBhZ2FpbiFcIik7XG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3lzdGVtRml4aW5nKCl7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJ3Jzc25vdGUnXSk7XG4gICAgICAgIH1cbiAgICB9XG4iXX0=