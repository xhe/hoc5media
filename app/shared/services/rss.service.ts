import {Injectable} from "@angular/core";
import {ConfigService} from '../utilities/config.service'
import {RequestService} from '../utilities/request.service';
import {DbService} from './db.service';
import {CustomDbService} from './custom_db.service';
//import { knownFolders, File, Folder } from "file-system";
import * as fs from "file-system";
import {Rss, Channel, ChannelImage, Item} from '../entities/entities';
import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from "application-settings";

import * as email from "nativescript-email";
import * as SocialShare from "nativescript-social-share";

var parseString = require('nativescript-xml2js').parseString;
declare function unescape(s:string): string;
@Injectable()
export class RssService {

    private rssData;
    private page: number;
    public pageSize: number;

    private item:Item;

    public setItem(item:Item){
        this.item=item;
    }
    public getItem(){
        return this.item;
    }
    constructor(private configService: ConfigService,
        private requestService: RequestService,
        private dbService: DbService,
        private customDbService:CustomDbService
    ) {

        this.pageSize = 50;
        this.rssData = {};
        this.language = this.configService.getDefaultLanguage();
    }

    public share(type, item){
        if(type=='social'){
            SocialShare.shareUrl(item.link, item.title +' '+ item.subTitle);
        }
        if(type = 'email'){
            var body =  this.trans("Hello, I would like to share some good bible information with you.", "你好， 我希望与您分享以下美好的圣经经文及信息。");

            body += "<br/><br/><a href='"+ item.enclosure_link+"'>"+this.trans('Click to hear the recording.', '点击以收听录音。')+"</a>";
            body += "<br/>" + this.trans('Copy below link to browser address bar directly if above link not work', '如果以上链接无效，请粘贴以下链接于浏览器地址框。');
            body += "<br/>" + item.enclosure_link;

            body += "<br/><br/>"+ item.title;
            body += "<br/><br/>"+ item.subTitle;

            body +="<br/><br/>" + this.trans('Scripture is as follows:', '经文如下：');
            body +="<br/>" + item.scripture;

            body +="<br/><br/>" + item.summary;

            email.available().then( (avail:boolean)=>{
                console.log("Email available? " + avail);
                if(avail){
                    email.compose({
                        subject: this.trans('Good bible scripture to share', '圣经经文与您分享'),
                        body: body
                    }).then(result=>{
                        console.log('sending erdulst is ', result);
                        if(result){
                            console.log('sent out Successfully');
                        }
                    }).catch(error=>console.error(error));
                } else {
                    console.log('not available here ');
                }
            });

        }

    }

    public backupCustomData(){
        // let documents = knownFolders.documents();
        // var folder = documents.getFolder("backup");
        // var file =  folder.getFile("backup.txt");

        let documentsFolder = fs.knownFolders.documents();
        let currentAppFolder = fs.knownFolders.currentApp();
        let tempFolder = fs.knownFolders.temp();

        let path = fs.path.join(documentsFolder.path, "backup.txt");
        let file = fs.File.fromPath(path);

        this.customDbService.getAll(function(items){
            file.writeText(JSON.stringify(items))
            .then(result => {

                email.available().then( (avail:boolean)=>{
                    console.log("Email available? " + avail);
                    if(avail){
                        email.compose({
                            to: ['hexufeng@gmail.com'],
                            subject: 'test attachmet',
                            body: 'Custom Data File',
                            attachments: [
                                {
                                    fileName: 'backup.txt',
                                    path: path,
                                    mimeType: 'application/text'
                                }
                            ]
                        }).then(result=>{
                            console.log('sending erdulst is ', result);
                            if(result){
                                console.log('sent out Successfully');
                            }
                        }).catch(error=>console.error(error));
                    } else {
                        console.log('not available here ');
                    }
                });




                file.readText()
                .then(res => {
                    console.log( "Successfully saved in " + file.path) ;
                    console.log(res);
                });
            }).catch(err => {
                console.log(err);
            });
        });
    }

    //translation purpose
    private language:string;
    public setLanguage(lan:string):void{
        this.language = lan;
        setString("language", lan);
    }
    public getLanguage():string{
        return this.language;
    }
    public trans(en:string, zh:string):string{
        return this.language==='en'?en:zh;
    }

    public getNotedItemFor(uuid:number, cb){
        this.customDbService.getFavoriteItemFor(uuid, cb);
    }

    public getAllMyFavoritedItem(rssType: string,cb){
        if(rssType!=='qt'){
            cb([]);
        }else{
            this.customDbService.getAllFavoriteItems(items=>{
                cb(items);
            });
        }
    }
    public getAllMyFavoritedItemSimplified(rssType: string,cb){
        if(rssType!=='qt'){
            cb([]);
        }else{
            this.customDbService.getAllFavoriteItemsSimplified(items=>{
                cb(items);
            });
        }
    }
    public getAllMyNotedItem(rssType: string,cb){
        if(rssType!=='qt'){
            cb([]);
        }else{
            this.customDbService.getAllNotedItems(cb);
        }
    }
    public getAllMyNotedItemSimplified(rssType: string,cb){
        if(rssType!=='qt'){
            cb([]);
        }else{
            this.customDbService.getAllNotedItemsSimplified(cb);
        }
    }

    public getAllMyItems(rssType:string, type:string, cb){
        if(rssType!=='qt'){
            cb([]);
        }else{

        }
    }

    public addNoteToItem(uuid:number,title:string, note:string, cb){
        console.log('adding note: ', uuid, title, note)
        this.customDbService.updateCustomItemFor(uuid, 'title', title, result=>{
            this.customDbService.updateCustomItemFor(uuid, 'note', note, result=>{
                if(cb) cb();
            });
        });
    }

    public favoriteItem(uuid:number, cb){
        let favorite = 1
        this.customDbService.getFavoriteItemFor(uuid, items=>{
            if(items.length>0){
                if(items[0].favorite==1){
                    favorite=0;
                }else{
                    favorite=1;
                }
            }
            this.customDbService.updateCustomItemFor(uuid, 'favorite', favorite, result=>{
                if(cb)
                cb(favorite);
            });
        });

    }

    public noteItem(uuid:number, note:string){
        this.customDbService.updateCustomItemFor(uuid, 'note', note, result=>{
            console.log( result );
        });
    }

    public getFavoritedRssObjects(cb){
        this.page = 1;
        this.customDbService.getFavoritedItemUUIDs(this.pageSize, this.page, itemUUIDs=>{
            this.dbService.getFavoritedItemsForUUIDs(itemUUIDs, rssItems=>{
                this.rssData['qt'] = this._createRssFromItems(rssItems);;
                cb(this._getPaginatedItemsFor('qt'));
            });
        });
    }

    public getSimplifiedFavoritedRssObjects(cb){
        this.page = 1;
        this.customDbService.getFavoritedItemUUIDs(this.pageSize, this.page, itemUUIDs=>{
            this.dbService.getSimplifiedFavoritedItemsForUUIDs(itemUUIDs, rssItems=>{
                this.rssData['qt'] = this._createRssFromItems(rssItems);;
                cb(this._getPaginatedItemsFor('qt'));
            });
        });
    }

    public getNotedRssObjects(cb){
        this.page = 1;
        this.customDbService.getNotedtemUUIDs(this.pageSize, this.page, itemUUIDs=>{
            this.dbService.getFavoritedItemsForUUIDs(itemUUIDs, rssItems=>{
                this.rssData['qt'] = this._createRssFromItems(rssItems);;
                cb(this._getPaginatedItemsFor('qt'));
            });
        });
    }

    public getSimplifiedNotedRssObjects(cb){
        this.page = 1;
        this.customDbService.getNotedtemUUIDs(this.pageSize, this.page, itemUUIDs=>{
            this.dbService.getSimplifiedNotedItemsForUUIDs(itemUUIDs, rssItems=>{
                this.rssData['qt'] = this._createRssFromItems(rssItems);;
                cb(this._getPaginatedItemsFor('qt'));
            });
        });
    }

    public searchRssObjectsFor(rssType: string, bookNames:String[], period:any, cb){

        if(rssType!=='qt'){
            return this.getRssObjectsFor(rssType, cb);
        }else{
            //1. restore to page is
            this.page = 1;
            //3. do search here
            this.dbService.searchItemsFor(bookNames,
                period, this.pageSize, this.page,
                items=>{
                    this.rssData['qt'] = this._createRssFromItems(items);
                    cb(this._getPaginatedItemsFor(rssType));
                });
            }
        }

        public searchSimplifiedRssObjectsFor(rssType: string, bookNames:String[], period:any, cb){

            if(rssType!=='qt'){
                return this.getRssObjectsFor(rssType, cb);
            }else{
                //1. restore to page is
                this.page = 1;
                //3. do search here
                this.dbService.searchSimplifiedItemsFor(bookNames,
                    period, this.pageSize, this.page,
                    items=>{
                        this.rssData['qt'] = this._createRssFromItems(items);
                        cb(this._getPaginatedItemsFor(rssType));
                    });
                }
            }
            public getRssObjectsFor(rssType: string, cb) {
                this.page = 1;
                if (rssType!='qt' && this.rssData[rssType] && !this._isExpired(this.rssData[rssType].channel[0].item[0])) {
                    cb(this.rssData[rssType].channel[0], this._getPaginatedItemsFor(rssType));
                } else {
                    //checking database data
                    if (rssType === 'qt') {
                        //getting first page only from DB
                        console.log('gettign qs from db');
                        this.dbService.getPaginatedItems(this.pageSize, this.page, items => {

                            if (items.length > 0 && !this._isExpired(items[0])) {
                                this.rssData['qt'] = this._createRssFromItems(items);
                                cb(this.rssData[rssType].channel[0], this._getPaginatedItemsFor(rssType));
                            } else {
                                console.log('not in db, fetching....');
                                this._fetchData(rssType, cb);
                            }
                        });

                    } else {
                        this._fetchData(rssType, cb);
                    }
                }
            }

            public getSimplifiedRssObjectsFor(rssType: string, cb) {
                this.page = 1;
                if (rssType!='qt' && this.rssData[rssType] && !this._isExpired(this.rssData[rssType].channel[0].item[0])) {
                    cb(this.rssData[rssType].channel[0], this._getPaginatedItemsFor(rssType));
                } else {
                    //checking database data
                    if (rssType === 'qt') {
                        //getting first page only from DB
                        this.dbService.getSimplifiedPaginatedItems(this.pageSize, this.page, items => {
                            if (items.length > 0 && !this._isExpired(items[0])) {
                                this.rssData['qt'] = this._createRssFromItems(items);
                                cb(this.rssData[rssType].channel[0], this._getPaginatedItemsFor(rssType));
                            } else {
                                console.log('not in db, fetching....');
                                this._fetchData(rssType, cb);
                            }
                        });

                    } else {
                        this._fetchData(rssType, cb);
                    }
                }
            }


            public retrieveRssItemFor(rssType: string, index: number, cb) {
                var itemSimplified = this._getRssItemFor(rssType, index);

                if(rssType!='qt'){
                    cb(itemSimplified);
                }else{
                    this.dbService.getItemFromUUID(itemSimplified.uuid, item=>{
                        if (item.scriptUrl != '') {
                            //if scripture existed already
                            if (item.scripture != '' && item.scripture != null) {
                                console.log('scripture exited');
                                this.setItem(item);
                                cb(item);
                            } else {
                                console.log('retrieving scripture');
                                if(this.getLanguage()=='en'){
                                    this._getScriptContentEn(item, cb);
                                }else{
                                    this._getScriptContent(item, cb);
                                }
                            }
                        } else{
                            this.setItem(item);
                            cb(item);
                        }

                    });
                }

            }

            public nextFavoritePage(cb){
                var nextPage= this.page+1;
                var rssItems = [];
                this.customDbService.getFavoritedItems(this.pageSize, nextPage, items=>{
                    var itemUUIDs = [];
                    items.forEach(item=>{
                        itemUUIDs.push(item.uuid);
                    });
                    if(items.length==0){
                        cb(this._getPaginatedItemsFor('qt'));
                    }else{
                        this.dbService.getFavoritedItemsForUUIDs(itemUUIDs, rssItems=>{
                            rssItems.forEach(tmp=>{
                                //then populating into the data object
                                this.rssData['qt'].channel[0].item.push(tmp);
                            });

                            if(rssItems.length>0)
                            this.page++;
                            cb(this._getPaginatedItemsFor('qt'));
                        });
                    }
                });
            }

            public nextSimplifiedFavoritePage(cb){
                var nextPage= this.page+1;
                var rssItems = [];
                this.customDbService.getSimplifiedFavoritedItems(this.pageSize, nextPage, items=>{
                    var itemUUIDs = [];
                    items.forEach(item=>{
                        itemUUIDs.push(item.uuid);
                    });
                    if(items.length==0){
                        cb(this._getPaginatedItemsFor('qt'));
                    }else{
                        this.dbService.getSimplifiedFavoritedItemsForUUIDs(itemUUIDs, rssItems=>{
                            rssItems.forEach(tmp=>{
                                //then populating into the data object
                                this.rssData['qt'].channel[0].item.push(tmp);
                            });

                            if(rssItems.length>0)
                            this.page++;
                            cb(this._getPaginatedItemsFor('qt'));
                        });
                    }
                });
            }

            public nextNotedPage(cb){
                var nextPage= this.page+1;
                var rssItems = [];
                this.customDbService.getNotedItems(this.pageSize, nextPage, items=>{
                    var itemUUIDs = [];
                    items.forEach(item=>{
                        itemUUIDs.push(item.uuid);
                    });
                    if(items.length==0){
                        cb(this._getPaginatedItemsFor('qt'));
                    }else{
                        this.dbService.getFavoritedItemsForUUIDs(itemUUIDs, rssItems=>{
                            rssItems.forEach(tmp=>{
                                //then populating into the data object
                                this.rssData['qt'].channel[0].item.push(tmp);
                            });

                            if(rssItems.length>0)
                            this.page++;
                            cb(this._getPaginatedItemsFor('qt'));
                        });
                    }
                });
            }

            public nextSimplifiedNotedPage(cb){
                var nextPage= this.page+1;
                var rssItems = [];
                this.customDbService.getSimplifiedNotedItems(this.pageSize, nextPage, items=>{
                    var itemUUIDs = [];
                    items.forEach(item=>{
                        itemUUIDs.push(item.uuid);
                    });
                    if(items.length==0){
                        cb(this._getPaginatedItemsFor('qt'));
                    }else{
                        this.dbService.getSimplifiedNotedItemsForUUIDs(itemUUIDs, rssItems=>{
                            rssItems.forEach(tmp=>{
                                //then populating into the data object
                                this.rssData['qt'].channel[0].item.push(tmp);
                            });

                            if(rssItems.length>0)
                            this.page++;
                            cb(this._getPaginatedItemsFor('qt'));
                        });
                    }
                });
            }

            public nextSearchPageFor(rssType: string, bookNames:String[], period:any, cb){

                var nextPage= this.page+1;
                if (rssType == 'qt') {
                    //for QT, we read from DB for next page
                    //3. do search here
                    this.dbService.searchItemsFor(bookNames,
                        period, this.pageSize, nextPage,
                        items=>{
                            items.forEach(item => {
                                //then populating into the data object
                                this.rssData[rssType].channel[0].item.push(item);
                            });
                            if(items.length>0)
                            this.page++;
                            cb(this._getPaginatedItemsFor(rssType));
                        });
                    } else {
                        cb(this._getPaginatedItemsFor(rssType));
                    }
                }

                public nextSimplifiedSearchPageFor(rssType: string, bookNames:String[], period:any, cb){

                    var nextPage= this.page+1;
                    if (rssType == 'qt') {
                        //for QT, we read from DB for next page
                        //3. do search here
                        this.dbService.searchSimplifiedItemsFor(bookNames,
                            period, this.pageSize, nextPage,
                            items=>{
                                items.forEach(item => {
                                    //then populating into the data object
                                    this.rssData[rssType].channel[0].item.push(item);
                                });
                                if(items.length>0)
                                this.page++;
                                cb(this._getPaginatedItemsFor(rssType));
                            });
                        } else {
                            cb(this._getPaginatedItemsFor(rssType));
                        }
                    }

                    public nextPageFor(rssType: string, cb) {
                        this.page++;
                        if (rssType == 'qt') {
                            //for QT, we read from DB for next page
                            this.dbService.getPaginatedItems(this.pageSize, this.page, items => {
                                items.forEach(item => {
                                    //then populating into the data object
                                    this.rssData[rssType].channel[0].item.push(item);
                                });
                                cb(this._getPaginatedItemsFor(rssType));
                            });
                        } else {
                            cb(this._getPaginatedItemsFor(rssType));
                        }

                    }

                    public nextSimplifiedPageFor(rssType: string, cb){
                        this.page++;
                        if (rssType == 'qt') {
                            //for QT, we read from DB for next page
                            this.dbService.getSimplifiedPaginatedItems(this.pageSize, this.page, items => {
                                items.forEach(item => {
                                    //then populating into the data object
                                    this.rssData[rssType].channel[0].item.push(item);
                                });
                                cb(this._getPaginatedItemsFor(rssType));
                            });
                        } else {
                            cb(this._getPaginatedItemsFor(rssType));
                        }
                    }

                    public getBookList(cb) {
                        this.dbService.getBookList(items => {
                            cb(items);
                        });
                    }

                    private _getPaginatedItemsFor(rssType: string) {
                        return this.rssData[rssType].channel[0].item.slice(0, this.page * this.pageSize);
                    }

                    private _getScriptContent(item: Item, cb) {
                        var pos = item.scriptUrl.indexOf('version=');
                        var url = item.scriptUrl;
                        url = url.substring(0, pos+8) + 'CUVMPS';
                        console.log('new url is ', url);


                        this.requestService.getRawData(url)
                        .subscribe((data: string) => {
                            var startingPos = data.indexOf('<div class="passage-text">');
                            var endingPos = 0;
                            var content = '';
                            if (startingPos > 0) {
                                endingPos = data.lastIndexOf('</span></p>');
                                content = data.substring(startingPos, endingPos);
                            }
                            content = content.replace(new RegExp("h1", 'g'), 'h3');
                            content = content.replace('Chinese Union Version Modern Punctuation (Simplified) (CUVMPS)', '');
                            item.scripture = "<div style='font-size:16px'>"+ content+"</div>";

                            //once retrived scripture, we save it
                            //this.dbService.updateItemScript(item);
                            cb(item);
                        });
                    }


                    private _getScriptContentEn(item: Item, cb) {
                        console.log('123 getting english url is==>: ', item.scriptUrl);

                        var pos = item.scriptUrl.indexOf('version=');
                        var url = item.scriptUrl;
                        url = url.substring(0, pos+8) + 'NIV';
                        console.log('23 new url is ', url);


                        this.requestService.getRawData(url)
                        .subscribe((data: string) => {
                            var startingPos = data.indexOf('<div class="passage-text">');
                            var endingPos = 0;
                            var content = '';
                            if (startingPos > 0) {
                                endingPos = data.lastIndexOf('</span></p>');
                                content = data.substring(startingPos, endingPos);
                            }
                            content = content.replace(new RegExp("h1", 'g'), 'h3');
                            content = content.replace('New International Version (NIV)', '');
                            item.scripture = "<div style='font-size:16px'>"+ content +"</div>";

                            //once retrived scripture, we save it
                            //this.dbService.updateItemScript(item);
                            cb(item);
                        });
                    }

                    private _getRssItemFor(rssType: string, index: number): Item {
                        return this.rssData[rssType].channel[0].item[index];
                    }

                    private _isExpired(item: Item): boolean {

                        let today = new Date();
                        let dd: any = today.getDate();
                        let mm: any = today.getMonth() + 1; //January is 0!

                        let yyyy: any = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }

                        return (yyyy + '-' + mm + '-' + dd) !== item.pubDate;
                        //return true;
                    }

                    private _createRssFromItems(items: Item[]) {

                        var rss: Rss = new Rss();

                        var channel: Channel = new Channel();
                        var channelImage: ChannelImage = new ChannelImage();
                        channelImage.url = 'http://hoc5.net/qt/PodcastGenerator/images/itunes_image.png';
                        channelImage.title = 'Quiet Time 靈修操練';
                        channelImage.link = 'http://hoc5.net/qt/PodcastGenerator/';

                        channel.title = this.getLanguage()=='en'?'Quiet Time':'靈修操練';
                        channel.description = this.getLanguage()=='en'?'For every reborn Christian, there should be one new thing added to his life, Quiet Time with God. This is not only a pure quiet time, but also a holy period with God. ': '每一個重生得救的基督徒，在他每天的生活裏就多了一樣新事，就是「靈修生活」，它不只是個安靜的時刻 (Quiet time)，也是個敬虔的時間，更是個與神獨處的時光。';
                        channel.image = channelImage;
                        channel.summary = this.getLanguage()=='en'?'For every reborn Christian, there should be one new thing added to his life, Quiet Time with God. This is not only a pure quiet time, but also a holy period with God. ': '每一個重生得救的基督徒，在他每天的生活裏就多了一樣新事，就是「靈修生活」，它不只是個安靜的時刻 (Quiet time)，也是個敬虔的時間，更是個與神獨處的時光。';
                        channel.link = 'http://hoc5.net/qt/PodcastGenerator/';
                        channel.item = items;

                        rss.channel = [channel];

                        return rss;
                    }

                    private _fetchData(rssType, cb) {
                        this.requestService.getRawData(this.configService.getFeedUrls()[rssType])
                        .subscribe(data => {

                            parseString(data, (err, result) => {

                                var rss = new Rss(result, rssType, this.getLanguage());

                                this.rssData[rssType] = rss;
                                cb(this.rssData[rssType].channel[0], this._getPaginatedItemsFor(rssType));
                                //once call back, remove the data
                                data = null;
                                console.log('destroyed data');
                                //saving to db in different thread, to avoid blocking user experience
                                if (rssType === 'qt')
                                setTimeout(() => {
                                    this.dbService.addItems(rss, ()=>{
                                        //after adding all data, we can remove it
                                        //this.rssData[rssType] = {};
                                        //console.log('destroyed all data from memory');
                                    });
                                }, 1000);
                            });
                        });
                    }


                }
