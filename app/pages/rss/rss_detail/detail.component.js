"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var rss_service_1 = require("../../../shared/services/rss.service");
var entities_1 = require("../../../shared/entities/entities");
var app = require("tns-core-modules/application");
var router_2 = require("@angular/router");
//https://github.com/bradmartin/nativescript-audio
var timer = require("timer");
var nativescript_audio_1 = require("nativescript-audio");
var page_1 = require("ui/page");
// declare var AVAudioSession, AVAudioSessionCategoryPlayAndRecord, AVAudioSessionCategoryOptions;
// //Below is used for ios background running mode
// let setCategoryRes =
//     AVAudioSession.sharedInstance().setCategoryWithOptionsError( AVAudioSessionCategoryPlayAndRecord, AVAudioSessionCategoryOptions.DefaultToSpeaker);
var RssDetailComponent = (function () {
    function RssDetailComponent(router, activatedRoute, rssService, page) {
        var _this = this;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.rssService = rssService;
        this.page = page;
        this.loaded = false;
        this.pageLoaded = false;
        this.progressValue = 0;
        this._player = new nativescript_audio_1.TNSPlayer();
        this.currentTime_s = '0:00';
        this.platform = app.android ? 'android' : 'ios';
        this.showType = 'scripture';
        this.audioInitiated = false;
        this.showPlayBtn = 'hidden';
        this.customItem = new entities_1.CustomItem();
        var __this = this;
        this.page.on(page_1.Page.navigatingToEvent, function () {
            __this._updateRssItem();
        });
        setTimeout(function () {
            _this.activatedRoute.params
                .forEach(function (params) {
                _this.rssType = params['rssType'];
                _this.rssItemIndex = params['index'];
                console.log('indetail page: ', _this.rssType, _this.rssItemIndex);
                _this.rssService.retrieveRssItemFor(_this.rssType, _this.rssItemIndex, function (item) {
                    console.log('item is:');
                    _this.item = item;
                    //now, let's fetch custom note
                    _this.rssService.getNotedItemFor(item.uuid, function (customItems) {
                        if (customItems.length > 0) {
                            _this.customItem = customItems[0];
                        }
                    });
                    _this.pageLoaded = true;
                    _this._player.initFromUrl({
                        audioFile: _this.item.enclosure_link,
                        loop: false,
                        completeCallback: _this._trackComplete.bind(_this),
                        errorCallback: _this._trackError.bind(_this),
                        infoCallback: _this._infoCallback.bind(_this)
                    }).then(function () {
                        _this._player.getAudioTrackDuration().then(function (duration) {
                            _this._player.volume = 1;
                            // iOS: duration is in seconds
                            // Android: duration is in milliseconds
                            var duration_i = parseInt(duration);
                            if (_this.platform == 'android') {
                                duration_i = duration_i / 1000;
                            }
                            _this.totalLength = duration_i;
                            _this.totalLength_s = _this._convertTS(duration_i);
                            _this.loaded = true;
                            _this.showPlayBtn = 'visible';
                            _this.timerId = timer.setInterval(function () {
                                var currentTime = Math.floor(_this._player.currentTime);
                                if (_this.platform == 'android') {
                                    currentTime = currentTime / 1000;
                                }
                                console.log(currentTime + ' --- ' + _this.totalLength);
                                if (currentTime < _this.totalLength - 1) {
                                    console.log('pos 1 ');
                                    _this.currentTime = currentTime;
                                    _this.currentTime_s = _this._convertTS(currentTime);
                                    _this.progressValue = (_this.currentTime / _this.totalLength) * 100;
                                }
                                else {
                                    console.log(' pos 2 ');
                                    //timer.clearInterval(this.timerId);
                                    // this._player.seekTo(0);
                                    // this._player.pause();
                                    _this.btnTitle = _this.rssService.trans("Start", "开始");
                                }
                            }, 1000);
                            _this.audioInitiated = true;
                        });
                    });
                });
            });
        }, 0);
        this.btnTitle = this.rssService.trans("Start", "开始");
    }
    RssDetailComponent.prototype._updateRssItem = function () {
        var _this = this;
        //now, let's fetch custom note
        if (this.item) {
            this.rssService.getNotedItemFor(this.item.uuid, function (customItems) {
                if (customItems.length > 0) {
                    _this.customItem = customItems[0];
                }
            });
        }
    };
    RssDetailComponent.prototype.ngOnDestroy = function () {
        timer.clearInterval(this.timerId);
        if (this.audioInitiated) {
            console.log('distroy the player');
            this._player.dispose();
            this._player = null;
        }
    };
    RssDetailComponent.prototype.togglePlay = function () {
        if (this._player.isAudioPlaying()) {
            this._player.pause();
            this.btnTitle = this.rssService.trans("Resume", "重新开始");
        }
        else {
            this._player.play();
            this.btnTitle = this.rssService.trans("Pause", "暂停");
        }
    };
    RssDetailComponent.prototype.show = function (showType) {
        this.showType = showType;
    };
    RssDetailComponent.prototype.addNote = function () {
        console.log('adding note');
        // let index = this.listViewComponent.listView.items.indexOf(args.object.bindingContext);
        // let uuid = this.rssItems[index].uuid;
        this.rssService.setItem(this.item);
        this.router.navigate(['rssnote']);
    };
    RssDetailComponent.prototype._convertTS = function (s) {
        s = Math.floor(s);
        var resultM = Math.floor(s / 60);
        var resultS = s - resultM * 60;
        return resultM + ":" + (resultS > 10 ? '' : '0') + resultS;
    };
    RssDetailComponent.prototype.onSliderValueChange = function (args) {
        var slider = args.object;
        console.log('value changed -->');
        //this._player.seekTo( this.totalLength*slider.value/100 );
    };
    RssDetailComponent.prototype._infoCallback = function (args) {
    };
    RssDetailComponent.prototype._trackComplete = function (args) {
        var _this = this;
        console.log('reference back to player:', args.player);
        // iOS only: flag indicating if completed succesfully
        console.log('whether song play completed successfully:', args.flag);
        this._player.dispose().then(function () {
            _this._player.seekTo(0);
            _this._player.pause();
            _this.btnTitle = _this.rssService.trans("Start", "开始");
        });
    };
    RssDetailComponent.prototype._trackError = function (args) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);
        // Android only: extra detail on error
        console.log('extra info on the error:', args.extra);
    };
    RssDetailComponent.prototype.trans = function (en, zh) {
        return this.rssService.trans(en, zh);
    };
    RssDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['./detail.component.css', './detail.css'],
            templateUrl: './detail.component.html'
        }),
        __metadata("design:paramtypes", [router_2.Router,
            router_1.ActivatedRoute,
            rss_service_1.RssService,
            page_1.Page])
    ], RssDetailComponent);
    return RssDetailComponent;
}());
exports.RssDetailComponent = RssDetailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBd0M7QUFDeEMsMENBQWlEO0FBQ2pELG9FQUFnRTtBQUNoRSw4REFBaUY7QUFDakYsa0RBQW9EO0FBRXBELDBDQUF1QztBQUV2QyxrREFBa0Q7QUFDbEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRTdCLHlEQUErQztBQUUvQyxnQ0FBNkI7QUFJN0Isa0dBQWtHO0FBQ2xHLGtEQUFrRDtBQUNsRCx1QkFBdUI7QUFDdkIseUpBQXlKO0FBUXpKO0lBNEJJLDRCQUFvQixNQUFjLEVBQ3RCLGNBQThCLEVBQzlCLFVBQXNCLEVBQ3RCLElBQVM7UUFIckIsaUJBdUdLO1FBdkdlLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDdEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBSztRQUViLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBRXhCLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSw4QkFBUyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFFaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7UUFFNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJ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O1lBQ2pCLFdBQUk7T0EvQlosa0JBQWtCLENBMk4xQjtJQUFELHlCQUFDO0NBQUEsQUEzTkwsSUEyTks7QUEzTlEsZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1Jzc1NlcnZpY2V9IGZyb20gXCIuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvcnNzLnNlcnZpY2VcIjtcbmltcG9ydCB7UnNzLCBDaGFubmVsLCBJdGVtLCBDdXN0b21JdGVtfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvZW50aXRpZXMvZW50aXRpZXMnO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBTbGlkZXIgfSBmcm9tIFwidWkvc2xpZGVyXCI7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuXG4vL2h0dHBzOi8vZ2l0aHViLmNvbS9icmFkbWFydGluL25hdGl2ZXNjcmlwdC1hdWRpb1xudmFyIHRpbWVyID0gcmVxdWlyZShcInRpbWVyXCIpO1xuXG5pbXBvcnQgeyBUTlNQbGF5ZXIgfSBmcm9tICduYXRpdmVzY3JpcHQtYXVkaW8nO1xuaW1wb3J0IHsgUHJvZ3Jlc3MgfSBmcm9tIFwidWkvcHJvZ3Jlc3NcIjtcbmltcG9ydCB7UGFnZX0gZnJvbSAndWkvcGFnZSc7XG5cbmltcG9ydCAqIGFzIGh0bWxWaWV3TW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2h0bWwtdmlld1wiO1xuXG4vLyBkZWNsYXJlIHZhciBBVkF1ZGlvU2Vzc2lvbiwgQVZBdWRpb1Nlc3Npb25DYXRlZ29yeVBsYXlBbmRSZWNvcmQsIEFWQXVkaW9TZXNzaW9uQ2F0ZWdvcnlPcHRpb25zO1xuLy8gLy9CZWxvdyBpcyB1c2VkIGZvciBpb3MgYmFja2dyb3VuZCBydW5uaW5nIG1vZGVcbi8vIGxldCBzZXRDYXRlZ29yeVJlcyA9XG4vLyAgICAgQVZBdWRpb1Nlc3Npb24uc2hhcmVkSW5zdGFuY2UoKS5zZXRDYXRlZ29yeVdpdGhPcHRpb25zRXJyb3IoIEFWQXVkaW9TZXNzaW9uQ2F0ZWdvcnlQbGF5QW5kUmVjb3JkLCBBVkF1ZGlvU2Vzc2lvbkNhdGVnb3J5T3B0aW9ucy5EZWZhdWx0VG9TcGVha2VyKTtcblxuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHN0eWxlVXJsczogWycuL2RldGFpbC5jb21wb25lbnQuY3NzJywgJy4vZGV0YWlsLmNzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9kZXRhaWwuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIFJzc0RldGFpbENvbXBvbmVudCB7XG5cbiAgICByc3NUeXBlOiBzdHJpbmc7XG4gICAgcnNzSXRlbUluZGV4OiBudW1iZXI7XG4gICAgaXRlbTogSXRlbTtcbiAgICB0b3RhbExlbmd0aDogbnVtYmVyO1xuICAgIGN1cnJlbnRUaW1lOiBudW1iZXI7XG4gICAgdG90YWxMZW5ndGhfczogc3RyaW5nO1xuICAgIGN1cnJlbnRUaW1lX3M6IHN0cmluZztcblxuICAgIHBsYXRmb3JtOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9wbGF5ZXI6IFROU1BsYXllcjtcbiAgICBidG5UaXRsZTogc3RyaW5nO1xuICAgIGxvYWRlZDogYm9vbGVhbjtcbiAgICB0aW1lcklkO1xuICAgIGF1ZGlvSW5pdGlhdGVkOiBib29sZWFuO1xuICAgIHNob3dQbGF5QnRuOiBzdHJpbmc7XG4gICAgcHVibGljIHByb2dyZXNzVmFsdWU6IG51bWJlcjtcbiAgICBjdXN0b21JdGVtOkN1c3RvbUl0ZW07XG5cblxuICAgIHNob3dUeXBlOiBzdHJpbmc7XG5cbiAgICBsYXN0Q2hhbmdlVFM6bnVtYmVyO1xuXG4gICAgcGFnZUxvYWRlZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIHJzc1NlcnZpY2U6IFJzc1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcGFnZTpQYWdlKSB7XG5cbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBhZ2VMb2FkZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbHVlID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllciA9IG5ldyBUTlNQbGF5ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWVfcyA9ICcwOjAwJztcbiAgICAgICAgICAgIHRoaXMucGxhdGZvcm0gPSBhcHAuYW5kcm9pZCA/ICdhbmRyb2lkJyA6ICdpb3MnO1xuXG4gICAgICAgICAgICB0aGlzLnNob3dUeXBlID0gJ3NjcmlwdHVyZSc7XG5cbiAgICAgICAgICAgIHRoaXMuYXVkaW9Jbml0aWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2hvd1BsYXlCdG4gPSAnaGlkZGVuJztcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tSXRlbSA9IG5ldyBDdXN0b21JdGVtKCk7XG5cbiAgICAgICAgICAgIHZhciBfX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wYWdlLm9uKFBhZ2UubmF2aWdhdGluZ1RvRXZlbnQsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX190aGlzLl91cGRhdGVSc3NJdGVtKCk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5wYXJhbXNcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucnNzVHlwZSA9IHBhcmFtc1sncnNzVHlwZSddO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0l0ZW1JbmRleCA9IHBhcmFtc1snaW5kZXgnXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdpbmRldGFpbCBwYWdlOiAnLCB0aGlzLnJzc1R5cGUsIHRoaXMucnNzSXRlbUluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLnJldHJpZXZlUnNzSXRlbUZvcih0aGlzLnJzc1R5cGUsIHRoaXMucnNzSXRlbUluZGV4LCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdGVtIGlzOicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9ub3csIGxldCdzIGZldGNoIGN1c3RvbSBub3RlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0Tm90ZWRJdGVtRm9yKGl0ZW0udXVpZCwgY3VzdG9tSXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjdXN0b21JdGVtcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tSXRlbSA9IGN1c3RvbUl0ZW1zWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2VMb2FkZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wbGF5ZXIuaW5pdEZyb21Vcmwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1ZGlvRmlsZTogdGhpcy5pdGVtLmVuY2xvc3VyZV9saW5rLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2s6IHRoaXMuX3RyYWNrQ29tcGxldGUuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrOiB0aGlzLl90cmFja0Vycm9yLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb0NhbGxiYWNrOiB0aGlzLl9pbmZvQ2FsbGJhY2suYmluZCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLmdldEF1ZGlvVHJhY2tEdXJhdGlvbigpLnRoZW4oKGR1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci52b2x1bWUgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpT1M6IGR1cmF0aW9uIGlzIGluIHNlY29uZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQW5kcm9pZDogZHVyYXRpb24gaXMgaW4gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkdXJhdGlvbl9pOiBudW1iZXIgPSBwYXJzZUludChkdXJhdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGxhdGZvcm0gPT0gJ2FuZHJvaWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbl9pID0gZHVyYXRpb25faSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTGVuZ3RoID0gZHVyYXRpb25faTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aF9zID0gdGhpcy5fY29udmVydFRTKGR1cmF0aW9uX2kpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93UGxheUJ0biA9ICd2aXNpYmxlJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVySWQgPSB0aW1lci5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRpbWU6IG51bWJlciA9IE1hdGguZmxvb3IodGhpcy5fcGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYXRmb3JtID09ICdhbmRyb2lkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lID0gY3VycmVudFRpbWUgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudFRpbWUrJyAtLS0gJyt0aGlzLnRvdGFsTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGltZSA8IHRoaXMudG90YWxMZW5ndGgtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwb3MgMSAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGltZV9zID0gdGhpcy5fY29udmVydFRTKGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzVmFsdWUgPSAodGhpcy5jdXJyZW50VGltZSAvIHRoaXMudG90YWxMZW5ndGgpICogMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnIHBvcyAyICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGltZXIuY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX3BsYXllci5zZWVrVG8oMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5UaXRsZSA9IHRoaXMucnNzU2VydmljZS50cmFucyhcIlN0YXJ0XCIsIFwi5byA5aeLXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgMCk7XG5cblxuXG5cbiAgICAgICAgICAgIHRoaXMuYnRuVGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoXCJTdGFydFwiLCBcIuW8gOWni1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF91cGRhdGVSc3NJdGVtKCl7XG4gICAgICAgICAgICAvL25vdywgbGV0J3MgZmV0Y2ggY3VzdG9tIG5vdGVcbiAgICAgICAgICAgIGlmKHRoaXMuaXRlbSl7XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLmdldE5vdGVkSXRlbUZvcih0aGlzLml0ZW0udXVpZCwgY3VzdG9tSXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgaWYoY3VzdG9tSXRlbXMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXN0b21JdGVtID0gY3VzdG9tSXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICAgICAgdGltZXIuY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hdWRpb0luaXRpYXRlZCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rpc3Ryb3kgdGhlIHBsYXllcicpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlUGxheSgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wbGF5ZXIuaXNBdWRpb1BsYXlpbmcoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYnRuVGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoXCJSZXN1bWVcIiwgXCLph43mlrDlvIDlp4tcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5idG5UaXRsZSA9IHRoaXMucnNzU2VydmljZS50cmFucyhcIlBhdXNlXCIsIFwi5pqC5YGcXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvdyhzaG93VHlwZTogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dUeXBlID0gc2hvd1R5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBhZGROb3RlKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWRkaW5nIG5vdGUnKTtcblxuICAgICAgICAgICAgLy8gbGV0IGluZGV4ID0gdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5pdGVtcy5pbmRleE9mKGFyZ3Mub2JqZWN0LmJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgIC8vIGxldCB1dWlkID0gdGhpcy5yc3NJdGVtc1tpbmRleF0udXVpZDtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5zZXRJdGVtKHRoaXMuaXRlbSk7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJ3Jzc25vdGUnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBfY29udmVydFRTKHM6IG51bWJlcikge1xuICAgICAgICAgICAgcyA9IE1hdGguZmxvb3Iocyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TSA9IE1hdGguZmxvb3IocyAvIDYwKTtcbiAgICAgICAgICAgIHZhciByZXN1bHRTID0gcyAtIHJlc3VsdE0gKiA2MDtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRNICsgXCI6XCIgKyAocmVzdWx0UyA+IDEwID8gJycgOiAnMCcpICsgcmVzdWx0UztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvblNsaWRlclZhbHVlQ2hhbmdlKGFyZ3MpIHtcbiAgICAgICAgICAgIGxldCBzbGlkZXIgPSA8U2xpZGVyPmFyZ3Mub2JqZWN0O1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZhbHVlIGNoYW5nZWQgLS0+Jyk7XG4gICAgICAgICAgICAvL3RoaXMuX3BsYXllci5zZWVrVG8oIHRoaXMudG90YWxMZW5ndGgqc2xpZGVyLnZhbHVlLzEwMCApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfaW5mb0NhbGxiYWNrKGFyZ3M6IGFueSkge1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfdHJhY2tDb21wbGV0ZShhcmdzOiBhbnkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWZlcmVuY2UgYmFjayB0byBwbGF5ZXI6JywgYXJncy5wbGF5ZXIpO1xuICAgICAgICAgICAgLy8gaU9TIG9ubHk6IGZsYWcgaW5kaWNhdGluZyBpZiBjb21wbGV0ZWQgc3VjY2VzZnVsbHlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aGV0aGVyIHNvbmcgcGxheSBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5OicsIGFyZ3MuZmxhZyk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIuZGlzcG9zZSgpLnRoZW4oXG4gICAgICAgICAgICAgICAgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLnNlZWtUbygwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnRuVGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoXCJTdGFydFwiLCBcIuW8gOWni1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgX3RyYWNrRXJyb3IoYXJnczogYW55KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVmZXJlbmNlIGJhY2sgdG8gcGxheWVyOicsIGFyZ3MucGxheWVyKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGUgZXJyb3I6JywgYXJncy5lcnJvcik7XG5cbiAgICAgICAgICAgIC8vIEFuZHJvaWQgb25seTogZXh0cmEgZGV0YWlsIG9uIGVycm9yXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZXh0cmEgaW5mbyBvbiB0aGUgZXJyb3I6JywgYXJncy5leHRyYSk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFucyhlbiwgemgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucnNzU2VydmljZS50cmFucyhlbiwgemgpO1xuICAgICAgICB9XG5cblxuICAgIH1cbiJdfQ==