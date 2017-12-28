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
// //Below is used for ios background running mode
// let setCategoryRes =
//     AVAudioSession.sharedInstance().setCategoryWithOptionsError( AVAudioSessionCategoryPlayAndRecord, AVAudioSessionCategoryOptions.DefaultToSpeaker);
var detail_service_1 = require("./detail.service");
var RssDetailComponent = (function () {
    function RssDetailComponent(router, activatedRoute, rssService, page, detailService) {
        var _this = this;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.rssService = rssService;
        this.page = page;
        this.detailService = detailService;
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
                    _this.item = item;
                    //now, let's fetch custom note
                    _this.rssService.getNotedItemFor(item.uuid, function (customItems) {
                        if (customItems.length > 0) {
                            _this.customItem = customItems[0];
                        }
                    });
                    _this.pageLoaded = true;
                    _this._initPlayer();
                });
            });
        }, 0);
    }
    RssDetailComponent.prototype._initPlayer = function () {
        var _this = this;
        this._player.initFromUrl({
            audioFile: this.item.enclosure_link,
            loop: false,
            completeCallback: this._trackComplete.bind(this),
            errorCallback: this._trackError.bind(this),
            infoCallback: this._infoCallback.bind(this)
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
                _this.detailService.onInterval(function () {
                    var currentTime = 0;
                    if (_this._player) {
                        currentTime = Math.floor(_this._player.currentTime);
                    }
                    if (_this.platform == 'android') {
                        currentTime = currentTime / 1000;
                    }
                    _this.currentTime = currentTime;
                    _this.currentTime_s = _this._convertTS(currentTime);
                    _this.progressValue = (_this.currentTime / _this.totalLength) * 100;
                    console.log('curentTime', _this.currentTime, 'progressValue', _this.progressValue);
                });
                _this.audioInitiated = true;
            });
        });
        this.btnTitle = this.rssService.trans("Start", "开始");
    };
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
        this.detailService.clearInterval();
        if (this.audioInitiated) {
            console.log('distroy the player');
            this._player.dispose();
            this._player = null;
        }
    };
    RssDetailComponent.prototype.unLoaded = function () {
        console.log('player.component unloaded');
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
        var seekValue = slider.value;
        var dif = 1;
        var progressValue = this.progressValue;
        //android is in milliseconds
        if (this.platform == 'android') {
            seekValue = seekValue * 1000;
            progressValue = progressValue * 1000;
            dif = dif * 1000;
        }
        if (Math.abs(seekValue - progressValue) > dif) {
            this._player.seekTo(this.totalLength * seekValue / 100);
        }
    };
    RssDetailComponent.prototype._infoCallback = function (args) {
    };
    RssDetailComponent.prototype._trackComplete = function (args) {
        var _this = this;
        console.log('reference back to player:', args.player);
        // iOS only: flag indicating if completed succesfully
        console.log('whether song play completed successfully:', args.flag);
        this._player.dispose().then(function () {
            _this._initPlayer();
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
            page_1.Page,
            detail_service_1.DetailService])
    ], RssDetailComponent);
    return RssDetailComponent;
}());
exports.RssDetailComponent = RssDetailComponent;
