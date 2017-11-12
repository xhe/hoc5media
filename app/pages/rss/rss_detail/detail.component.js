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
var RssDetailComponent = (function () {
    function RssDetailComponent(router, activatedRoute, rssService, page) {
        var _this = this;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.rssService = rssService;
        this.page = page;
        this.loaded = false;
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
        this.activatedRoute.params
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
        if (this.audioInitiated) {
            console.log('distroy the player');
            this._player.dispose();
            this._player = null;
        }
        timer.clearInterval(this.timerId);
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
            styleUrls: ['pages/rss/rss_detail/detail.component.css', 'pages/rss/rss_detail/detail.css'],
            templateUrl: 'pages/rss/rss_detail/detail.component.html'
        }),
        __metadata("design:paramtypes", [router_2.Router,
            router_1.ActivatedRoute,
            rss_service_1.RssService,
            page_1.Page])
    ], RssDetailComponent);
    return RssDetailComponent;
}());
exports.RssDetailComponent = RssDetailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBd0M7QUFDeEMsMENBQWlEO0FBQ2pELG9FQUFnRTtBQUNoRSw4REFBaUY7QUFDakYsa0RBQW9EO0FBRXBELDBDQUF1QztBQUV2QyxrREFBa0Q7QUFDbEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRTdCLHlEQUErQztBQUUvQyxnQ0FBNkI7QUFRN0I7SUEyQkksNEJBQW9CLE1BQWMsRUFDdEIsY0FBOEIsRUFDOUIsVUFBc0IsRUFDdEIsSUFBUztRQUhyQixpQkE2Rks7UUE3RmUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUN0QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFLO1FBRWIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLDhCQUFTLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUVoRCxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUU1QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUkscUJBQVUsRUFBRSxDQUFDO1FBRW5DLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxX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QUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDckIsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUNKLENBQUM7SUFDTixDQUFDO0lBQ08sd0NBQVcsR0FBbkIsVUFBb0IsSUFBUztRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsc0NBQXNDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxrQ0FBSyxHQUFMLFVBQU0sRUFBRSxFQUFFLEVBQUU7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUEzTUksa0JBQWtCO1FBSjlCLGdCQUFTLENBQUM7WUFDUCxTQUFTLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxpQ0FBaUMsQ0FBQztZQUMzRixXQUFXLEVBQUUsNENBQTRDO1NBQzVELENBQUM7eUNBNEI4QixlQUFNO1lBQ04sdUJBQWM7WUFDbEIsd0JBQVU7WUFDakIsV0FBSTtPQTlCWixrQkFBa0IsQ0E4TTFCO0lBQUQseUJBQUM7Q0FBQSxBQTlNTCxJQThNSztBQTlNUSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7UnNzU2VydmljZX0gZnJvbSBcIi4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9yc3Muc2VydmljZVwiO1xuaW1wb3J0IHtSc3MsIENoYW5uZWwsIEl0ZW0sIEN1c3RvbUl0ZW19IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9lbnRpdGllcy9lbnRpdGllcyc7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IFNsaWRlciB9IGZyb20gXCJ1aS9zbGlkZXJcIjtcbmltcG9ydCB7Um91dGVyfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5cbi8vaHR0cHM6Ly9naXRodWIuY29tL2JyYWRtYXJ0aW4vbmF0aXZlc2NyaXB0LWF1ZGlvXG52YXIgdGltZXIgPSByZXF1aXJlKFwidGltZXJcIik7XG5cbmltcG9ydCB7IFROU1BsYXllciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hdWRpbyc7XG5pbXBvcnQgeyBQcm9ncmVzcyB9IGZyb20gXCJ1aS9wcm9ncmVzc1wiO1xuaW1wb3J0IHtQYWdlfSBmcm9tICd1aS9wYWdlJztcblxuaW1wb3J0ICogYXMgaHRtbFZpZXdNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvaHRtbC12aWV3XCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHN0eWxlVXJsczogWydwYWdlcy9yc3MvcnNzX2RldGFpbC9kZXRhaWwuY29tcG9uZW50LmNzcycsICdwYWdlcy9yc3MvcnNzX2RldGFpbC9kZXRhaWwuY3NzJ10sXG4gICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9yc3MvcnNzX2RldGFpbC9kZXRhaWwuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIFJzc0RldGFpbENvbXBvbmVudCB7XG5cbiAgICByc3NUeXBlOiBzdHJpbmc7XG4gICAgcnNzSXRlbUluZGV4OiBudW1iZXI7XG4gICAgaXRlbTogSXRlbTtcbiAgICB0b3RhbExlbmd0aDogbnVtYmVyO1xuICAgIGN1cnJlbnRUaW1lOiBudW1iZXI7XG4gICAgdG90YWxMZW5ndGhfczogc3RyaW5nO1xuICAgIGN1cnJlbnRUaW1lX3M6IHN0cmluZztcblxuICAgIHBsYXRmb3JtOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9wbGF5ZXI6IFROU1BsYXllcjtcbiAgICBidG5UaXRsZTogc3RyaW5nO1xuICAgIGxvYWRlZDogYm9vbGVhbjtcbiAgICB0aW1lcklkO1xuICAgIGF1ZGlvSW5pdGlhdGVkOiBib29sZWFuO1xuICAgIHNob3dQbGF5QnRuOiBzdHJpbmc7XG4gICAgcHVibGljIHByb2dyZXNzVmFsdWU6IG51bWJlcjtcbiAgICBjdXN0b21JdGVtOkN1c3RvbUl0ZW07XG5cblxuICAgIHNob3dUeXBlOiBzdHJpbmc7XG5cbiAgICBsYXN0Q2hhbmdlVFM6bnVtYmVyO1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSByc3NTZXJ2aWNlOiBSc3NTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHBhZ2U6UGFnZSkge1xuXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbHVlID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllciA9IG5ldyBUTlNQbGF5ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWVfcyA9ICcwOjAwJztcbiAgICAgICAgICAgIHRoaXMucGxhdGZvcm0gPSBhcHAuYW5kcm9pZCA/ICdhbmRyb2lkJyA6ICdpb3MnO1xuXG4gICAgICAgICAgICB0aGlzLnNob3dUeXBlID0gJ3NjcmlwdHVyZSc7XG5cbiAgICAgICAgICAgIHRoaXMuYXVkaW9Jbml0aWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2hvd1BsYXlCdG4gPSAnaGlkZGVuJztcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tSXRlbSA9IG5ldyBDdXN0b21JdGVtKCk7XG5cbiAgICAgICAgICAgIHZhciBfX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wYWdlLm9uKFBhZ2UubmF2aWdhdGluZ1RvRXZlbnQsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX190aGlzLl91cGRhdGVSc3NJdGVtKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5wYXJhbXNcbiAgICAgICAgICAgIC5mb3JFYWNoKChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJzc1R5cGUgPSBwYXJhbXNbJ3Jzc1R5cGUnXTtcbiAgICAgICAgICAgICAgICB0aGlzLnJzc0l0ZW1JbmRleCA9IHBhcmFtc1snaW5kZXgnXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2luZGV0YWlsIHBhZ2U6ICcsIHRoaXMucnNzVHlwZSwgdGhpcy5yc3NJdGVtSW5kZXgpO1xuICAgICAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5yZXRyaWV2ZVJzc0l0ZW1Gb3IodGhpcy5yc3NUeXBlLCB0aGlzLnJzc0l0ZW1JbmRleCwgaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdGVtIGlzOicpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW0gPSBpdGVtO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vbm93LCBsZXQncyBmZXRjaCBjdXN0b20gbm90ZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2UuZ2V0Tm90ZWRJdGVtRm9yKGl0ZW0udXVpZCwgY3VzdG9tSXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGN1c3RvbUl0ZW1zLmxlbmd0aD4wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbUl0ZW0gPSBjdXN0b21JdGVtc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLmluaXRGcm9tVXJsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1ZGlvRmlsZTogdGhpcy5pdGVtLmVuY2xvc3VyZV9saW5rLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrOiB0aGlzLl90cmFja0NvbXBsZXRlLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrOiB0aGlzLl90cmFja0Vycm9yLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvQ2FsbGJhY2s6IHRoaXMuX2luZm9DYWxsYmFjay5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLmdldEF1ZGlvVHJhY2tEdXJhdGlvbigpLnRoZW4oKGR1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaU9TOiBkdXJhdGlvbiBpcyBpbiBzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQW5kcm9pZDogZHVyYXRpb24gaXMgaW4gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGR1cmF0aW9uX2k6IG51bWJlciA9IHBhcnNlSW50KGR1cmF0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYXRmb3JtID09ICdhbmRyb2lkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbl9pID0gZHVyYXRpb25faSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IGR1cmF0aW9uX2k7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aF9zID0gdGhpcy5fY29udmVydFRTKGR1cmF0aW9uX2kpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1BsYXlCdG4gPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcklkID0gdGltZXIuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRpbWU6IG51bWJlciA9IE1hdGguZmxvb3IodGhpcy5fcGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGxhdGZvcm0gPT0gJ2FuZHJvaWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGltZSA9IGN1cnJlbnRUaW1lIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50VGltZSsnIC0tLSAnK3RoaXMudG90YWxMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgPCB0aGlzLnRvdGFsTGVuZ3RoLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwb3MgMSAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWVfcyA9IHRoaXMuX2NvbnZlcnRUUyhjdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzVmFsdWUgPSAodGhpcy5jdXJyZW50VGltZSAvIHRoaXMudG90YWxMZW5ndGgpICogMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyBwb3MgMiAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGltZXIuY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fcGxheWVyLnNlZWtUbygwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX3BsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5UaXRsZSA9IHRoaXMucnNzU2VydmljZS50cmFucyhcIlN0YXJ0XCIsIFwi5byA5aeLXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvSW5pdGlhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB0aGlzLmJ0blRpdGxlID0gdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKFwiU3RhcnRcIiwgXCLlvIDlp4tcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfdXBkYXRlUnNzSXRlbSgpe1xuICAgICAgICAgICAgLy9ub3csIGxldCdzIGZldGNoIGN1c3RvbSBub3RlXG4gICAgICAgICAgICBpZih0aGlzLml0ZW0pe1xuICAgICAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5nZXROb3RlZEl0ZW1Gb3IodGhpcy5pdGVtLnV1aWQsIGN1c3RvbUl0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKGN1c3RvbUl0ZW1zLmxlbmd0aD4wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tSXRlbSA9IGN1c3RvbUl0ZW1zWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1ZGlvSW5pdGlhdGVkKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGlzdHJveSB0aGUgcGxheWVyJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5ZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGltZXIuY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlUGxheSgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wbGF5ZXIuaXNBdWRpb1BsYXlpbmcoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYnRuVGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoXCJSZXN1bWVcIiwgXCLph43mlrDlvIDlp4tcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5idG5UaXRsZSA9IHRoaXMucnNzU2VydmljZS50cmFucyhcIlBhdXNlXCIsIFwi5pqC5YGcXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvdyhzaG93VHlwZTogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dUeXBlID0gc2hvd1R5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBhZGROb3RlKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWRkaW5nIG5vdGUnKTtcblxuICAgICAgICAgICAgLy8gbGV0IGluZGV4ID0gdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5pdGVtcy5pbmRleE9mKGFyZ3Mub2JqZWN0LmJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgIC8vIGxldCB1dWlkID0gdGhpcy5yc3NJdGVtc1tpbmRleF0udXVpZDtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5zZXRJdGVtKHRoaXMuaXRlbSk7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJ3Jzc25vdGUnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBfY29udmVydFRTKHM6IG51bWJlcikge1xuICAgICAgICAgICAgcyA9IE1hdGguZmxvb3Iocyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0TSA9IE1hdGguZmxvb3IocyAvIDYwKTtcbiAgICAgICAgICAgIHZhciByZXN1bHRTID0gcyAtIHJlc3VsdE0gKiA2MDtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRNICsgXCI6XCIgKyAocmVzdWx0UyA+IDEwID8gJycgOiAnMCcpICsgcmVzdWx0UztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvblNsaWRlclZhbHVlQ2hhbmdlKGFyZ3MpIHtcbiAgICAgICAgICAgIGxldCBzbGlkZXIgPSA8U2xpZGVyPmFyZ3Mub2JqZWN0O1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZhbHVlIGNoYW5nZWQgLS0+Jyk7XG4gICAgICAgICAgICAvL3RoaXMuX3BsYXllci5zZWVrVG8oIHRoaXMudG90YWxMZW5ndGgqc2xpZGVyLnZhbHVlLzEwMCApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfaW5mb0NhbGxiYWNrKGFyZ3M6IGFueSkge1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfdHJhY2tDb21wbGV0ZShhcmdzOiBhbnkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWZlcmVuY2UgYmFjayB0byBwbGF5ZXI6JywgYXJncy5wbGF5ZXIpO1xuICAgICAgICAgICAgLy8gaU9TIG9ubHk6IGZsYWcgaW5kaWNhdGluZyBpZiBjb21wbGV0ZWQgc3VjY2VzZnVsbHlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aGV0aGVyIHNvbmcgcGxheSBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5OicsIGFyZ3MuZmxhZyk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIuZGlzcG9zZSgpLnRoZW4oXG4gICAgICAgICAgICAgICAgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLnNlZWtUbygwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnRuVGl0bGUgPSB0aGlzLnJzc1NlcnZpY2UudHJhbnMoXCJTdGFydFwiLCBcIuW8gOWni1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgX3RyYWNrRXJyb3IoYXJnczogYW55KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVmZXJlbmNlIGJhY2sgdG8gcGxheWVyOicsIGFyZ3MucGxheWVyKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGUgZXJyb3I6JywgYXJncy5lcnJvcik7XG5cbiAgICAgICAgICAgIC8vIEFuZHJvaWQgb25seTogZXh0cmEgZGV0YWlsIG9uIGVycm9yXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZXh0cmEgaW5mbyBvbiB0aGUgZXJyb3I6JywgYXJncy5leHRyYSk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFucyhlbiwgemgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucnNzU2VydmljZS50cmFucyhlbiwgemgpO1xuICAgICAgICB9XG5cblxuICAgIH1cbiJdfQ==