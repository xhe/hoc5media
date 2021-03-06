import {Component} from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import {RssService} from "../../../shared/services/rss.service";
import {Rss, Channel, Item, CustomItem} from '../../../shared/entities/entities';
import * as app from "tns-core-modules/application";
import { Slider } from "ui/slider";
import {Router} from "@angular/router";

//https://github.com/bradmartin/nativescript-audio
var timer = require("timer");
import { TNSPlayer } from 'nativescript-audio';
import { Progress } from "ui/progress";
import {Page} from 'ui/page';

import * as htmlViewModule from "tns-core-modules/ui/html-view";

declare var AVAudioSession, AVAudioSessionCategoryPlayAndRecord, AVAudioSessionCategoryOptions;
// //Below is used for ios background running mode
let setCategoryRes =
    AVAudioSession.sharedInstance().setCategoryWithOptionsError( AVAudioSessionCategoryPlayAndRecord, AVAudioSessionCategoryOptions.DefaultToSpeaker);

import {DetailService} from './detail.service';

@Component({
    moduleId: module.id,
    styleUrls: ['./detail.component.css', './detail.css'],
    templateUrl: './detail.component.html'
})
export class RssDetailComponent {

    rssType: string;
    rssItemIndex: number;
    item: Item;
    totalLength: number;
    currentTime: number;
    totalLength_s: string;
    currentTime_s: string;

    platform: string;

    private _player: TNSPlayer;
    btnTitle: string;
    loaded: boolean;
    timerId;
    audioInitiated: boolean;
    showPlayBtn: string;
    public progressValue: number;
    customItem:CustomItem;


    showType: string;

    lastChangeTS:number;

    pageLoaded: boolean;
    parent: null;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private rssService: RssService,
        private page:Page,
        private detailService:DetailService) {

            this.loaded = false;
            this.pageLoaded = false;

            this.progressValue = 0;
            this._player = new TNSPlayer();
            this.currentTime_s = '0:00';
            this.platform = app.android ? 'android' : 'ios';

            this.showType = 'scripture';

            this.audioInitiated = false;
            this.showPlayBtn = 'hidden';
            this.customItem = new CustomItem();

            var __this = this;
            this.page.on(Page.navigatingToEvent, function(){
                __this._updateRssItem();
            });


            setTimeout(()=>{
                this.activatedRoute.params
                .forEach((params) => {
                    this.rssType = params['rssType'];
                    this.rssItemIndex = params['index'];
                    console.log( 'indetail page: ', this.rssType, this.rssItemIndex);
                    this.rssService.retrieveRssItemFor(this.rssType, this.rssItemIndex, item => {
                        this.item = item;
                        //now, let's fetch custom note
                        this.rssService.getNotedItemFor(item.uuid, customItems=>{
                            if(customItems.length>0){
                                this.customItem = customItems[0];
                            }
                        });
                        this.pageLoaded = true;
                        this._initPlayer();
                    });
                });
            }, 0);

        }

        _initPlayer(){
            this._player.initFromUrl({
                audioFile: this.item.enclosure_link,
                loop: false,
                completeCallback: this._trackComplete.bind(this),
                errorCallback: this._trackError.bind(this),
                infoCallback: this._infoCallback.bind(this)
            }).then(() => {
                this._player.getAudioTrackDuration().then((duration) => {
                    this._player.volume = 1;
                    // iOS: duration is in seconds
                    // Android: duration is in milliseconds
                    var duration_i: number = parseInt(duration);

                    if (this.platform == 'android') {
                        duration_i = duration_i / 1000;
                    }

                    this.totalLength = duration_i;
                    this.totalLength_s = this._convertTS(duration_i);

                    this.loaded = true;
                    this.showPlayBtn = 'visible';

                    this.detailService.onInterval(()=>{
                        var currentTime: number = 0;
                        if(this._player){
                            currentTime = Math.floor(this._player.currentTime);
                        }
                        if (this.platform == 'android') {
                            currentTime = currentTime / 1000;
                        }
                        this.currentTime = currentTime;
                        this.currentTime_s = this._convertTS(currentTime);
                        this.progressValue = (this.currentTime / this.totalLength) * 100;
                        console.log('curentTime', this.currentTime, 'progressValue', this.progressValue);
                    });
                    this.audioInitiated = true;
                });
            });
            this.btnTitle = this.rssService.trans("Start", "开始");
        }

        _updateRssItem(){
            //now, let's fetch custom note
            if(this.item){
                this.rssService.getNotedItemFor(this.item.uuid, customItems=>{
                    if(customItems.length>0){
                        this.customItem = customItems[0];
                    }
                });
            }
        }

        ngOnDestroy() {
            this.detailService.clearInterval();
            if (this.audioInitiated){
                console.log('distroy the player');
                this._player.dispose();
                this._player = null;
            }
        }

        public unLoaded(){
              console.log('player.component unloaded');
        }

        togglePlay() {
            if (this._player.isAudioPlaying()) {
                this._player.pause();
                this.btnTitle = this.rssService.trans("Resume", "重新开始");
            } else {
                this._player.play();
                this.btnTitle = this.rssService.trans("Pause", "暂停");
            }
        }

        show(showType: string) {
            this.showType = showType;
        }

        addNote(){
            console.log('adding note');

            // let index = this.listViewComponent.listView.items.indexOf(args.object.bindingContext);
            // let uuid = this.rssItems[index].uuid;
            this.rssService.setItem(this.item);
            this.router.navigate(['rssnote']);
        }

        _convertTS(s: number) {
            s = Math.floor(s);
            var resultM = Math.floor(s / 60);
            var resultS = s - resultM * 60;
            return resultM + ":" + (resultS > 10 ? '' : '0') + resultS;
        }

        public onSliderValueChange(args) {
            let slider = <Slider>args.object;
            let seekValue = slider.value;
            let dif = 1;
            let progressValue = this.progressValue;
            //android is in milliseconds
            if (this.platform == 'android') {
                seekValue = seekValue*1000;
                progressValue=progressValue*1000;
                dif = dif *1000;
            }
            if( Math.abs(seekValue-progressValue)>dif){
                this._player.seekTo( this.totalLength*seekValue/100 );
            }
        }


        private _infoCallback(args: any) {
        }

        private _trackComplete(args: any) {
            console.log('reference back to player:', args.player);
            // iOS only: flag indicating if completed succesfully
            console.log('whether song play completed successfully:', args.flag);
            this._player.dispose().then(
                ()=>{
                    this._initPlayer();
                }
            );
        }

        private _trackError(args: any) {
            console.log('reference back to player:', args.player);
            console.log('the error:', args.error);

            // Android only: extra detail on error
            console.log('extra info on the error:', args.extra);
        }

        trans(en, zh){
            return this.rssService.trans(en, zh);
        }


    }
