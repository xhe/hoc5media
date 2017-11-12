"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var config_service_1 = require("../utilities/config.service");
var request_service_1 = require("../utilities/request.service");
var db_service_1 = require("./db.service");
var custom_db_service_1 = require("./custom_db.service");
//import { knownFolders, File, Folder } from "file-system";
var fs = require("file-system");
var entities_1 = require("../entities/entities");
var application_settings_1 = require("application-settings");
var email = require("nativescript-email");
var SocialShare = require("nativescript-social-share");
var parseString = require('nativescript-xml2js').parseString;
var RssService = (function () {
    function RssService(configService, requestService, dbService, customDbService) {
        this.configService = configService;
        this.requestService = requestService;
        this.dbService = dbService;
        this.customDbService = customDbService;
        this.pageSize = 50;
        this.rssData = {};
        this.language = this.configService.getDefaultLanguage();
    }
    RssService.prototype.setItem = function (item) {
        this.item = item;
    };
    RssService.prototype.getItem = function () {
        return this.item;
    };
    RssService.prototype.share = function (type, item) {
        var _this = this;
        if (type == 'social') {
            SocialShare.shareUrl(item.link, item.title + ' ' + item.subTitle);
        }
        if (type = 'email') {
            var body = this.trans("Hello, I would like to share some good bible information with you.", "你好， 我希望与您分享以下美好的圣经经文及信息。");
            body += "<br/><br/><a href='" + item.enclosure_link + "'>" + this.trans('Click to hear the recording.', '点击以收听录音。') + "</a>";
            body += "<br/>" + this.trans('Copy below link to browser address bar directly if above link not work', '如果以上链接无效，请粘贴以下链接于浏览器地址框。');
            body += "<br/>" + item.enclosure_link;
            body += "<br/><br/>" + item.title;
            body += "<br/><br/>" + item.subTitle;
            body += "<br/><br/>" + this.trans('Scripture is as follows:', '经文如下：');
            body += "<br/>" + item.scripture;
            body += "<br/><br/>" + item.summary;
            email.available().then(function (avail) {
                console.log("Email available? " + avail);
                if (avail) {
                    email.compose({
                        subject: _this.trans('Good bible scripture to share', '圣经经文与您分享'),
                        body: body
                    }).then(function (result) {
                        console.log('sending erdulst is ', result);
                        if (result) {
                            console.log('sent out Successfully');
                        }
                    }).catch(function (error) { return console.error(error); });
                }
                else {
                    console.log('not available here ');
                }
            });
        }
    };
    RssService.prototype.backupCustomData = function () {
        // let documents = knownFolders.documents();
        // var folder = documents.getFolder("backup");
        // var file =  folder.getFile("backup.txt");
        var documentsFolder = fs.knownFolders.documents();
        var currentAppFolder = fs.knownFolders.currentApp();
        var tempFolder = fs.knownFolders.temp();
        var path = fs.path.join(documentsFolder.path, "backup.txt");
        var file = fs.File.fromPath(path);
        this.customDbService.getAll(function (items) {
            file.writeText(JSON.stringify(items))
                .then(function (result) {
                email.available().then(function (avail) {
                    console.log("Email available? " + avail);
                    if (avail) {
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
                        }).then(function (result) {
                            console.log('sending erdulst is ', result);
                            if (result) {
                                console.log('sent out Successfully');
                            }
                        }).catch(function (error) { return console.error(error); });
                    }
                    else {
                        console.log('not available here ');
                    }
                });
                file.readText()
                    .then(function (res) {
                    console.log("Successfully saved in " + file.path);
                    console.log(res);
                });
            }).catch(function (err) {
                console.log(err);
            });
        });
    };
    RssService.prototype.setLanguage = function (lan) {
        this.language = lan;
        application_settings_1.setString("language", lan);
    };
    RssService.prototype.getLanguage = function () {
        return this.language;
    };
    RssService.prototype.trans = function (en, zh) {
        return this.language === 'en' ? en : zh;
    };
    RssService.prototype.getNotedItemFor = function (uuid, cb) {
        this.customDbService.getFavoriteItemFor(uuid, cb);
    };
    RssService.prototype.getAllMyFavoritedItem = function (rssType, cb) {
        if (rssType !== 'qt') {
            cb([]);
        }
        else {
            this.customDbService.getAllFavoriteItems(function (items) {
                cb(items);
            });
        }
    };
    RssService.prototype.getAllMyFavoritedItemSimplified = function (rssType, cb) {
        if (rssType !== 'qt') {
            cb([]);
        }
        else {
            this.customDbService.getAllFavoriteItemsSimplified(function (items) {
                cb(items);
            });
        }
    };
    RssService.prototype.getAllMyNotedItem = function (rssType, cb) {
        if (rssType !== 'qt') {
            cb([]);
        }
        else {
            this.customDbService.getAllNotedItems(cb);
        }
    };
    RssService.prototype.getAllMyNotedItemSimplified = function (rssType, cb) {
        if (rssType !== 'qt') {
            cb([]);
        }
        else {
            this.customDbService.getAllNotedItemsSimplified(cb);
        }
    };
    RssService.prototype.getAllMyItems = function (rssType, type, cb) {
        if (rssType !== 'qt') {
            cb([]);
        }
        else {
        }
    };
    RssService.prototype.addNoteToItem = function (uuid, title, note, cb) {
        var _this = this;
        console.log('adding note: ', uuid, title, note);
        this.customDbService.updateCustomItemFor(uuid, 'title', title, function (result) {
            _this.customDbService.updateCustomItemFor(uuid, 'note', note, function (result) {
                if (cb)
                    cb();
            });
        });
    };
    RssService.prototype.favoriteItem = function (uuid, cb) {
        var _this = this;
        var favorite = 1;
        this.customDbService.getFavoriteItemFor(uuid, function (items) {
            if (items.length > 0) {
                if (items[0].favorite == 1) {
                    favorite = 0;
                }
                else {
                    favorite = 1;
                }
            }
            _this.customDbService.updateCustomItemFor(uuid, 'favorite', favorite, function (result) {
                if (cb)
                    cb();
            });
        });
    };
    RssService.prototype.noteItem = function (uuid, note) {
        this.customDbService.updateCustomItemFor(uuid, 'note', note, function (result) {
            console.log(result);
        });
    };
    RssService.prototype.getFavoritedRssObjects = function (cb) {
        var _this = this;
        this.page = 1;
        this.customDbService.getFavoritedItemUUIDs(this.pageSize, this.page, function (itemUUIDs) {
            _this.dbService.getFavoritedItemsForUUIDs(itemUUIDs, function (rssItems) {
                _this.rssData['qt'] = _this._createRssFromItems(rssItems);
                ;
                cb(_this._getPaginatedItemsFor('qt'));
            });
        });
    };
    RssService.prototype.getSimplifiedFavoritedRssObjects = function (cb) {
        var _this = this;
        this.page = 1;
        this.customDbService.getFavoritedItemUUIDs(this.pageSize, this.page, function (itemUUIDs) {
            _this.dbService.getSimplifiedFavoritedItemsForUUIDs(itemUUIDs, function (rssItems) {
                _this.rssData['qt'] = _this._createRssFromItems(rssItems);
                ;
                cb(_this._getPaginatedItemsFor('qt'));
            });
        });
    };
    RssService.prototype.getNotedRssObjects = function (cb) {
        var _this = this;
        this.page = 1;
        this.customDbService.getNotedtemUUIDs(this.pageSize, this.page, function (itemUUIDs) {
            _this.dbService.getFavoritedItemsForUUIDs(itemUUIDs, function (rssItems) {
                _this.rssData['qt'] = _this._createRssFromItems(rssItems);
                ;
                cb(_this._getPaginatedItemsFor('qt'));
            });
        });
    };
    RssService.prototype.getSimplifiedNotedRssObjects = function (cb) {
        var _this = this;
        this.page = 1;
        this.customDbService.getNotedtemUUIDs(this.pageSize, this.page, function (itemUUIDs) {
            _this.dbService.getSimplifiedNotedItemsForUUIDs(itemUUIDs, function (rssItems) {
                _this.rssData['qt'] = _this._createRssFromItems(rssItems);
                ;
                cb(_this._getPaginatedItemsFor('qt'));
            });
        });
    };
    RssService.prototype.searchRssObjectsFor = function (rssType, bookNames, period, cb) {
        var _this = this;
        if (rssType !== 'qt') {
            return this.getRssObjectsFor(rssType, cb);
        }
        else {
            //1. restore to page is
            this.page = 1;
            //3. do search here
            this.dbService.searchItemsFor(bookNames, period, this.pageSize, this.page, function (items) {
                _this.rssData['qt'] = _this._createRssFromItems(items);
                cb(_this._getPaginatedItemsFor(rssType));
            });
        }
    };
    RssService.prototype.searchSimplifiedRssObjectsFor = function (rssType, bookNames, period, cb) {
        var _this = this;
        if (rssType !== 'qt') {
            return this.getRssObjectsFor(rssType, cb);
        }
        else {
            //1. restore to page is
            this.page = 1;
            //3. do search here
            this.dbService.searchSimplifiedItemsFor(bookNames, period, this.pageSize, this.page, function (items) {
                _this.rssData['qt'] = _this._createRssFromItems(items);
                cb(_this._getPaginatedItemsFor(rssType));
            });
        }
    };
    RssService.prototype.getRssObjectsFor = function (rssType, cb) {
        var _this = this;
        this.page = 1;
        if (rssType != 'qt' && this.rssData[rssType] && !this._isExpired(this.rssData[rssType].channel[0].item[0])) {
            cb(this.rssData[rssType].channel[0], this._getPaginatedItemsFor(rssType));
        }
        else {
            //checking database data
            if (rssType === 'qt') {
                //getting first page only from DB
                console.log('gettign qs from db');
                this.dbService.getPaginatedItems(this.pageSize, this.page, function (items) {
                    if (items.length > 0 && !_this._isExpired(items[0])) {
                        _this.rssData['qt'] = _this._createRssFromItems(items);
                        cb(_this.rssData[rssType].channel[0], _this._getPaginatedItemsFor(rssType));
                    }
                    else {
                        console.log('not in db, fetching....');
                        _this._fetchData(rssType, cb);
                    }
                });
            }
            else {
                this._fetchData(rssType, cb);
            }
        }
    };
    RssService.prototype.getSimplifiedRssObjectsFor = function (rssType, cb) {
        var _this = this;
        this.page = 1;
        if (rssType != 'qt' && this.rssData[rssType] && !this._isExpired(this.rssData[rssType].channel[0].item[0])) {
            cb(this.rssData[rssType].channel[0], this._getPaginatedItemsFor(rssType));
        }
        else {
            //checking database data
            if (rssType === 'qt') {
                //getting first page only from DB
                this.dbService.getSimplifiedPaginatedItems(this.pageSize, this.page, function (items) {
                    if (items.length > 0 && !_this._isExpired(items[0])) {
                        _this.rssData['qt'] = _this._createRssFromItems(items);
                        cb(_this.rssData[rssType].channel[0], _this._getPaginatedItemsFor(rssType));
                    }
                    else {
                        console.log('not in db, fetching....');
                        _this._fetchData(rssType, cb);
                    }
                });
            }
            else {
                this._fetchData(rssType, cb);
            }
        }
    };
    RssService.prototype.retrieveRssItemFor = function (rssType, index, cb) {
        var _this = this;
        var itemSimplified = this._getRssItemFor(rssType, index);
        if (rssType != 'qt') {
            cb(itemSimplified);
        }
        else {
            this.dbService.getItemFromUUID(itemSimplified.uuid, function (item) {
                if (item.scriptUrl != '') {
                    //if scripture existed already
                    if (item.scripture != '' && item.scripture != null) {
                        console.log('scripture exited');
                        _this.setItem(item);
                        cb(item);
                    }
                    else {
                        console.log('retrieving scripture');
                        if (_this.getLanguage() == 'en') {
                            _this._getScriptContentEn(item, cb);
                        }
                        else {
                            _this._getScriptContent(item, cb);
                        }
                    }
                }
                else {
                    _this.setItem(item);
                    cb(item);
                }
            });
        }
    };
    RssService.prototype.nextFavoritePage = function (cb) {
        var _this = this;
        var nextPage = this.page + 1;
        var rssItems = [];
        this.customDbService.getFavoritedItems(this.pageSize, nextPage, function (items) {
            var itemUUIDs = [];
            items.forEach(function (item) {
                itemUUIDs.push(item.uuid);
            });
            if (items.length == 0) {
                cb(_this._getPaginatedItemsFor('qt'));
            }
            else {
                _this.dbService.getFavoritedItemsForUUIDs(itemUUIDs, function (rssItems) {
                    rssItems.forEach(function (tmp) {
                        //then populating into the data object
                        _this.rssData['qt'].channel[0].item.push(tmp);
                    });
                    if (rssItems.length > 0)
                        _this.page++;
                    cb(_this._getPaginatedItemsFor('qt'));
                });
            }
        });
    };
    RssService.prototype.nextSimplifiedFavoritePage = function (cb) {
        var _this = this;
        var nextPage = this.page + 1;
        var rssItems = [];
        this.customDbService.getSimplifiedFavoritedItems(this.pageSize, nextPage, function (items) {
            var itemUUIDs = [];
            items.forEach(function (item) {
                itemUUIDs.push(item.uuid);
            });
            if (items.length == 0) {
                cb(_this._getPaginatedItemsFor('qt'));
            }
            else {
                _this.dbService.getSimplifiedFavoritedItemsForUUIDs(itemUUIDs, function (rssItems) {
                    rssItems.forEach(function (tmp) {
                        //then populating into the data object
                        _this.rssData['qt'].channel[0].item.push(tmp);
                    });
                    if (rssItems.length > 0)
                        _this.page++;
                    cb(_this._getPaginatedItemsFor('qt'));
                });
            }
        });
    };
    RssService.prototype.nextNotedPage = function (cb) {
        var _this = this;
        var nextPage = this.page + 1;
        var rssItems = [];
        this.customDbService.getNotedItems(this.pageSize, nextPage, function (items) {
            var itemUUIDs = [];
            items.forEach(function (item) {
                itemUUIDs.push(item.uuid);
            });
            if (items.length == 0) {
                cb(_this._getPaginatedItemsFor('qt'));
            }
            else {
                _this.dbService.getFavoritedItemsForUUIDs(itemUUIDs, function (rssItems) {
                    rssItems.forEach(function (tmp) {
                        //then populating into the data object
                        _this.rssData['qt'].channel[0].item.push(tmp);
                    });
                    if (rssItems.length > 0)
                        _this.page++;
                    cb(_this._getPaginatedItemsFor('qt'));
                });
            }
        });
    };
    RssService.prototype.nextSimplifiedNotedPage = function (cb) {
        var _this = this;
        var nextPage = this.page + 1;
        var rssItems = [];
        this.customDbService.getSimplifiedNotedItems(this.pageSize, nextPage, function (items) {
            var itemUUIDs = [];
            items.forEach(function (item) {
                itemUUIDs.push(item.uuid);
            });
            if (items.length == 0) {
                cb(_this._getPaginatedItemsFor('qt'));
            }
            else {
                _this.dbService.getSimplifiedNotedItemsForUUIDs(itemUUIDs, function (rssItems) {
                    rssItems.forEach(function (tmp) {
                        //then populating into the data object
                        _this.rssData['qt'].channel[0].item.push(tmp);
                    });
                    if (rssItems.length > 0)
                        _this.page++;
                    cb(_this._getPaginatedItemsFor('qt'));
                });
            }
        });
    };
    RssService.prototype.nextSearchPageFor = function (rssType, bookNames, period, cb) {
        var _this = this;
        var nextPage = this.page + 1;
        if (rssType == 'qt') {
            //for QT, we read from DB for next page
            //3. do search here
            this.dbService.searchItemsFor(bookNames, period, this.pageSize, nextPage, function (items) {
                items.forEach(function (item) {
                    //then populating into the data object
                    _this.rssData[rssType].channel[0].item.push(item);
                });
                if (items.length > 0)
                    _this.page++;
                cb(_this._getPaginatedItemsFor(rssType));
            });
        }
        else {
            cb(this._getPaginatedItemsFor(rssType));
        }
    };
    RssService.prototype.nextSimplifiedSearchPageFor = function (rssType, bookNames, period, cb) {
        var _this = this;
        var nextPage = this.page + 1;
        if (rssType == 'qt') {
            //for QT, we read from DB for next page
            //3. do search here
            this.dbService.searchSimplifiedItemsFor(bookNames, period, this.pageSize, nextPage, function (items) {
                items.forEach(function (item) {
                    //then populating into the data object
                    _this.rssData[rssType].channel[0].item.push(item);
                });
                if (items.length > 0)
                    _this.page++;
                cb(_this._getPaginatedItemsFor(rssType));
            });
        }
        else {
            cb(this._getPaginatedItemsFor(rssType));
        }
    };
    RssService.prototype.nextPageFor = function (rssType, cb) {
        var _this = this;
        this.page++;
        if (rssType == 'qt') {
            //for QT, we read from DB for next page
            this.dbService.getPaginatedItems(this.pageSize, this.page, function (items) {
                items.forEach(function (item) {
                    //then populating into the data object
                    _this.rssData[rssType].channel[0].item.push(item);
                });
                cb(_this._getPaginatedItemsFor(rssType));
            });
        }
        else {
            cb(this._getPaginatedItemsFor(rssType));
        }
    };
    RssService.prototype.nextSimplifiedPageFor = function (rssType, cb) {
        var _this = this;
        this.page++;
        if (rssType == 'qt') {
            //for QT, we read from DB for next page
            this.dbService.getSimplifiedPaginatedItems(this.pageSize, this.page, function (items) {
                items.forEach(function (item) {
                    //then populating into the data object
                    _this.rssData[rssType].channel[0].item.push(item);
                });
                cb(_this._getPaginatedItemsFor(rssType));
            });
        }
        else {
            cb(this._getPaginatedItemsFor(rssType));
        }
    };
    RssService.prototype.getBookList = function (cb) {
        this.dbService.getBookList(function (items) {
            cb(items);
        });
    };
    RssService.prototype._getPaginatedItemsFor = function (rssType) {
        return this.rssData[rssType].channel[0].item.slice(0, this.page * this.pageSize);
    };
    RssService.prototype._getScriptContent = function (item, cb) {
        var pos = item.scriptUrl.indexOf('version=');
        var url = item.scriptUrl;
        url = url.substring(0, pos + 8) + 'CUVMPS';
        console.log('new url is ', url);
        this.requestService.getRawData(url)
            .subscribe(function (data) {
            var startingPos = data.indexOf('<div class="passage-text">');
            var endingPos = 0;
            var content = '';
            if (startingPos > 0) {
                endingPos = data.lastIndexOf('</span></p>');
                content = data.substring(startingPos, endingPos);
            }
            content = content.replace(new RegExp("h1", 'g'), 'h3');
            content = content.replace('Chinese Union Version Modern Punctuation (Simplified) (CUVMPS)', '');
            item.scripture = "<div style='font-size:16px'>" + content + "</div>";
            //once retrived scripture, we save it
            //this.dbService.updateItemScript(item);
            cb(item);
        });
    };
    RssService.prototype._getScriptContentEn = function (item, cb) {
        console.log('123 getting english url is==>: ', item.scriptUrl);
        var pos = item.scriptUrl.indexOf('version=');
        var url = item.scriptUrl;
        url = url.substring(0, pos + 8) + 'NIV';
        console.log('23 new url is ', url);
        this.requestService.getRawData(url)
            .subscribe(function (data) {
            var startingPos = data.indexOf('<div class="passage-text">');
            var endingPos = 0;
            var content = '';
            if (startingPos > 0) {
                endingPos = data.lastIndexOf('</span></p>');
                content = data.substring(startingPos, endingPos);
            }
            content = content.replace(new RegExp("h1", 'g'), 'h3');
            content = content.replace('New International Version (NIV)', '');
            item.scripture = "<div style='font-size:16px'>" + content + "</div>";
            //once retrived scripture, we save it
            //this.dbService.updateItemScript(item);
            cb(item);
        });
    };
    RssService.prototype._getRssItemFor = function (rssType, index) {
        return this.rssData[rssType].channel[0].item[index];
    };
    RssService.prototype._isExpired = function (item) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return (yyyy + '-' + mm + '-' + dd) !== item.pubDate;
        //return true;
    };
    RssService.prototype._createRssFromItems = function (items) {
        var rss = new entities_1.Rss();
        var channel = new entities_1.Channel();
        var channelImage = new entities_1.ChannelImage();
        channelImage.url = 'http://hoc5.net/qt/PodcastGenerator/images/itunes_image.png';
        channelImage.title = 'Quiet Time 靈修操練';
        channelImage.link = 'http://hoc5.net/qt/PodcastGenerator/';
        channel.title = this.getLanguage() == 'en' ? 'Quiet Time' : '靈修操練';
        channel.description = this.getLanguage() == 'en' ? 'For every reborn Christian, there should be one new thing added to his life, Quiet Time with God. This is not only a pure quiet time, but also a holy period with God. ' : '每一個重生得救的基督徒，在他每天的生活裏就多了一樣新事，就是「靈修生活」，它不只是個安靜的時刻 (Quiet time)，也是個敬虔的時間，更是個與神獨處的時光。';
        channel.image = channelImage;
        channel.summary = this.getLanguage() == 'en' ? 'For every reborn Christian, there should be one new thing added to his life, Quiet Time with God. This is not only a pure quiet time, but also a holy period with God. ' : '每一個重生得救的基督徒，在他每天的生活裏就多了一樣新事，就是「靈修生活」，它不只是個安靜的時刻 (Quiet time)，也是個敬虔的時間，更是個與神獨處的時光。';
        channel.link = 'http://hoc5.net/qt/PodcastGenerator/';
        channel.item = items;
        rss.channel = [channel];
        return rss;
    };
    RssService.prototype._fetchData = function (rssType, cb) {
        var _this = this;
        this.requestService.getRawData(this.configService.getFeedUrls()[rssType])
            .subscribe(function (data) {
            parseString(data, function (err, result) {
                var rss = new entities_1.Rss(result, rssType, _this.getLanguage());
                _this.rssData[rssType] = rss;
                cb(_this.rssData[rssType].channel[0], _this._getPaginatedItemsFor(rssType));
                //once call back, remove the data
                data = null;
                console.log('destroyed data');
                //saving to db in different thread, to avoid blocking user experience
                if (rssType === 'qt')
                    setTimeout(function () {
                        _this.dbService.addItems(rss, function () {
                            //after adding all data, we can remove it
                            //this.rssData[rssType] = {};
                            //console.log('destroyed all data from memory');
                        });
                    }, 1000);
            });
        });
    };
    RssService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [config_service_1.ConfigService,
            request_service_1.RequestService,
            db_service_1.DbService,
            custom_db_service_1.CustomDbService])
    ], RssService);
    return RssService;
}());
exports.RssService = RssService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyc3Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUN6Qyw4REFBeUQ7QUFDekQsZ0VBQTREO0FBQzVELDJDQUF1QztBQUN2Qyx5REFBb0Q7QUFDcEQsMkRBQTJEO0FBQzNELGdDQUFrQztBQUNsQyxpREFBc0U7QUFDdEUsNkRBVThCO0FBRTlCLDBDQUE0QztBQUM1Qyx1REFBeUQ7QUFFekQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsV0FBVyxDQUFDO0FBRzdEO0lBY0ksb0JBQW9CLGFBQTRCLEVBQ3BDLGNBQThCLEVBQzlCLFNBQW9CLEVBQ3BCLGVBQStCO1FBSHZCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQ3BDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUd2QyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0lBZk0sNEJBQU8sR0FBZCxVQUFlLElBQVM7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNNLDRCQUFPLEdBQWQ7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBWU0sMEJBQUssR0FBWixVQUFhLElBQUksRUFBRSxJQUFJO1FBQXZCLGlCQXNDQztRQXJDRyxFQUFFLENBQUEsQ0FBQyxJQUFJLElBQUUsUUFBUSxDQUFDLENBQUEsQ0FBQztZQUNmLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFB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TyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM5QixxRUFBcUU7Z0JBQ3JFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUM7b0JBQ3JCLFVBQVUsQ0FBQzt3QkFDUCxLQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7NEJBQ3pCLHlDQUF5Qzs0QkFDekMsNkJBQTZCOzRCQUM3QixnREFBZ0Q7d0JBQ3BELENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBcHFCUixVQUFVO1FBRHRCLGlCQUFVLEVBQUU7eUNBZTBCLDhCQUFhO1lBQ3BCLGdDQUFjO1lBQ25CLHNCQUFTO1lBQ0osbUNBQWU7T0FqQmxDLFVBQVUsQ0F1cUJOO0lBQUQsaUJBQUM7Q0FBQSxBQXZxQmpCLElBdXFCaUI7QUF2cUJKLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtDb25maWdTZXJ2aWNlfSBmcm9tICcuLi91dGlsaXRpZXMvY29uZmlnLnNlcnZpY2UnXG5pbXBvcnQge1JlcXVlc3RTZXJ2aWNlfSBmcm9tICcuLi91dGlsaXRpZXMvcmVxdWVzdC5zZXJ2aWNlJztcbmltcG9ydCB7RGJTZXJ2aWNlfSBmcm9tICcuL2RiLnNlcnZpY2UnO1xuaW1wb3J0IHtDdXN0b21EYlNlcnZpY2V9IGZyb20gJy4vY3VzdG9tX2RiLnNlcnZpY2UnO1xuLy9pbXBvcnQgeyBrbm93bkZvbGRlcnMsIEZpbGUsIEZvbGRlciB9IGZyb20gXCJmaWxlLXN5c3RlbVwiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZpbGUtc3lzdGVtXCI7XG5pbXBvcnQge1JzcywgQ2hhbm5lbCwgQ2hhbm5lbEltYWdlLCBJdGVtfSBmcm9tICcuLi9lbnRpdGllcy9lbnRpdGllcyc7XG5pbXBvcnQge1xuICAgIGdldEJvb2xlYW4sXG4gICAgc2V0Qm9vbGVhbixcbiAgICBnZXROdW1iZXIsXG4gICAgc2V0TnVtYmVyLFxuICAgIGdldFN0cmluZyxcbiAgICBzZXRTdHJpbmcsXG4gICAgaGFzS2V5LFxuICAgIHJlbW92ZSxcbiAgICBjbGVhclxufSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcblxuaW1wb3J0ICogYXMgZW1haWwgZnJvbSBcIm5hdGl2ZXNjcmlwdC1lbWFpbFwiO1xuaW1wb3J0ICogYXMgU29jaWFsU2hhcmUgZnJvbSBcIm5hdGl2ZXNjcmlwdC1zb2NpYWwtc2hhcmVcIjtcblxudmFyIHBhcnNlU3RyaW5nID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LXhtbDJqcycpLnBhcnNlU3RyaW5nO1xuZGVjbGFyZSBmdW5jdGlvbiB1bmVzY2FwZShzOnN0cmluZyk6IHN0cmluZztcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSc3NTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgcnNzRGF0YTtcbiAgICBwcml2YXRlIHBhZ2U6IG51bWJlcjtcbiAgICBwdWJsaWMgcGFnZVNpemU6IG51bWJlcjtcblxuICAgIHByaXZhdGUgaXRlbTpJdGVtO1xuXG4gICAgcHVibGljIHNldEl0ZW0oaXRlbTpJdGVtKXtcbiAgICAgICAgdGhpcy5pdGVtPWl0ZW07XG4gICAgfVxuICAgIHB1YmxpYyBnZXRJdGVtKCl7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW07XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnU2VydmljZTogQ29uZmlnU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZXF1ZXN0U2VydmljZTogUmVxdWVzdFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgZGJTZXJ2aWNlOiBEYlNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgY3VzdG9tRGJTZXJ2aWNlOkN1c3RvbURiU2VydmljZVxuICAgICkge1xuXG4gICAgICAgIHRoaXMucGFnZVNpemUgPSA1MDtcbiAgICAgICAgdGhpcy5yc3NEYXRhID0ge307XG4gICAgICAgIHRoaXMubGFuZ3VhZ2UgPSB0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0RGVmYXVsdExhbmd1YWdlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNoYXJlKHR5cGUsIGl0ZW0pe1xuICAgICAgICBpZih0eXBlPT0nc29jaWFsJyl7XG4gICAgICAgICAgICBTb2NpYWxTaGFyZS5zaGFyZVVybChpdGVtLmxpbmssIGl0ZW0udGl0bGUgKycgJysgaXRlbS5zdWJUaXRsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodHlwZSA9ICdlbWFpbCcpe1xuICAgICAgICAgICAgdmFyIGJvZHkgPSAgdGhpcy50cmFucyhcIkhlbGxvLCBJIHdvdWxkIGxpa2UgdG8gc2hhcmUgc29tZSBnb29kIGJpYmxlIGluZm9ybWF0aW9uIHdpdGggeW91LlwiLCBcIuS9oOWlve+8jCDmiJHluIzmnJvkuI7mgqjliIbkuqvku6XkuIvnvo7lpb3nmoTlnKPnu4/nu4/mloflj4rkv6Hmga/jgIJcIik7XG5cbiAgICAgICAgICAgIGJvZHkgKz0gXCI8YnIvPjxici8+PGEgaHJlZj0nXCIrIGl0ZW0uZW5jbG9zdXJlX2xpbmsrXCInPlwiK3RoaXMudHJhbnMoJ0NsaWNrIHRvIGhlYXIgdGhlIHJlY29yZGluZy4nLCAn54K55Ye75Lul5pS25ZCs5b2V6Z+z44CCJykrXCI8L2E+XCI7XG4gICAgICAgICAgICBib2R5ICs9IFwiPGJyLz5cIiArIHRoaXMudHJhbnMoJ0NvcHkgYmVsb3cgbGluayB0byBicm93c2VyIGFkZHJlc3MgYmFyIGRpcmVjdGx5IGlmIGFib3ZlIGxpbmsgbm90IHdvcmsnLCAn5aaC5p6c5Lul5LiK6ZO+5o6l5peg5pWI77yM6K+357KY6LS05Lul5LiL6ZO+5o6l5LqO5rWP6KeI5Zmo5Zyw5Z2A5qGG44CCJyk7XG4gICAgICAgICAgICBib2R5ICs9IFwiPGJyLz5cIiArIGl0ZW0uZW5jbG9zdXJlX2xpbms7XG5cbiAgICAgICAgICAgIGJvZHkgKz0gXCI8YnIvPjxici8+XCIrIGl0ZW0udGl0bGU7XG4gICAgICAgICAgICBib2R5ICs9IFwiPGJyLz48YnIvPlwiKyBpdGVtLnN1YlRpdGxlO1xuXG4gICAgICAgICAgICBib2R5ICs9XCI8YnIvPjxici8+XCIgKyB0aGlzLnRyYW5zKCdTY3JpcHR1cmUgaXMgYXMgZm9sbG93czonLCAn57uP5paH5aaC5LiL77yaJyk7XG4gICAgICAgICAgICBib2R5ICs9XCI8YnIvPlwiICsgaXRlbS5zY3JpcHR1cmU7XG5cbiAgICAgICAgICAgIGJvZHkgKz1cIjxici8+PGJyLz5cIiArIGl0ZW0uc3VtbWFyeTtcblxuICAgICAgICAgICAgZW1haWwuYXZhaWxhYmxlKCkudGhlbiggKGF2YWlsOmJvb2xlYW4pPT57XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBhdmFpbGFibGU/IFwiICsgYXZhaWwpO1xuICAgICAgICAgICAgICAgIGlmKGF2YWlsKXtcbiAgICAgICAgICAgICAgICAgICAgZW1haWwuY29tcG9zZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0OiB0aGlzLnRyYW5zKCdHb29kIGJpYmxlIHNjcmlwdHVyZSB0byBzaGFyZScsICflnKPnu4/nu4/mlofkuI7mgqjliIbkuqsnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGJvZHlcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihyZXN1bHQ9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIGVyZHVsc3QgaXMgJywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbnQgb3V0IFN1Y2Nlc3NmdWxseScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvcj0+Y29uc29sZS5lcnJvcihlcnJvcikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgYXZhaWxhYmxlIGhlcmUgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHVibGljIGJhY2t1cEN1c3RvbURhdGEoKXtcbiAgICAgICAgLy8gbGV0IGRvY3VtZW50cyA9IGtub3duRm9sZGVycy5kb2N1bWVudHMoKTtcbiAgICAgICAgLy8gdmFyIGZvbGRlciA9IGRvY3VtZW50cy5nZXRGb2xkZXIoXCJiYWNrdXBcIik7XG4gICAgICAgIC8vIHZhciBmaWxlID0gIGZvbGRlci5nZXRGaWxlKFwiYmFja3VwLnR4dFwiKTtcblxuICAgICAgICBsZXQgZG9jdW1lbnRzRm9sZGVyID0gZnMua25vd25Gb2xkZXJzLmRvY3VtZW50cygpO1xuICAgICAgICBsZXQgY3VycmVudEFwcEZvbGRlciA9IGZzLmtub3duRm9sZGVycy5jdXJyZW50QXBwKCk7XG4gICAgICAgIGxldCB0ZW1wRm9sZGVyID0gZnMua25vd25Gb2xkZXJzLnRlbXAoKTtcblxuICAgICAgICBsZXQgcGF0aCA9IGZzLnBhdGguam9pbihkb2N1bWVudHNGb2xkZXIucGF0aCwgXCJiYWNrdXAudHh0XCIpO1xuICAgICAgICBsZXQgZmlsZSA9IGZzLkZpbGUuZnJvbVBhdGgocGF0aCk7XG5cbiAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0QWxsKGZ1bmN0aW9uKGl0ZW1zKXtcbiAgICAgICAgICAgIGZpbGUud3JpdGVUZXh0KEpTT04uc3RyaW5naWZ5KGl0ZW1zKSlcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG5cbiAgICAgICAgICAgICAgICBlbWFpbC5hdmFpbGFibGUoKS50aGVuKCAoYXZhaWw6Ym9vbGVhbik9PntcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBhdmFpbGFibGU/IFwiICsgYXZhaWwpO1xuICAgICAgICAgICAgICAgICAgICBpZihhdmFpbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbC5jb21wb3NlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogWydoZXh1ZmVuZ0BnbWFpbC5jb20nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0OiAndGVzdCBhdHRhY2htZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6ICdDdXN0b20gRGF0YSBGaWxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2htZW50czogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogJ2JhY2t1cC50eHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlOiAnYXBwbGljYXRpb24vdGV4dCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ocmVzdWx0PT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbmRpbmcgZXJkdWxzdCBpcyAnLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZW50IG91dCBTdWNjZXNzZnVsbHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvcj0+Y29uc29sZS5lcnJvcihlcnJvcikpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vdCBhdmFpbGFibGUgaGVyZSAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG5cblxuXG4gICAgICAgICAgICAgICAgZmlsZS5yZWFkVGV4dCgpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiU3VjY2Vzc2Z1bGx5IHNhdmVkIGluIFwiICsgZmlsZS5wYXRoKSA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy90cmFuc2xhdGlvbiBwdXJwb3NlXG4gICAgcHJpdmF0ZSBsYW5ndWFnZTpzdHJpbmc7XG4gICAgcHVibGljIHNldExhbmd1YWdlKGxhbjpzdHJpbmcpOnZvaWR7XG4gICAgICAgIHRoaXMubGFuZ3VhZ2UgPSBsYW47XG4gICAgICAgIHNldFN0cmluZyhcImxhbmd1YWdlXCIsIGxhbik7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRMYW5ndWFnZSgpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2U7XG4gICAgfVxuICAgIHB1YmxpYyB0cmFucyhlbjpzdHJpbmcsIHpoOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZT09PSdlbic/ZW46emg7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE5vdGVkSXRlbUZvcih1dWlkOm51bWJlciwgY2Ipe1xuICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5nZXRGYXZvcml0ZUl0ZW1Gb3IodXVpZCwgY2IpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBbGxNeUZhdm9yaXRlZEl0ZW0ocnNzVHlwZTogc3RyaW5nLGNiKXtcbiAgICAgICAgaWYocnNzVHlwZSE9PSdxdCcpe1xuICAgICAgICAgICAgY2IoW10pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldEFsbEZhdm9yaXRlSXRlbXMoaXRlbXM9PntcbiAgICAgICAgICAgICAgICBjYihpdGVtcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgZ2V0QWxsTXlGYXZvcml0ZWRJdGVtU2ltcGxpZmllZChyc3NUeXBlOiBzdHJpbmcsY2Ipe1xuICAgICAgICBpZihyc3NUeXBlIT09J3F0Jyl7XG4gICAgICAgICAgICBjYihbXSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0QWxsRmF2b3JpdGVJdGVtc1NpbXBsaWZpZWQoaXRlbXM9PntcbiAgICAgICAgICAgICAgICBjYihpdGVtcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgZ2V0QWxsTXlOb3RlZEl0ZW0ocnNzVHlwZTogc3RyaW5nLGNiKXtcbiAgICAgICAgaWYocnNzVHlwZSE9PSdxdCcpe1xuICAgICAgICAgICAgY2IoW10pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldEFsbE5vdGVkSXRlbXMoY2IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBnZXRBbGxNeU5vdGVkSXRlbVNpbXBsaWZpZWQocnNzVHlwZTogc3RyaW5nLGNiKXtcbiAgICAgICAgaWYocnNzVHlwZSE9PSdxdCcpe1xuICAgICAgICAgICAgY2IoW10pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldEFsbE5vdGVkSXRlbXNTaW1wbGlmaWVkKGNiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBbGxNeUl0ZW1zKHJzc1R5cGU6c3RyaW5nLCB0eXBlOnN0cmluZywgY2Ipe1xuICAgICAgICBpZihyc3NUeXBlIT09J3F0Jyl7XG4gICAgICAgICAgICBjYihbXSk7XG4gICAgICAgIH1lbHNle1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkTm90ZVRvSXRlbSh1dWlkOm51bWJlcix0aXRsZTpzdHJpbmcsIG5vdGU6c3RyaW5nLCBjYil7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhZGRpbmcgbm90ZTogJywgdXVpZCwgdGl0bGUsIG5vdGUpXG4gICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLnVwZGF0ZUN1c3RvbUl0ZW1Gb3IodXVpZCwgJ3RpdGxlJywgdGl0bGUsIHJlc3VsdD0+e1xuICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UudXBkYXRlQ3VzdG9tSXRlbUZvcih1dWlkLCAnbm90ZScsIG5vdGUsIHJlc3VsdD0+e1xuICAgICAgICAgICAgICAgIGlmKGNiKSBjYigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBmYXZvcml0ZUl0ZW0odXVpZDpudW1iZXIsIGNiKXtcbiAgICAgICAgbGV0IGZhdm9yaXRlID0gMVxuICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5nZXRGYXZvcml0ZUl0ZW1Gb3IodXVpZCwgaXRlbXM9PntcbiAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aD4wKXtcbiAgICAgICAgICAgICAgICBpZihpdGVtc1swXS5mYXZvcml0ZT09MSl7XG4gICAgICAgICAgICAgICAgICAgIGZhdm9yaXRlPTA7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGZhdm9yaXRlPTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UudXBkYXRlQ3VzdG9tSXRlbUZvcih1dWlkLCAnZmF2b3JpdGUnLCBmYXZvcml0ZSwgcmVzdWx0PT57XG4gICAgICAgICAgICAgICAgaWYoY2IpXG4gICAgICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBub3RlSXRlbSh1dWlkOm51bWJlciwgbm90ZTpzdHJpbmcpe1xuICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS51cGRhdGVDdXN0b21JdGVtRm9yKHV1aWQsICdub3RlJywgbm90ZSwgcmVzdWx0PT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzdWx0ICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGYXZvcml0ZWRSc3NPYmplY3RzKGNiKXtcbiAgICAgICAgdGhpcy5wYWdlID0gMTtcbiAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0RmF2b3JpdGVkSXRlbVVVSURzKHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSwgaXRlbVVVSURzPT57XG4gICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRGYXZvcml0ZWRJdGVtc0ZvclVVSURzKGl0ZW1VVUlEcywgcnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbJ3F0J10gPSB0aGlzLl9jcmVhdGVSc3NGcm9tSXRlbXMocnNzSXRlbXMpOztcbiAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNpbXBsaWZpZWRGYXZvcml0ZWRSc3NPYmplY3RzKGNiKXtcbiAgICAgICAgdGhpcy5wYWdlID0gMTtcbiAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0RmF2b3JpdGVkSXRlbVVVSURzKHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSwgaXRlbVVVSURzPT57XG4gICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRTaW1wbGlmaWVkRmF2b3JpdGVkSXRlbXNGb3JVVUlEcyhpdGVtVVVJRHMsIHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddID0gdGhpcy5fY3JlYXRlUnNzRnJvbUl0ZW1zKHJzc0l0ZW1zKTs7XG4gICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IoJ3F0JykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXROb3RlZFJzc09iamVjdHMoY2Ipe1xuICAgICAgICB0aGlzLnBhZ2UgPSAxO1xuICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5nZXROb3RlZHRlbVVVSURzKHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSwgaXRlbVVVSURzPT57XG4gICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRGYXZvcml0ZWRJdGVtc0ZvclVVSURzKGl0ZW1VVUlEcywgcnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbJ3F0J10gPSB0aGlzLl9jcmVhdGVSc3NGcm9tSXRlbXMocnNzSXRlbXMpOztcbiAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNpbXBsaWZpZWROb3RlZFJzc09iamVjdHMoY2Ipe1xuICAgICAgICB0aGlzLnBhZ2UgPSAxO1xuICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5nZXROb3RlZHRlbVVVSURzKHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSwgaXRlbVVVSURzPT57XG4gICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRTaW1wbGlmaWVkTm90ZWRJdGVtc0ZvclVVSURzKGl0ZW1VVUlEcywgcnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbJ3F0J10gPSB0aGlzLl9jcmVhdGVSc3NGcm9tSXRlbXMocnNzSXRlbXMpOztcbiAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHNlYXJjaFJzc09iamVjdHNGb3IocnNzVHlwZTogc3RyaW5nLCBib29rTmFtZXM6U3RyaW5nW10sIHBlcmlvZDphbnksIGNiKXtcblxuICAgICAgICBpZihyc3NUeXBlIT09J3F0Jyl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSc3NPYmplY3RzRm9yKHJzc1R5cGUsIGNiKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAvLzEuIHJlc3RvcmUgdG8gcGFnZSBpc1xuICAgICAgICAgICAgdGhpcy5wYWdlID0gMTtcbiAgICAgICAgICAgIC8vMy4gZG8gc2VhcmNoIGhlcmVcbiAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLnNlYXJjaEl0ZW1zRm9yKGJvb2tOYW1lcyxcbiAgICAgICAgICAgICAgICBwZXJpb2QsIHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSxcbiAgICAgICAgICAgICAgICBpdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbJ3F0J10gPSB0aGlzLl9jcmVhdGVSc3NGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2VhcmNoU2ltcGxpZmllZFJzc09iamVjdHNGb3IocnNzVHlwZTogc3RyaW5nLCBib29rTmFtZXM6U3RyaW5nW10sIHBlcmlvZDphbnksIGNiKXtcblxuICAgICAgICAgICAgaWYocnNzVHlwZSE9PSdxdCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJzc09iamVjdHNGb3IocnNzVHlwZSwgY2IpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgLy8xLiByZXN0b3JlIHRvIHBhZ2UgaXNcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgIC8vMy4gZG8gc2VhcmNoIGhlcmVcbiAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5zZWFyY2hTaW1wbGlmaWVkSXRlbXNGb3IoYm9va05hbWVzLFxuICAgICAgICAgICAgICAgICAgICBwZXJpb2QsIHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVsncXQnXSA9IHRoaXMuX2NyZWF0ZVJzc0Zyb21JdGVtcyhpdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHB1YmxpYyBnZXRSc3NPYmplY3RzRm9yKHJzc1R5cGU6IHN0cmluZywgY2IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgIGlmIChyc3NUeXBlIT0ncXQnICYmIHRoaXMucnNzRGF0YVtyc3NUeXBlXSAmJiAhdGhpcy5faXNFeHBpcmVkKHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLml0ZW1bMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLCB0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jaGVja2luZyBkYXRhYmFzZSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIGlmIChyc3NUeXBlID09PSAncXQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2dldHRpbmcgZmlyc3QgcGFnZSBvbmx5IGZyb20gREJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnZXR0aWduIHFzIGZyb20gZGInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLmdldFBhZ2luYXRlZEl0ZW1zKHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSwgaXRlbXMgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDAgJiYgIXRoaXMuX2lzRXhwaXJlZChpdGVtc1swXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddID0gdGhpcy5fY3JlYXRlUnNzRnJvbUl0ZW1zKGl0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5yc3NEYXRhW3Jzc1R5cGVdLmNoYW5uZWxbMF0sIHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKHJzc1R5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGluIGRiLCBmZXRjaGluZy4uLi4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmV0Y2hEYXRhKHJzc1R5cGUsIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmV0Y2hEYXRhKHJzc1R5cGUsIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHVibGljIGdldFNpbXBsaWZpZWRSc3NPYmplY3RzRm9yKHJzc1R5cGU6IHN0cmluZywgY2IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgIGlmIChyc3NUeXBlIT0ncXQnICYmIHRoaXMucnNzRGF0YVtyc3NUeXBlXSAmJiAhdGhpcy5faXNFeHBpcmVkKHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLml0ZW1bMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLCB0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jaGVja2luZyBkYXRhYmFzZSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIGlmIChyc3NUeXBlID09PSAncXQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2dldHRpbmcgZmlyc3QgcGFnZSBvbmx5IGZyb20gREJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLmdldFNpbXBsaWZpZWRQYWdpbmF0ZWRJdGVtcyh0aGlzLnBhZ2VTaXplLCB0aGlzLnBhZ2UsIGl0ZW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCAmJiAhdGhpcy5faXNFeHBpcmVkKGl0ZW1zWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbJ3F0J10gPSB0aGlzLl9jcmVhdGVSc3NGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXSwgdGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgaW4gZGIsIGZldGNoaW5nLi4uLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mZXRjaERhdGEocnNzVHlwZSwgY2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mZXRjaERhdGEocnNzVHlwZSwgY2IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHB1YmxpYyByZXRyaWV2ZVJzc0l0ZW1Gb3IocnNzVHlwZTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBjYikge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtU2ltcGxpZmllZCA9IHRoaXMuX2dldFJzc0l0ZW1Gb3IocnNzVHlwZSwgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYocnNzVHlwZSE9J3F0Jyl7XG4gICAgICAgICAgICAgICAgICAgIGNiKGl0ZW1TaW1wbGlmaWVkKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0SXRlbUZyb21VVUlEKGl0ZW1TaW1wbGlmaWVkLnV1aWQsIGl0ZW09PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnNjcmlwdFVybCAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgc2NyaXB0dXJlIGV4aXN0ZWQgYWxyZWFkeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnNjcmlwdHVyZSAhPSAnJyAmJiBpdGVtLnNjcmlwdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzY3JpcHR1cmUgZXhpdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0SXRlbShpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JldHJpZXZpbmcgc2NyaXB0dXJlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0TGFuZ3VhZ2UoKT09J2VuJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRTY3JpcHRDb250ZW50RW4oaXRlbSwgY2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldFNjcmlwdENvbnRlbnQoaXRlbSwgY2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0SXRlbShpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYihpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHVibGljIG5leHRGYXZvcml0ZVBhZ2UoY2Ipe1xuICAgICAgICAgICAgICAgIHZhciBuZXh0UGFnZT0gdGhpcy5wYWdlKzE7XG4gICAgICAgICAgICAgICAgdmFyIHJzc0l0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0RmF2b3JpdGVkSXRlbXModGhpcy5wYWdlU2l6ZSwgbmV4dFBhZ2UsIGl0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtVVVJRHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtVVVJRHMucHVzaChpdGVtLnV1aWQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbXMubGVuZ3RoPT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKCdxdCcpKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRGYXZvcml0ZWRJdGVtc0ZvclVVSURzKGl0ZW1VVUlEcywgcnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByc3NJdGVtcy5mb3JFYWNoKHRtcD0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoZW4gcG9wdWxhdGluZyBpbnRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbJ3F0J10uY2hhbm5lbFswXS5pdGVtLnB1c2godG1wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJzc0l0ZW1zLmxlbmd0aD4wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKCdxdCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHB1YmxpYyBuZXh0U2ltcGxpZmllZEZhdm9yaXRlUGFnZShjYil7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRQYWdlPSB0aGlzLnBhZ2UrMTtcbiAgICAgICAgICAgICAgICB2YXIgcnNzSXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5nZXRTaW1wbGlmaWVkRmF2b3JpdGVkSXRlbXModGhpcy5wYWdlU2l6ZSwgbmV4dFBhZ2UsIGl0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtVVVJRHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtVVVJRHMucHVzaChpdGVtLnV1aWQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbXMubGVuZ3RoPT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKCdxdCcpKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRTaW1wbGlmaWVkRmF2b3JpdGVkSXRlbXNGb3JVVUlEcyhpdGVtVVVJRHMsIHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNzSXRlbXMuZm9yRWFjaCh0bXA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHBvcHVsYXRpbmcgaW50byB0aGUgZGF0YSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddLmNoYW5uZWxbMF0uaXRlbS5wdXNoKHRtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihyc3NJdGVtcy5sZW5ndGg+MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwdWJsaWMgbmV4dE5vdGVkUGFnZShjYil7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRQYWdlPSB0aGlzLnBhZ2UrMTtcbiAgICAgICAgICAgICAgICB2YXIgcnNzSXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5nZXROb3RlZEl0ZW1zKHRoaXMucGFnZVNpemUsIG5leHRQYWdlLCBpdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbVVVSURzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVVVSURzLnB1c2goaXRlbS51dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aD09MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0RmF2b3JpdGVkSXRlbXNGb3JVVUlEcyhpdGVtVVVJRHMsIHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNzSXRlbXMuZm9yRWFjaCh0bXA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHBvcHVsYXRpbmcgaW50byB0aGUgZGF0YSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddLmNoYW5uZWxbMF0uaXRlbS5wdXNoKHRtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihyc3NJdGVtcy5sZW5ndGg+MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwdWJsaWMgbmV4dFNpbXBsaWZpZWROb3RlZFBhZ2UoY2Ipe1xuICAgICAgICAgICAgICAgIHZhciBuZXh0UGFnZT0gdGhpcy5wYWdlKzE7XG4gICAgICAgICAgICAgICAgdmFyIHJzc0l0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0U2ltcGxpZmllZE5vdGVkSXRlbXModGhpcy5wYWdlU2l6ZSwgbmV4dFBhZ2UsIGl0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtVVVJRHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtVVVJRHMucHVzaChpdGVtLnV1aWQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbXMubGVuZ3RoPT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKCdxdCcpKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRTaW1wbGlmaWVkTm90ZWRJdGVtc0ZvclVVSURzKGl0ZW1VVUlEcywgcnNzSXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByc3NJdGVtcy5mb3JFYWNoKHRtcD0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoZW4gcG9wdWxhdGluZyBpbnRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbJ3F0J10uY2hhbm5lbFswXS5pdGVtLnB1c2godG1wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJzc0l0ZW1zLmxlbmd0aD4wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKCdxdCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHB1YmxpYyBuZXh0U2VhcmNoUGFnZUZvcihyc3NUeXBlOiBzdHJpbmcsIGJvb2tOYW1lczpTdHJpbmdbXSwgcGVyaW9kOmFueSwgY2Ipe1xuXG4gICAgICAgICAgICAgICAgdmFyIG5leHRQYWdlPSB0aGlzLnBhZ2UrMTtcbiAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSA9PSAncXQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZm9yIFFULCB3ZSByZWFkIGZyb20gREIgZm9yIG5leHQgcGFnZVxuICAgICAgICAgICAgICAgICAgICAvLzMuIGRvIHNlYXJjaCBoZXJlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLnNlYXJjaEl0ZW1zRm9yKGJvb2tOYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZCwgdGhpcy5wYWdlU2l6ZSwgbmV4dFBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlbiBwb3B1bGF0aW5nIGludG8gdGhlIGRhdGEgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLml0ZW0ucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtcy5sZW5ndGg+MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKHJzc1R5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHB1YmxpYyBuZXh0U2ltcGxpZmllZFNlYXJjaFBhZ2VGb3IocnNzVHlwZTogc3RyaW5nLCBib29rTmFtZXM6U3RyaW5nW10sIHBlcmlvZDphbnksIGNiKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dFBhZ2U9IHRoaXMucGFnZSsxO1xuICAgICAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSA9PSAncXQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2ZvciBRVCwgd2UgcmVhZCBmcm9tIERCIGZvciBuZXh0IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vMy4gZG8gc2VhcmNoIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLnNlYXJjaFNpbXBsaWZpZWRJdGVtc0Zvcihib29rTmFtZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLCB0aGlzLnBhZ2VTaXplLCBuZXh0UGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHBvcHVsYXRpbmcgaW50byB0aGUgZGF0YSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLml0ZW0ucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aD4wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwdWJsaWMgbmV4dFBhZ2VGb3IocnNzVHlwZTogc3RyaW5nLCBjYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSA9PSAncXQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9mb3IgUVQsIHdlIHJlYWQgZnJvbSBEQiBmb3IgbmV4dCBwYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0UGFnaW5hdGVkSXRlbXModGhpcy5wYWdlU2l6ZSwgdGhpcy5wYWdlLCBpdGVtcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoZW4gcG9wdWxhdGluZyBpbnRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhW3Jzc1R5cGVdLmNoYW5uZWxbMF0uaXRlbS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpYyBuZXh0U2ltcGxpZmllZFBhZ2VGb3IocnNzVHlwZTogc3RyaW5nLCBjYil7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyc3NUeXBlID09ICdxdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2ZvciBRVCwgd2UgcmVhZCBmcm9tIERCIGZvciBuZXh0IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRTaW1wbGlmaWVkUGFnaW5hdGVkSXRlbXModGhpcy5wYWdlU2l6ZSwgdGhpcy5wYWdlLCBpdGVtcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoZW4gcG9wdWxhdGluZyBpbnRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhW3Jzc1R5cGVdLmNoYW5uZWxbMF0uaXRlbS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwdWJsaWMgZ2V0Qm9va0xpc3QoY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLmdldEJvb2tMaXN0KGl0ZW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYihpdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgX2dldFBhZ2luYXRlZEl0ZW1zRm9yKHJzc1R5cGU6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLml0ZW0uc2xpY2UoMCwgdGhpcy5wYWdlICogdGhpcy5wYWdlU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcml2YXRlIF9nZXRTY3JpcHRDb250ZW50KGl0ZW06IEl0ZW0sIGNiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gaXRlbS5zY3JpcHRVcmwuaW5kZXhPZigndmVyc2lvbj0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBpdGVtLnNjcmlwdFVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgcG9zKzgpICsgJ0NVVk1QUyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3IHVybCBpcyAnLCB1cmwpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFNlcnZpY2UuZ2V0UmF3RGF0YSh1cmwpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRpbmdQb3MgPSBkYXRhLmluZGV4T2YoJzxkaXYgY2xhc3M9XCJwYXNzYWdlLXRleHRcIj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kaW5nUG9zID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydGluZ1BvcyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kaW5nUG9zID0gZGF0YS5sYXN0SW5kZXhPZignPC9zcGFuPjwvcD4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGRhdGEuc3Vic3RyaW5nKHN0YXJ0aW5nUG9zLCBlbmRpbmdQb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJoMVwiLCAnZycpLCAnaDMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKCdDaGluZXNlIFVuaW9uIFZlcnNpb24gTW9kZXJuIFB1bmN0dWF0aW9uIChTaW1wbGlmaWVkKSAoQ1VWTVBTKScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNjcmlwdHVyZSA9IFwiPGRpdiBzdHlsZT0nZm9udC1zaXplOjE2cHgnPlwiKyBjb250ZW50K1wiPC9kaXY+XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL29uY2UgcmV0cml2ZWQgc2NyaXB0dXJlLCB3ZSBzYXZlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRiU2VydmljZS51cGRhdGVJdGVtU2NyaXB0KGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgX2dldFNjcmlwdENvbnRlbnRFbihpdGVtOiBJdGVtLCBjYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJzEyMyBnZXR0aW5nIGVuZ2xpc2ggdXJsIGlzPT0+OiAnLCBpdGVtLnNjcmlwdFVybCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBpdGVtLnNjcmlwdFVybC5pbmRleE9mKCd2ZXJzaW9uPScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IGl0ZW0uc2NyaXB0VXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cmluZygwLCBwb3MrOCkgKyAnTklWJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyMyBuZXcgdXJsIGlzICcsIHVybCk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0U2VydmljZS5nZXRSYXdEYXRhKHVybClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydGluZ1BvcyA9IGRhdGEuaW5kZXhPZignPGRpdiBjbGFzcz1cInBhc3NhZ2UtdGV4dFwiPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmRpbmdQb3MgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0aW5nUG9zID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRpbmdQb3MgPSBkYXRhLmxhc3RJbmRleE9mKCc8L3NwYW4+PC9wPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gZGF0YS5zdWJzdHJpbmcoc3RhcnRpbmdQb3MsIGVuZGluZ1Bvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UobmV3IFJlZ0V4cChcImgxXCIsICdnJyksICdoMycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoJ05ldyBJbnRlcm5hdGlvbmFsIFZlcnNpb24gKE5JViknLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zY3JpcHR1cmUgPSBcIjxkaXYgc3R5bGU9J2ZvbnQtc2l6ZToxNnB4Jz5cIisgY29udGVudCArXCI8L2Rpdj5cIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb25jZSByZXRyaXZlZCBzY3JpcHR1cmUsIHdlIHNhdmUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGJTZXJ2aWNlLnVwZGF0ZUl0ZW1TY3JpcHQoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgX2dldFJzc0l0ZW1Gb3IocnNzVHlwZTogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogSXRlbSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yc3NEYXRhW3Jzc1R5cGVdLmNoYW5uZWxbMF0uaXRlbVtpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcml2YXRlIF9pc0V4cGlyZWQoaXRlbTogSXRlbSk6IGJvb2xlYW4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRkOiBhbnkgPSB0b2RheS5nZXREYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW06IGFueSA9IHRvZGF5LmdldE1vbnRoKCkgKyAxOyAvL0phbnVhcnkgaXMgMCFcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHl5eXk6IGFueSA9IHRvZGF5LmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGQgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRkID0gJzAnICsgZGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW0gPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1tID0gJzAnICsgbW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoeXl5eSArICctJyArIG1tICsgJy0nICsgZGQpICE9PSBpdGVtLnB1YkRhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBfY3JlYXRlUnNzRnJvbUl0ZW1zKGl0ZW1zOiBJdGVtW10pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJzczogUnNzID0gbmV3IFJzcygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hhbm5lbDogQ2hhbm5lbCA9IG5ldyBDaGFubmVsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hhbm5lbEltYWdlOiBDaGFubmVsSW1hZ2UgPSBuZXcgQ2hhbm5lbEltYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsSW1hZ2UudXJsID0gJ2h0dHA6Ly9ob2M1Lm5ldC9xdC9Qb2RjYXN0R2VuZXJhdG9yL2ltYWdlcy9pdHVuZXNfaW1hZ2UucG5nJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWxJbWFnZS50aXRsZSA9ICdRdWlldCBUaW1lIOmdiOS/ruaTjee3tCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsSW1hZ2UubGluayA9ICdodHRwOi8vaG9jNS5uZXQvcXQvUG9kY2FzdEdlbmVyYXRvci8nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsLnRpdGxlID0gdGhpcy5nZXRMYW5ndWFnZSgpPT0nZW4nPydRdWlldCBUaW1lJzon6Z2I5L+u5pON57e0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWwuZGVzY3JpcHRpb24gPSB0aGlzLmdldExhbmd1YWdlKCk9PSdlbic/J0ZvciBldmVyeSByZWJvcm4gQ2hyaXN0aWFuLCB0aGVyZSBzaG91bGQgYmUgb25lIG5ldyB0aGluZyBhZGRlZCB0byBoaXMgbGlmZSwgUXVpZXQgVGltZSB3aXRoIEdvZC4gVGhpcyBpcyBub3Qgb25seSBhIHB1cmUgcXVpZXQgdGltZSwgYnV0IGFsc28gYSBob2x5IHBlcmlvZCB3aXRoIEdvZC4gJzogJ+avj+S4gOWAi+mHjeeUn+W+l+aVkeeahOWfuuedo+W+ku+8jOWcqOS7luavj+WkqeeahOeUn+a0u+ijj+WwseWkmuS6huS4gOaoo+aWsOS6i++8jOWwseaYr+OAjOmdiOS/rueUn+a0u+OAje+8jOWug+S4jeWPquaYr+WAi+WuiemdnOeahOaZguWIuyAoUXVpZXQgdGltZSnvvIzkuZ/mmK/lgIvmlazomZTnmoTmmYLplpPvvIzmm7TmmK/lgIvoiIfnpZ7njajomZXnmoTmmYLlhYnjgIInO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbC5pbWFnZSA9IGNoYW5uZWxJbWFnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWwuc3VtbWFyeSA9IHRoaXMuZ2V0TGFuZ3VhZ2UoKT09J2VuJz8nRm9yIGV2ZXJ5IHJlYm9ybiBDaHJpc3RpYW4sIHRoZXJlIHNob3VsZCBiZSBvbmUgbmV3IHRoaW5nIGFkZGVkIHRvIGhpcyBsaWZlLCBRdWlldCBUaW1lIHdpdGggR29kLiBUaGlzIGlzIG5vdCBvbmx5IGEgcHVyZSBxdWlldCB0aW1lLCBidXQgYWxzbyBhIGhvbHkgcGVyaW9kIHdpdGggR29kLiAnOiAn5q+P5LiA5YCL6YeN55Sf5b6X5pWR55qE5Z+6552j5b6S77yM5Zyo5LuW5q+P5aSp55qE55Sf5rS76KOP5bCx5aSa5LqG5LiA5qij5paw5LqL77yM5bCx5piv44CM6Z2I5L+u55Sf5rS744CN77yM5a6D5LiN5Y+q5piv5YCL5a6J6Z2c55qE5pmC5Yi7IChRdWlldCB0aW1lKe+8jOS5n+aYr+WAi+aVrOiZlOeahOaZgumWk++8jOabtOaYr+WAi+iIh+elnueNqOiZleeahOaZguWFieOAgic7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsLmxpbmsgPSAnaHR0cDovL2hvYzUubmV0L3F0L1BvZGNhc3RHZW5lcmF0b3IvJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWwuaXRlbSA9IGl0ZW1zO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByc3MuY2hhbm5lbCA9IFtjaGFubmVsXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJzcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgX2ZldGNoRGF0YShyc3NUeXBlLCBjYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0U2VydmljZS5nZXRSYXdEYXRhKHRoaXMuY29uZmlnU2VydmljZS5nZXRGZWVkVXJscygpW3Jzc1R5cGVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlU3RyaW5nKGRhdGEsIChlcnIsIHJlc3VsdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByc3MgPSBuZXcgUnNzKHJlc3VsdCwgcnNzVHlwZSwgdGhpcy5nZXRMYW5ndWFnZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbcnNzVHlwZV0gPSByc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLCB0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb25jZSBjYWxsIGJhY2ssIHJlbW92ZSB0aGUgZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rlc3Ryb3llZCBkYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc2F2aW5nIHRvIGRiIGluIGRpZmZlcmVudCB0aHJlYWQsIHRvIGF2b2lkIGJsb2NraW5nIHVzZXIgZXhwZXJpZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSA9PT0gJ3F0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5hZGRJdGVtcyhyc3MsICgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hZnRlciBhZGRpbmcgYWxsIGRhdGEsIHdlIGNhbiByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMucnNzRGF0YVtyc3NUeXBlXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2Rlc3Ryb3llZCBhbGwgZGF0YSBmcm9tIG1lbW9yeScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgfVxuIl19