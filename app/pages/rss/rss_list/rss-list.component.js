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
        if (args.object.id == 'btnFavorite') {
            this.rssService.favoriteItem(uuid, function () {
                //update favorited items here
                _this._updateFavoritedItems();
            });
            console.log("Button clicked: " + args.object.id + " for item with index: " + index);
            this.listViewComponent.listView.notifySwipeToExecuteFinished();
        }
        else if (args.object.id == 'btnNote') {
            console.log("write note for it");
            //now go to note page here
            this.router.navigate(['rssnote']);
            console.log("Button clicked: " + args.object.id + " for item with index: " + index);
            this.listViewComponent.listView.notifySwipeToExecuteFinished();
        }
        else if (args.object.id == 'btnEmailShare') {
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
            console.log('favorited items are =>');
            console.log(JSON.stringify(items));
            _this._favoritedItems = items;
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
