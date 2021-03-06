import {Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ViewContainerRef} from "@angular/core";
import {RssService} from "../../../shared/services/rss.service";
import {ActivatedRoute} from '@angular/router';
import {Rss, Channel, Item} from '../../../shared/entities/entities';
import {Router} from "@angular/router";

import {RadSideDrawerComponent, SideDrawerType} from "nativescript-pro-ui/sidedrawer/angular";
import {RadSideDrawer} from 'nativescript-pro-ui/sidedrawer';

import {RadListView, ListViewEventData, ListViewLoadOnDemandMode} from 'nativescript-pro-ui/listview';
import { RadListViewComponent } from "nativescript-pro-ui/listview/angular";

import { View } from 'tns-core-modules/ui/core/view';
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/modal-dialog";

import {RssBookListComponent} from '../rss_filter_comps/rss-book-list.component';
import {RssDataPickerComponent} from '../rss_filter_comps/rss-date-picker.component';

import {Page} from 'ui/page';

@Component({
    moduleId: module.id,
    styleUrls: ['./rss-list-common.css', './rss-list.css'],
    templateUrl: './rss-list.component.html'
})
export class RssListComponent implements OnInit, AfterViewInit {
    rssType: string;
    title: string;
    loading: boolean;
    channel: Channel;

    _rssItems:any;
    _favoritedItems:any;
    _notedItems:any;

    selectedBooks: String[];
    private bSearching:boolean = false;
    private searchPeriod:any;

    selectedDateOption:string;
    selectedDate1:string;
    selectedDate2:string;
    dateString:string = "";

    mode:string;
    playingMode:string;

    public get rssItems(){
        return this._rssItems;
    }

    constructor(private modalService: ModalDialogService,
        private _changeDetectionRef: ChangeDetectorRef,
        private router: Router,
        private rssService: RssService,
        private activatedRoute: ActivatedRoute,
        private vcRef: ViewContainerRef,
        private page:Page
    ) {
        this.loading = false;
        this.channel = new Channel();
        this.selectedBooks = [];
        this._favoritedItems=[];
        this._notedItems = [];
        this.mode="";
        this.mode="single";

        var _this = this;
        this.page.on(Page.navigatingToEvent, function(){
            _this._updateNotedItems();
        });
    }

    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onApplyFilter(){
        this.rssService.searchSimplifiedRssObjectsFor(this.rssType,
            this.selectedBooks,[this.selectedDateOption, this.selectedDate1, this.selectedDate2], this.playingMode, items=>{
                this._rssItems = items;
            }
        );
        this.onCancelFilter();
    }
    public onCancelFilter(){
        this.drawer.closeDrawer();
    }

    ngOnInit() {
        this.activatedRoute.params.forEach((params) => {
            switch (params['type']) {
                case 'qt': this.title =  this.rssService.trans('QT - Quiet Time','每日灵修') ; break;
                case 'weekly_zh': this.title = this.rssService.trans('Chinese Sermons','中文讲道'); break;
                case 'weekly_en': this.title = this.rssService.trans('English Sermons','英文讲道') ; break;
                case 'sister': this.title = this.rssService.trans('Sister Worships','姐妹团契') ; break;
            }
            this.rssType = params['type'];
        });
        this.loading = true;


        this.rssService.getSimplifiedRssObjectsFor(this.rssType, (channel: Channel, items: Item[]) => {
            this.channel = channel;
            this._rssItems = items;
            this.loading = false;

            this._updateFavoritedItems(()=>{
                this._updateNotedItems();
            });


        });

        this._changeDetectionRef.detectChanges();
    }

    trans(en, zh){
        return this.rssService.trans(en, zh);
    }

    public favorited(item:Item){
        let favorited:boolean = false;
        this._favoritedItems.forEach(favoritedItem=>{
            if(favoritedItem.uuid===item.uuid){
                favorited=true;
            }
        });
        return favorited;
    }

    public noted(item:Item){
        let noted:boolean = false;
        this._notedItems.forEach(notedItem=>{
            if(notedItem.uuid===item.uuid){
                noted = true;
            }
        });
        return noted;
    }

    public onItemTap(args) {
        var url = 'rss/' + this.rssType + '/' + args.index;
        console.log('going to ', url);
        this.router.navigate([url]);
    }

    public showMyFavorite(){

        if(this.mode=='favorite'){
            console.log('chaning mode to none');
            this.mode='';
            this.rssService.getSimplifiedRssObjectsFor(this.rssType, (channel: Channel, items: Item[]) => {
                this.channel = channel;
                this._rssItems = items;
            });
        }else{
            this.mode ='favorite';
            console.log('chaning mode to favorite');
            this.rssService.getSimplifiedFavoritedRssObjects(rssItems=>{
                this._rssItems = rssItems;
            });
        }
        this.loading = false;
        this.drawer.closeDrawer();
    }

    public showMyNoted(){
        if(this.mode=='noted'){
            console.log('chaning mode to none');
            this.mode='';
            this.rssService.getSimplifiedRssObjectsFor(this.rssType, (channel: Channel, items: Item[]) => {
                this.channel = channel;
                this._rssItems = items;
            });
        }else{
            this.mode ='noted';
            console.log('chaning mode to noted');
            this.rssService.getSimplifiedNotedRssObjects(rssItems=>{
                this._rssItems = rssItems;
            });
        }
        this.loading = false;
        this.drawer.closeDrawer();
    }

    public onLoadMoreItemsRequested(args: ListViewEventData){
        console.log('laoading more here ...', this.mode)
        var listView:RadListView = args.object;
        var startingCnt = this._rssItems.length;

        if(this.mode=='noted'){
            this.rssService.nextSimplifiedNotedPage(rssItems=>{
                this._rssItems = rssItems;
                listView.notifyLoadOnDemandFinished();
            });
        }else if(this.mode=='favorite'){
            this.rssService.nextSimplifiedFavoritePage(rssItems=>{
                this._rssItems = rssItems;
                listView.notifyLoadOnDemandFinished();
            });
        }else if(this.mode=='search'){
            //var listView: RadListView = args.object;
            this.rssService.nextSimplifiedSearchPageFor(this.rssType, this.selectedBooks,
                [this.selectedDateOption, this.selectedDate1, this.selectedDate2],
                items => {
                    this._rssItems = items;
                    listView.notifyLoadOnDemandFinished();
                });
            }else{
                this.rssService.nextSimplifiedPageFor(this.rssType, items => {
                    this._rssItems = items;
                    listView.notifyLoadOnDemandFinished();
                });
            }


            args.returnValue = true;
        }

        public onSwipeCellFinished(){
            console.log('onSwipeCellFinished')
        }

        public onSwipeCellStarted(args: ListViewEventData) {
            var swipeLimits = args.data.swipeLimits;
            var swipeView = args['object'];
            var rightItem = swipeView.getViewById<View>('right-stack');
            var leftItem = swipeView.getViewById<View>('left-stack');
            swipeLimits.right = rightItem.getMeasuredWidth();
            swipeLimits.left = leftItem.getMeasuredWidth();
            swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.1; // 20% of whole width
        }


        @ViewChild("myListView") listViewComponent: RadListViewComponent;

        public onRightSwipeClick(args) {
            let index = this.listViewComponent.listView.items.indexOf(args.object.bindingContext);
            let uuid = this.rssItems[index].uuid;
            this.rssService.setItem(this.rssItems[index]);

            if(args.object.class=='playGridLayout'){
                var url = 'rss/' + this.rssType + '/' + index;
                this.router.navigate([url]);
                this.listViewComponent.listView.notifySwipeToExecuteFinished();

            }else if(args.object.class=='favoriteGridLayout'){
                this.rssService.favoriteItem(uuid, (favorited)=>{
                    this._updateFavoritedItems( ()=>{
                        console.log("Button clicked: " + args.object.id + " for item with index: " + index);
                        this.listViewComponent.listView.notifySwipeToExecuteFinished();
                    } );
                });
            }else if(args.object.class=='noteGridLayout'){
                console.log("write note for it");
                //now go to note page here
                this.router.navigate(['rssnote']);
                console.log("Button clicked: " + args.object.id + " for item with index: " + index);
                this.listViewComponent.listView.notifySwipeToExecuteFinished();

            }else if(args.object.class=='emailGridLayout'){
                this.rssService.retrieveRssItemFor('qt', index, item => {

                    console.log("Email share for it");
                    //now go to note page here
                    this.rssService.share('email', item);
                    console.log("Button clicked: " + args.object.id + " for item with index: " + index);
                    this.listViewComponent.listView.notifySwipeToExecuteFinished();
                });
            }
        }

        private _updateFavoritedItems(cb=null){

            console.log( '_updateFavoritedItems ');
            this.rssService.getAllMyFavoritedItemSimplified(this.rssType, items=>{
                this._favoritedItems = items;
                if(cb) cb();
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
        }

        private _updateNotedItems(cb=null){
            console.log( '_updateNotedItems ');
            this.rssService.getAllMyNotedItemSimplified(this.rssType, items=>{
                console.log('noted items are =>');
                console.log(JSON.stringify(items));

                this._notedItems = items;
                if(cb) cb();
            });
        }

        public onCellSwiping(){

        }
        public onItemSwiping(){

        }


        public showBooks() {
            this._createView(RssBookListComponent).then(result => {
                this.bSearching = true;
                this.mode='search';
                this.selectedBooks = result;
            }).catch(error => this.handleError(error));;
        }

        public showDatePicker() {
            this._createView(RssDataPickerComponent).then(result => {
                console.log('datepicker result is ', result);
                this.selectedDateOption = result[0];
                this.selectedDate1 = result[1];
                this.selectedDate2 = result[2];

                this.dateString = this.selectedDateOption +' '+this.selectedDate1;
                if(this.selectedDateOption=='Between'){
                    this.dateString +=' and '+this.selectedDate2;
                }

            }).catch(error => this.handleError(error));;
        }

        private _createView(comp: any): Promise<any> {
            const options: ModalDialogOptions = {
                viewContainerRef: this.vcRef,
                fullscreen: false,
            }
            return this.modalService.showModal(comp, options);
        }

        private handleError(error: any) {
            alert("Please try again!");
            console.dir(error);
        }

        public systemFixing(){
            this.router.navigate(['rssnote']);
        }

        public toggleContinuePlaying(){
            if(this.playingMode=="single"){
                this.playingMode="continue";
            }else{
                this.playingMode="single";
            }
        }
    }
