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
                    cb(favorite);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyc3Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUN6Qyw4REFBeUQ7QUFDekQsZ0VBQTREO0FBQzVELDJDQUF1QztBQUN2Qyx5REFBb0Q7QUFDcEQsMkRBQTJEO0FBQzNELGdDQUFrQztBQUNsQyxpREFBc0U7QUFDdEUsNkRBVThCO0FBRTlCLDBDQUE0QztBQUM1Qyx1REFBeUQ7QUFFekQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsV0FBVyxDQUFDO0FBRzdEO0lBY0ksb0JBQW9CLGFBQTRCLEVBQ3BDLGNBQThCLEVBQzlCLFNBQW9CLEVBQ3BCLGVBQStCO1FBSHZCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQ3BDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUd2QyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0lBZk0sNEJBQU8sR0FBZCxVQUFlLElBQVM7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNNLDRCQUFPLEdBQWQ7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBWU0sMEJBQUssR0FBWixVQUFhLElBQUksRUFBRSxJQUFJO1FBQXZCLGlCQXNDQztRQXJDRyxFQUFFLENBQUEsQ0FBQyxJQUFJLElBQUUsUUFBUSxDQUFDLENBQUEsQ0FBQztZQUNmLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFB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QztnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQzlCLHFFQUFxRTtnQkFDckUsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQztvQkFDckIsVUFBVSxDQUFDO3dCQUNQLEtBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTs0QkFDekIseUNBQXlDOzRCQUN6Qyw2QkFBNkI7NEJBQzdCLGdEQUFnRDt3QkFDcEQsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFwcUJSLFVBQVU7UUFEdEIsaUJBQVUsRUFBRTt5Q0FlMEIsOEJBQWE7WUFDcEIsZ0NBQWM7WUFDbkIsc0JBQVM7WUFDSixtQ0FBZTtPQWpCbEMsVUFBVSxDQXVxQk47SUFBRCxpQkFBQztDQUFBLEFBdnFCakIsSUF1cUJpQjtBQXZxQkosZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge0NvbmZpZ1NlcnZpY2V9IGZyb20gJy4uL3V0aWxpdGllcy9jb25maWcuc2VydmljZSdcbmltcG9ydCB7UmVxdWVzdFNlcnZpY2V9IGZyb20gJy4uL3V0aWxpdGllcy9yZXF1ZXN0LnNlcnZpY2UnO1xuaW1wb3J0IHtEYlNlcnZpY2V9IGZyb20gJy4vZGIuc2VydmljZSc7XG5pbXBvcnQge0N1c3RvbURiU2VydmljZX0gZnJvbSAnLi9jdXN0b21fZGIuc2VydmljZSc7XG4vL2ltcG9ydCB7IGtub3duRm9sZGVycywgRmlsZSwgRm9sZGVyIH0gZnJvbSBcImZpbGUtc3lzdGVtXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZmlsZS1zeXN0ZW1cIjtcbmltcG9ydCB7UnNzLCBDaGFubmVsLCBDaGFubmVsSW1hZ2UsIEl0ZW19IGZyb20gJy4uL2VudGl0aWVzL2VudGl0aWVzJztcbmltcG9ydCB7XG4gICAgZ2V0Qm9vbGVhbixcbiAgICBzZXRCb29sZWFuLFxuICAgIGdldE51bWJlcixcbiAgICBzZXROdW1iZXIsXG4gICAgZ2V0U3RyaW5nLFxuICAgIHNldFN0cmluZyxcbiAgICBoYXNLZXksXG4gICAgcmVtb3ZlLFxuICAgIGNsZWFyXG59IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuXG5pbXBvcnQgKiBhcyBlbWFpbCBmcm9tIFwibmF0aXZlc2NyaXB0LWVtYWlsXCI7XG5pbXBvcnQgKiBhcyBTb2NpYWxTaGFyZSBmcm9tIFwibmF0aXZlc2NyaXB0LXNvY2lhbC1zaGFyZVwiO1xuXG52YXIgcGFyc2VTdHJpbmcgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQteG1sMmpzJykucGFyc2VTdHJpbmc7XG5kZWNsYXJlIGZ1bmN0aW9uIHVuZXNjYXBlKHM6c3RyaW5nKTogc3RyaW5nO1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJzc1NlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSByc3NEYXRhO1xuICAgIHByaXZhdGUgcGFnZTogbnVtYmVyO1xuICAgIHB1YmxpYyBwYWdlU2l6ZTogbnVtYmVyO1xuXG4gICAgcHJpdmF0ZSBpdGVtOkl0ZW07XG5cbiAgICBwdWJsaWMgc2V0SXRlbShpdGVtOkl0ZW0pe1xuICAgICAgICB0aGlzLml0ZW09aXRlbTtcbiAgICB9XG4gICAgcHVibGljIGdldEl0ZW0oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWdTZXJ2aWNlOiBDb25maWdTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJlcXVlc3RTZXJ2aWNlOiBSZXF1ZXN0U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBkYlNlcnZpY2U6IERiU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBjdXN0b21EYlNlcnZpY2U6Q3VzdG9tRGJTZXJ2aWNlXG4gICAgKSB7XG5cbiAgICAgICAgdGhpcy5wYWdlU2l6ZSA9IDUwO1xuICAgICAgICB0aGlzLnJzc0RhdGEgPSB7fTtcbiAgICAgICAgdGhpcy5sYW5ndWFnZSA9IHRoaXMuY29uZmlnU2VydmljZS5nZXREZWZhdWx0TGFuZ3VhZ2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hhcmUodHlwZSwgaXRlbSl7XG4gICAgICAgIGlmKHR5cGU9PSdzb2NpYWwnKXtcbiAgICAgICAgICAgIFNvY2lhbFNoYXJlLnNoYXJlVXJsKGl0ZW0ubGluaywgaXRlbS50aXRsZSArJyAnKyBpdGVtLnN1YlRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZih0eXBlID0gJ2VtYWlsJyl7XG4gICAgICAgICAgICB2YXIgYm9keSA9ICB0aGlzLnRyYW5zKFwiSGVsbG8sIEkgd291bGQgbGlrZSB0byBzaGFyZSBzb21lIGdvb2QgYmlibGUgaW5mb3JtYXRpb24gd2l0aCB5b3UuXCIsIFwi5L2g5aW977yMIOaIkeW4jOacm+S4juaCqOWIhuS6q+S7peS4i+e+juWlveeahOWco+e7j+e7j+aWh+WPiuS/oeaBr+OAglwiKTtcblxuICAgICAgICAgICAgYm9keSArPSBcIjxici8+PGJyLz48YSBocmVmPSdcIisgaXRlbS5lbmNsb3N1cmVfbGluaytcIic+XCIrdGhpcy50cmFucygnQ2xpY2sgdG8gaGVhciB0aGUgcmVjb3JkaW5nLicsICfngrnlh7vku6XmlLblkKzlvZXpn7PjgIInKStcIjwvYT5cIjtcbiAgICAgICAgICAgIGJvZHkgKz0gXCI8YnIvPlwiICsgdGhpcy50cmFucygnQ29weSBiZWxvdyBsaW5rIHRvIGJyb3dzZXIgYWRkcmVzcyBiYXIgZGlyZWN0bHkgaWYgYWJvdmUgbGluayBub3Qgd29yaycsICflpoLmnpzku6XkuIrpk77mjqXml6DmlYjvvIzor7fnspjotLTku6XkuIvpk77mjqXkuo7mtY/op4jlmajlnLDlnYDmoYbjgIInKTtcbiAgICAgICAgICAgIGJvZHkgKz0gXCI8YnIvPlwiICsgaXRlbS5lbmNsb3N1cmVfbGluaztcblxuICAgICAgICAgICAgYm9keSArPSBcIjxici8+PGJyLz5cIisgaXRlbS50aXRsZTtcbiAgICAgICAgICAgIGJvZHkgKz0gXCI8YnIvPjxici8+XCIrIGl0ZW0uc3ViVGl0bGU7XG5cbiAgICAgICAgICAgIGJvZHkgKz1cIjxici8+PGJyLz5cIiArIHRoaXMudHJhbnMoJ1NjcmlwdHVyZSBpcyBhcyBmb2xsb3dzOicsICfnu4/mloflpoLkuIvvvJonKTtcbiAgICAgICAgICAgIGJvZHkgKz1cIjxici8+XCIgKyBpdGVtLnNjcmlwdHVyZTtcblxuICAgICAgICAgICAgYm9keSArPVwiPGJyLz48YnIvPlwiICsgaXRlbS5zdW1tYXJ5O1xuXG4gICAgICAgICAgICBlbWFpbC5hdmFpbGFibGUoKS50aGVuKCAoYXZhaWw6Ym9vbGVhbik9PntcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIGF2YWlsYWJsZT8gXCIgKyBhdmFpbCk7XG4gICAgICAgICAgICAgICAgaWYoYXZhaWwpe1xuICAgICAgICAgICAgICAgICAgICBlbWFpbC5jb21wb3NlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMudHJhbnMoJ0dvb2QgYmlibGUgc2NyaXB0dXJlIHRvIHNoYXJlJywgJ+Wco+e7j+e7j+aWh+S4juaCqOWIhuS6qycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogYm9keVxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHJlc3VsdD0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbmRpbmcgZXJkdWxzdCBpcyAnLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VudCBvdXQgU3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yPT5jb25zb2xlLmVycm9yKGVycm9yKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vdCBhdmFpbGFibGUgaGVyZSAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgYmFja3VwQ3VzdG9tRGF0YSgpe1xuICAgICAgICAvLyBsZXQgZG9jdW1lbnRzID0ga25vd25Gb2xkZXJzLmRvY3VtZW50cygpO1xuICAgICAgICAvLyB2YXIgZm9sZGVyID0gZG9jdW1lbnRzLmdldEZvbGRlcihcImJhY2t1cFwiKTtcbiAgICAgICAgLy8gdmFyIGZpbGUgPSAgZm9sZGVyLmdldEZpbGUoXCJiYWNrdXAudHh0XCIpO1xuXG4gICAgICAgIGxldCBkb2N1bWVudHNGb2xkZXIgPSBmcy5rbm93bkZvbGRlcnMuZG9jdW1lbnRzKCk7XG4gICAgICAgIGxldCBjdXJyZW50QXBwRm9sZGVyID0gZnMua25vd25Gb2xkZXJzLmN1cnJlbnRBcHAoKTtcbiAgICAgICAgbGV0IHRlbXBGb2xkZXIgPSBmcy5rbm93bkZvbGRlcnMudGVtcCgpO1xuXG4gICAgICAgIGxldCBwYXRoID0gZnMucGF0aC5qb2luKGRvY3VtZW50c0ZvbGRlci5wYXRoLCBcImJhY2t1cC50eHRcIik7XG4gICAgICAgIGxldCBmaWxlID0gZnMuRmlsZS5mcm9tUGF0aChwYXRoKTtcblxuICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5nZXRBbGwoZnVuY3Rpb24oaXRlbXMpe1xuICAgICAgICAgICAgZmlsZS53cml0ZVRleHQoSlNPTi5zdHJpbmdpZnkoaXRlbXMpKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcblxuICAgICAgICAgICAgICAgIGVtYWlsLmF2YWlsYWJsZSgpLnRoZW4oIChhdmFpbDpib29sZWFuKT0+e1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIGF2YWlsYWJsZT8gXCIgKyBhdmFpbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGF2YWlsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsLmNvbXBvc2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBbJ2hleHVmZW5nQGdtYWlsLmNvbSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3Q6ICd0ZXN0IGF0dGFjaG1ldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogJ0N1c3RvbSBEYXRhIEZpbGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiAnYmFja3VwLnR4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6ICdhcHBsaWNhdGlvbi90ZXh0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbihyZXN1bHQ9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VuZGluZyBlcmR1bHN0IGlzICcsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbnQgb3V0IFN1Y2Nlc3NmdWxseScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yPT5jb25zb2xlLmVycm9yKGVycm9yKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGF2YWlsYWJsZSBoZXJlICcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cblxuXG5cbiAgICAgICAgICAgICAgICBmaWxlLnJlYWRUZXh0KClcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJTdWNjZXNzZnVsbHkgc2F2ZWQgaW4gXCIgKyBmaWxlLnBhdGgpIDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvL3RyYW5zbGF0aW9uIHB1cnBvc2VcbiAgICBwcml2YXRlIGxhbmd1YWdlOnN0cmluZztcbiAgICBwdWJsaWMgc2V0TGFuZ3VhZ2UobGFuOnN0cmluZyk6dm9pZHtcbiAgICAgICAgdGhpcy5sYW5ndWFnZSA9IGxhbjtcbiAgICAgICAgc2V0U3RyaW5nKFwibGFuZ3VhZ2VcIiwgbGFuKTtcbiAgICB9XG4gICAgcHVibGljIGdldExhbmd1YWdlKCk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZTtcbiAgICB9XG4gICAgcHVibGljIHRyYW5zKGVuOnN0cmluZywgemg6c3RyaW5nKTpzdHJpbmd7XG4gICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlPT09J2VuJz9lbjp6aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Tm90ZWRJdGVtRm9yKHV1aWQ6bnVtYmVyLCBjYil7XG4gICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldEZhdm9yaXRlSXRlbUZvcih1dWlkLCBjYik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFsbE15RmF2b3JpdGVkSXRlbShyc3NUeXBlOiBzdHJpbmcsY2Ipe1xuICAgICAgICBpZihyc3NUeXBlIT09J3F0Jyl7XG4gICAgICAgICAgICBjYihbXSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0QWxsRmF2b3JpdGVJdGVtcyhpdGVtcz0+e1xuICAgICAgICAgICAgICAgIGNiKGl0ZW1zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBnZXRBbGxNeUZhdm9yaXRlZEl0ZW1TaW1wbGlmaWVkKHJzc1R5cGU6IHN0cmluZyxjYil7XG4gICAgICAgIGlmKHJzc1R5cGUhPT0ncXQnKXtcbiAgICAgICAgICAgIGNiKFtdKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5nZXRBbGxGYXZvcml0ZUl0ZW1zU2ltcGxpZmllZChpdGVtcz0+e1xuICAgICAgICAgICAgICAgIGNiKGl0ZW1zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBnZXRBbGxNeU5vdGVkSXRlbShyc3NUeXBlOiBzdHJpbmcsY2Ipe1xuICAgICAgICBpZihyc3NUeXBlIT09J3F0Jyl7XG4gICAgICAgICAgICBjYihbXSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0QWxsTm90ZWRJdGVtcyhjYik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGdldEFsbE15Tm90ZWRJdGVtU2ltcGxpZmllZChyc3NUeXBlOiBzdHJpbmcsY2Ipe1xuICAgICAgICBpZihyc3NUeXBlIT09J3F0Jyl7XG4gICAgICAgICAgICBjYihbXSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0QWxsTm90ZWRJdGVtc1NpbXBsaWZpZWQoY2IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFsbE15SXRlbXMocnNzVHlwZTpzdHJpbmcsIHR5cGU6c3RyaW5nLCBjYil7XG4gICAgICAgIGlmKHJzc1R5cGUhPT0ncXQnKXtcbiAgICAgICAgICAgIGNiKFtdKTtcbiAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhZGROb3RlVG9JdGVtKHV1aWQ6bnVtYmVyLHRpdGxlOnN0cmluZywgbm90ZTpzdHJpbmcsIGNiKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2FkZGluZyBub3RlOiAnLCB1dWlkLCB0aXRsZSwgbm90ZSlcbiAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UudXBkYXRlQ3VzdG9tSXRlbUZvcih1dWlkLCAndGl0bGUnLCB0aXRsZSwgcmVzdWx0PT57XG4gICAgICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS51cGRhdGVDdXN0b21JdGVtRm9yKHV1aWQsICdub3RlJywgbm90ZSwgcmVzdWx0PT57XG4gICAgICAgICAgICAgICAgaWYoY2IpIGNiKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGZhdm9yaXRlSXRlbSh1dWlkOm51bWJlciwgY2Ipe1xuICAgICAgICBsZXQgZmF2b3JpdGUgPSAxXG4gICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldEZhdm9yaXRlSXRlbUZvcih1dWlkLCBpdGVtcz0+e1xuICAgICAgICAgICAgaWYoaXRlbXMubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgIGlmKGl0ZW1zWzBdLmZhdm9yaXRlPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgZmF2b3JpdGU9MDtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgZmF2b3JpdGU9MTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS51cGRhdGVDdXN0b21JdGVtRm9yKHV1aWQsICdmYXZvcml0ZScsIGZhdm9yaXRlLCByZXN1bHQ9PntcbiAgICAgICAgICAgICAgICBpZihjYilcbiAgICAgICAgICAgICAgICBjYihmYXZvcml0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgbm90ZUl0ZW0odXVpZDpudW1iZXIsIG5vdGU6c3RyaW5nKXtcbiAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UudXBkYXRlQ3VzdG9tSXRlbUZvcih1dWlkLCAnbm90ZScsIG5vdGUsIHJlc3VsdD0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coIHJlc3VsdCApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RmF2b3JpdGVkUnNzT2JqZWN0cyhjYil7XG4gICAgICAgIHRoaXMucGFnZSA9IDE7XG4gICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldEZhdm9yaXRlZEl0ZW1VVUlEcyh0aGlzLnBhZ2VTaXplLCB0aGlzLnBhZ2UsIGl0ZW1VVUlEcz0+e1xuICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0RmF2b3JpdGVkSXRlbXNGb3JVVUlEcyhpdGVtVVVJRHMsIHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddID0gdGhpcy5fY3JlYXRlUnNzRnJvbUl0ZW1zKHJzc0l0ZW1zKTs7XG4gICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IoJ3F0JykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTaW1wbGlmaWVkRmF2b3JpdGVkUnNzT2JqZWN0cyhjYil7XG4gICAgICAgIHRoaXMucGFnZSA9IDE7XG4gICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldEZhdm9yaXRlZEl0ZW1VVUlEcyh0aGlzLnBhZ2VTaXplLCB0aGlzLnBhZ2UsIGl0ZW1VVUlEcz0+e1xuICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0U2ltcGxpZmllZEZhdm9yaXRlZEl0ZW1zRm9yVVVJRHMoaXRlbVVVSURzLCByc3NJdGVtcz0+e1xuICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVsncXQnXSA9IHRoaXMuX2NyZWF0ZVJzc0Zyb21JdGVtcyhyc3NJdGVtcyk7O1xuICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKCdxdCcpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Tm90ZWRSc3NPYmplY3RzKGNiKXtcbiAgICAgICAgdGhpcy5wYWdlID0gMTtcbiAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0Tm90ZWR0ZW1VVUlEcyh0aGlzLnBhZ2VTaXplLCB0aGlzLnBhZ2UsIGl0ZW1VVUlEcz0+e1xuICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0RmF2b3JpdGVkSXRlbXNGb3JVVUlEcyhpdGVtVVVJRHMsIHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddID0gdGhpcy5fY3JlYXRlUnNzRnJvbUl0ZW1zKHJzc0l0ZW1zKTs7XG4gICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IoJ3F0JykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTaW1wbGlmaWVkTm90ZWRSc3NPYmplY3RzKGNiKXtcbiAgICAgICAgdGhpcy5wYWdlID0gMTtcbiAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0Tm90ZWR0ZW1VVUlEcyh0aGlzLnBhZ2VTaXplLCB0aGlzLnBhZ2UsIGl0ZW1VVUlEcz0+e1xuICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0U2ltcGxpZmllZE5vdGVkSXRlbXNGb3JVVUlEcyhpdGVtVVVJRHMsIHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddID0gdGhpcy5fY3JlYXRlUnNzRnJvbUl0ZW1zKHJzc0l0ZW1zKTs7XG4gICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IoJ3F0JykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWFyY2hSc3NPYmplY3RzRm9yKHJzc1R5cGU6IHN0cmluZywgYm9va05hbWVzOlN0cmluZ1tdLCBwZXJpb2Q6YW55LCBjYil7XG5cbiAgICAgICAgaWYocnNzVHlwZSE9PSdxdCcpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UnNzT2JqZWN0c0Zvcihyc3NUeXBlLCBjYik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgLy8xLiByZXN0b3JlIHRvIHBhZ2UgaXNcbiAgICAgICAgICAgIHRoaXMucGFnZSA9IDE7XG4gICAgICAgICAgICAvLzMuIGRvIHNlYXJjaCBoZXJlXG4gICAgICAgICAgICB0aGlzLmRiU2VydmljZS5zZWFyY2hJdGVtc0Zvcihib29rTmFtZXMsXG4gICAgICAgICAgICAgICAgcGVyaW9kLCB0aGlzLnBhZ2VTaXplLCB0aGlzLnBhZ2UsXG4gICAgICAgICAgICAgICAgaXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddID0gdGhpcy5fY3JlYXRlUnNzRnJvbUl0ZW1zKGl0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNlYXJjaFNpbXBsaWZpZWRSc3NPYmplY3RzRm9yKHJzc1R5cGU6IHN0cmluZywgYm9va05hbWVzOlN0cmluZ1tdLCBwZXJpb2Q6YW55LCBjYil7XG5cbiAgICAgICAgICAgIGlmKHJzc1R5cGUhPT0ncXQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSc3NPYmplY3RzRm9yKHJzc1R5cGUsIGNiKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIC8vMS4gcmVzdG9yZSB0byBwYWdlIGlzXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICAvLzMuIGRvIHNlYXJjaCBoZXJlXG4gICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2Uuc2VhcmNoU2ltcGxpZmllZEl0ZW1zRm9yKGJvb2tOYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kLCB0aGlzLnBhZ2VTaXplLCB0aGlzLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbJ3F0J10gPSB0aGlzLl9jcmVhdGVSc3NGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwdWJsaWMgZ2V0UnNzT2JqZWN0c0Zvcihyc3NUeXBlOiBzdHJpbmcsIGNiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSE9J3F0JyAmJiB0aGlzLnJzc0RhdGFbcnNzVHlwZV0gJiYgIXRoaXMuX2lzRXhwaXJlZCh0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXS5pdGVtWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICBjYih0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXSwgdGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2tpbmcgZGF0YWJhc2UgZGF0YVxuICAgICAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSA9PT0gJ3F0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9nZXR0aW5nIGZpcnN0IHBhZ2Ugb25seSBmcm9tIERCXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ2V0dGlnbiBxcyBmcm9tIGRiJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRQYWdpbmF0ZWRJdGVtcyh0aGlzLnBhZ2VTaXplLCB0aGlzLnBhZ2UsIGl0ZW1zID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwICYmICF0aGlzLl9pc0V4cGlyZWQoaXRlbXNbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVsncXQnXSA9IHRoaXMuX2NyZWF0ZVJzc0Zyb21JdGVtcyhpdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLCB0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vdCBpbiBkYiwgZmV0Y2hpbmcuLi4uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZldGNoRGF0YShyc3NUeXBlLCBjYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZldGNoRGF0YShyc3NUeXBlLCBjYik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHB1YmxpYyBnZXRTaW1wbGlmaWVkUnNzT2JqZWN0c0Zvcihyc3NUeXBlOiBzdHJpbmcsIGNiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSE9J3F0JyAmJiB0aGlzLnJzc0RhdGFbcnNzVHlwZV0gJiYgIXRoaXMuX2lzRXhwaXJlZCh0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXS5pdGVtWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICBjYih0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXSwgdGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2tpbmcgZGF0YWJhc2UgZGF0YVxuICAgICAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSA9PT0gJ3F0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9nZXR0aW5nIGZpcnN0IHBhZ2Ugb25seSBmcm9tIERCXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRTaW1wbGlmaWVkUGFnaW5hdGVkSXRlbXModGhpcy5wYWdlU2l6ZSwgdGhpcy5wYWdlLCBpdGVtcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDAgJiYgIXRoaXMuX2lzRXhwaXJlZChpdGVtc1swXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddID0gdGhpcy5fY3JlYXRlUnNzRnJvbUl0ZW1zKGl0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5yc3NEYXRhW3Jzc1R5cGVdLmNoYW5uZWxbMF0sIHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKHJzc1R5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGluIGRiLCBmZXRjaGluZy4uLi4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmV0Y2hEYXRhKHJzc1R5cGUsIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmV0Y2hEYXRhKHJzc1R5cGUsIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBwdWJsaWMgcmV0cmlldmVSc3NJdGVtRm9yKHJzc1R5cGU6IHN0cmluZywgaW5kZXg6IG51bWJlciwgY2IpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVNpbXBsaWZpZWQgPSB0aGlzLl9nZXRSc3NJdGVtRm9yKHJzc1R5cGUsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmKHJzc1R5cGUhPSdxdCcpe1xuICAgICAgICAgICAgICAgICAgICBjYihpdGVtU2ltcGxpZmllZCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLmdldEl0ZW1Gcm9tVVVJRChpdGVtU2ltcGxpZmllZC51dWlkLCBpdGVtPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5zY3JpcHRVcmwgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmIHNjcmlwdHVyZSBleGlzdGVkIGFscmVhZHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5zY3JpcHR1cmUgIT0gJycgJiYgaXRlbS5zY3JpcHR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2NyaXB0dXJlIGV4aXRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEl0ZW0oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXRyaWV2aW5nIHNjcmlwdHVyZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdldExhbmd1YWdlKCk9PSdlbicpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0U2NyaXB0Q29udGVudEVuKGl0ZW0sIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRTY3JpcHRDb250ZW50KGl0ZW0sIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEl0ZW0oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHB1YmxpYyBuZXh0RmF2b3JpdGVQYWdlKGNiKXtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFBhZ2U9IHRoaXMucGFnZSsxO1xuICAgICAgICAgICAgICAgIHZhciByc3NJdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldEZhdm9yaXRlZEl0ZW1zKHRoaXMucGFnZVNpemUsIG5leHRQYWdlLCBpdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbVVVSURzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVVVSURzLnB1c2goaXRlbS51dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aD09MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0RmF2b3JpdGVkSXRlbXNGb3JVVUlEcyhpdGVtVVVJRHMsIHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNzSXRlbXMuZm9yRWFjaCh0bXA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHBvcHVsYXRpbmcgaW50byB0aGUgZGF0YSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddLmNoYW5uZWxbMF0uaXRlbS5wdXNoKHRtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihyc3NJdGVtcy5sZW5ndGg+MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwdWJsaWMgbmV4dFNpbXBsaWZpZWRGYXZvcml0ZVBhZ2UoY2Ipe1xuICAgICAgICAgICAgICAgIHZhciBuZXh0UGFnZT0gdGhpcy5wYWdlKzE7XG4gICAgICAgICAgICAgICAgdmFyIHJzc0l0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0U2ltcGxpZmllZEZhdm9yaXRlZEl0ZW1zKHRoaXMucGFnZVNpemUsIG5leHRQYWdlLCBpdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbVVVSURzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVVVSURzLnB1c2goaXRlbS51dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aD09MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0U2ltcGxpZmllZEZhdm9yaXRlZEl0ZW1zRm9yVVVJRHMoaXRlbVVVSURzLCByc3NJdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJzc0l0ZW1zLmZvckVhY2godG1wPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlbiBwb3B1bGF0aW5nIGludG8gdGhlIGRhdGEgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVsncXQnXS5jaGFubmVsWzBdLml0ZW0ucHVzaCh0bXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocnNzSXRlbXMubGVuZ3RoPjApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IoJ3F0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHVibGljIG5leHROb3RlZFBhZ2UoY2Ipe1xuICAgICAgICAgICAgICAgIHZhciBuZXh0UGFnZT0gdGhpcy5wYWdlKzE7XG4gICAgICAgICAgICAgICAgdmFyIHJzc0l0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5jdXN0b21EYlNlcnZpY2UuZ2V0Tm90ZWRJdGVtcyh0aGlzLnBhZ2VTaXplLCBuZXh0UGFnZSwgaXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1VVUlEcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW09PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1VVUlEcy5wdXNoKGl0ZW0udXVpZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZihpdGVtcy5sZW5ndGg9PTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IoJ3F0JykpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLmdldEZhdm9yaXRlZEl0ZW1zRm9yVVVJRHMoaXRlbVVVSURzLCByc3NJdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJzc0l0ZW1zLmZvckVhY2godG1wPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlbiBwb3B1bGF0aW5nIGludG8gdGhlIGRhdGEgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVsncXQnXS5jaGFubmVsWzBdLml0ZW0ucHVzaCh0bXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocnNzSXRlbXMubGVuZ3RoPjApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IoJ3F0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHVibGljIG5leHRTaW1wbGlmaWVkTm90ZWRQYWdlKGNiKXtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFBhZ2U9IHRoaXMucGFnZSsxO1xuICAgICAgICAgICAgICAgIHZhciByc3NJdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmdldFNpbXBsaWZpZWROb3RlZEl0ZW1zKHRoaXMucGFnZVNpemUsIG5leHRQYWdlLCBpdGVtcz0+e1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbVVVSURzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVVVSURzLnB1c2goaXRlbS51dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aD09MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0U2ltcGxpZmllZE5vdGVkSXRlbXNGb3JVVUlEcyhpdGVtVVVJRHMsIHJzc0l0ZW1zPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNzSXRlbXMuZm9yRWFjaCh0bXA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHBvcHVsYXRpbmcgaW50byB0aGUgZGF0YSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhWydxdCddLmNoYW5uZWxbMF0uaXRlbS5wdXNoKHRtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihyc3NJdGVtcy5sZW5ndGg+MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0ZvcigncXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwdWJsaWMgbmV4dFNlYXJjaFBhZ2VGb3IocnNzVHlwZTogc3RyaW5nLCBib29rTmFtZXM6U3RyaW5nW10sIHBlcmlvZDphbnksIGNiKXtcblxuICAgICAgICAgICAgICAgIHZhciBuZXh0UGFnZT0gdGhpcy5wYWdlKzE7XG4gICAgICAgICAgICAgICAgaWYgKHJzc1R5cGUgPT0gJ3F0Jykge1xuICAgICAgICAgICAgICAgICAgICAvL2ZvciBRVCwgd2UgcmVhZCBmcm9tIERCIGZvciBuZXh0IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgLy8zLiBkbyBzZWFyY2ggaGVyZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5zZWFyY2hJdGVtc0Zvcihib29rTmFtZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2QsIHRoaXMucGFnZVNpemUsIG5leHRQYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoZW4gcG9wdWxhdGluZyBpbnRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXS5pdGVtLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXRlbXMubGVuZ3RoPjApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwdWJsaWMgbmV4dFNpbXBsaWZpZWRTZWFyY2hQYWdlRm9yKHJzc1R5cGU6IHN0cmluZywgYm9va05hbWVzOlN0cmluZ1tdLCBwZXJpb2Q6YW55LCBjYil7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRQYWdlPSB0aGlzLnBhZ2UrMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzc1R5cGUgPT0gJ3F0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9mb3IgUVQsIHdlIHJlYWQgZnJvbSBEQiBmb3IgbmV4dCBwYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLzMuIGRvIHNlYXJjaCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5zZWFyY2hTaW1wbGlmaWVkSXRlbXNGb3IoYm9va05hbWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZCwgdGhpcy5wYWdlU2l6ZSwgbmV4dFBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlbiBwb3B1bGF0aW5nIGludG8gdGhlIGRhdGEgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXS5pdGVtLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtcy5sZW5ndGg+MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKHJzc1R5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHVibGljIG5leHRQYWdlRm9yKHJzc1R5cGU6IHN0cmluZywgY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJzc1R5cGUgPT0gJ3F0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZm9yIFFULCB3ZSByZWFkIGZyb20gREIgZm9yIG5leHQgcGFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLmdldFBhZ2luYXRlZEl0ZW1zKHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSwgaXRlbXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHBvcHVsYXRpbmcgaW50byB0aGUgZGF0YSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLml0ZW0ucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKHJzc1R5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwdWJsaWMgbmV4dFNpbXBsaWZpZWRQYWdlRm9yKHJzc1R5cGU6IHN0cmluZywgY2Ipe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocnNzVHlwZSA9PSAncXQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9mb3IgUVQsIHdlIHJlYWQgZnJvbSBEQiBmb3IgbmV4dCBwYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuZ2V0U2ltcGxpZmllZFBhZ2luYXRlZEl0ZW1zKHRoaXMucGFnZVNpemUsIHRoaXMucGFnZSwgaXRlbXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHBvcHVsYXRpbmcgaW50byB0aGUgZGF0YSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLml0ZW0ucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuX2dldFBhZ2luYXRlZEl0ZW1zRm9yKHJzc1R5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHVibGljIGdldEJvb2tMaXN0KGNiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5nZXRCb29rTGlzdChpdGVtcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IoaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcml2YXRlIF9nZXRQYWdpbmF0ZWRJdGVtc0Zvcihyc3NUeXBlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXS5pdGVtLnNsaWNlKDAsIHRoaXMucGFnZSAqIHRoaXMucGFnZVNpemUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBfZ2V0U2NyaXB0Q29udGVudChpdGVtOiBJdGVtLCBjYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IGl0ZW0uc2NyaXB0VXJsLmluZGV4T2YoJ3ZlcnNpb249Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gaXRlbS5zY3JpcHRVcmw7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHBvcys4KSArICdDVVZNUFMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25ldyB1cmwgaXMgJywgdXJsKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RTZXJ2aWNlLmdldFJhd0RhdGEodXJsKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0aW5nUG9zID0gZGF0YS5pbmRleE9mKCc8ZGl2IGNsYXNzPVwicGFzc2FnZS10ZXh0XCI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVuZGluZ1BvcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRpbmdQb3MgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZGluZ1BvcyA9IGRhdGEubGFzdEluZGV4T2YoJzwvc3Bhbj48L3A+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBkYXRhLnN1YnN0cmluZyhzdGFydGluZ1BvcywgZW5kaW5nUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShuZXcgUmVnRXhwKFwiaDFcIiwgJ2cnKSwgJ2gzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnQ2hpbmVzZSBVbmlvbiBWZXJzaW9uIE1vZGVybiBQdW5jdHVhdGlvbiAoU2ltcGxpZmllZCkgKENVVk1QUyknLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zY3JpcHR1cmUgPSBcIjxkaXYgc3R5bGU9J2ZvbnQtc2l6ZToxNnB4Jz5cIisgY29udGVudCtcIjwvZGl2PlwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vbmNlIHJldHJpdmVkIHNjcmlwdHVyZSwgd2Ugc2F2ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYlNlcnZpY2UudXBkYXRlSXRlbVNjcmlwdChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYihpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBwcml2YXRlIF9nZXRTY3JpcHRDb250ZW50RW4oaXRlbTogSXRlbSwgY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcxMjMgZ2V0dGluZyBlbmdsaXNoIHVybCBpcz09PjogJywgaXRlbS5zY3JpcHRVcmwpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gaXRlbS5zY3JpcHRVcmwuaW5kZXhPZigndmVyc2lvbj0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBpdGVtLnNjcmlwdFVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgcG9zKzgpICsgJ05JVic7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnMjMgbmV3IHVybCBpcyAnLCB1cmwpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFNlcnZpY2UuZ2V0UmF3RGF0YSh1cmwpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRpbmdQb3MgPSBkYXRhLmluZGV4T2YoJzxkaXYgY2xhc3M9XCJwYXNzYWdlLXRleHRcIj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kaW5nUG9zID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydGluZ1BvcyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kaW5nUG9zID0gZGF0YS5sYXN0SW5kZXhPZignPC9zcGFuPjwvcD4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGRhdGEuc3Vic3RyaW5nKHN0YXJ0aW5nUG9zLCBlbmRpbmdQb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJoMVwiLCAnZycpLCAnaDMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKCdOZXcgSW50ZXJuYXRpb25hbCBWZXJzaW9uIChOSVYpJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2NyaXB0dXJlID0gXCI8ZGl2IHN0eWxlPSdmb250LXNpemU6MTZweCc+XCIrIGNvbnRlbnQgK1wiPC9kaXY+XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL29uY2UgcmV0cml2ZWQgc2NyaXB0dXJlLCB3ZSBzYXZlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRiU2VydmljZS51cGRhdGVJdGVtU2NyaXB0KGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcml2YXRlIF9nZXRSc3NJdGVtRm9yKHJzc1R5cGU6IHN0cmluZywgaW5kZXg6IG51bWJlcik6IEl0ZW0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucnNzRGF0YVtyc3NUeXBlXS5jaGFubmVsWzBdLml0ZW1baW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBfaXNFeHBpcmVkKGl0ZW06IEl0ZW0pOiBib29sZWFuIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZDogYW55ID0gdG9kYXkuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1tOiBhbnkgPSB0b2RheS5nZXRNb250aCgpICsgMTsgLy9KYW51YXJ5IGlzIDAhXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB5eXl5OiBhbnkgPSB0b2RheS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRkIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZCA9ICcwJyArIGRkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1tIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtbSA9ICcwJyArIG1tO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHl5eXkgKyAnLScgKyBtbSArICctJyArIGRkKSAhPT0gaXRlbS5wdWJEYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgX2NyZWF0ZVJzc0Zyb21JdGVtcyhpdGVtczogSXRlbVtdKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByc3M6IFJzcyA9IG5ldyBSc3MoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoYW5uZWw6IENoYW5uZWwgPSBuZXcgQ2hhbm5lbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoYW5uZWxJbWFnZTogQ2hhbm5lbEltYWdlID0gbmV3IENoYW5uZWxJbWFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbEltYWdlLnVybCA9ICdodHRwOi8vaG9jNS5uZXQvcXQvUG9kY2FzdEdlbmVyYXRvci9pbWFnZXMvaXR1bmVzX2ltYWdlLnBuZyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsSW1hZ2UudGl0bGUgPSAnUXVpZXQgVGltZSDpnYjkv67mk43nt7QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbEltYWdlLmxpbmsgPSAnaHR0cDovL2hvYzUubmV0L3F0L1BvZGNhc3RHZW5lcmF0b3IvJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbC50aXRsZSA9IHRoaXMuZ2V0TGFuZ3VhZ2UoKT09J2VuJz8nUXVpZXQgVGltZSc6J+mdiOS/ruaTjee3tCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsLmRlc2NyaXB0aW9uID0gdGhpcy5nZXRMYW5ndWFnZSgpPT0nZW4nPydGb3IgZXZlcnkgcmVib3JuIENocmlzdGlhbiwgdGhlcmUgc2hvdWxkIGJlIG9uZSBuZXcgdGhpbmcgYWRkZWQgdG8gaGlzIGxpZmUsIFF1aWV0IFRpbWUgd2l0aCBHb2QuIFRoaXMgaXMgbm90IG9ubHkgYSBwdXJlIHF1aWV0IHRpbWUsIGJ1dCBhbHNvIGEgaG9seSBwZXJpb2Qgd2l0aCBHb2QuICc6ICfmr4/kuIDlgIvph43nlJ/lvpfmlZHnmoTln7rnnaPlvpLvvIzlnKjku5bmr4/lpKnnmoTnlJ/mtLvoo4/lsLHlpJrkuobkuIDmqKPmlrDkuovvvIzlsLHmmK/jgIzpnYjkv67nlJ/mtLvjgI3vvIzlroPkuI3lj6rmmK/lgIvlronpnZznmoTmmYLliLsgKFF1aWV0IHRpbWUp77yM5Lmf5piv5YCL5pWs6JmU55qE5pmC6ZaT77yM5pu05piv5YCL6IiH56We542o6JmV55qE5pmC5YWJ44CCJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWwuaW1hZ2UgPSBjaGFubmVsSW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsLnN1bW1hcnkgPSB0aGlzLmdldExhbmd1YWdlKCk9PSdlbic/J0ZvciBldmVyeSByZWJvcm4gQ2hyaXN0aWFuLCB0aGVyZSBzaG91bGQgYmUgb25lIG5ldyB0aGluZyBhZGRlZCB0byBoaXMgbGlmZSwgUXVpZXQgVGltZSB3aXRoIEdvZC4gVGhpcyBpcyBub3Qgb25seSBhIHB1cmUgcXVpZXQgdGltZSwgYnV0IGFsc28gYSBob2x5IHBlcmlvZCB3aXRoIEdvZC4gJzogJ+avj+S4gOWAi+mHjeeUn+W+l+aVkeeahOWfuuedo+W+ku+8jOWcqOS7luavj+WkqeeahOeUn+a0u+ijj+WwseWkmuS6huS4gOaoo+aWsOS6i++8jOWwseaYr+OAjOmdiOS/rueUn+a0u+OAje+8jOWug+S4jeWPquaYr+WAi+WuiemdnOeahOaZguWIuyAoUXVpZXQgdGltZSnvvIzkuZ/mmK/lgIvmlazomZTnmoTmmYLplpPvvIzmm7TmmK/lgIvoiIfnpZ7njajomZXnmoTmmYLlhYnjgIInO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbC5saW5rID0gJ2h0dHA6Ly9ob2M1Lm5ldC9xdC9Qb2RjYXN0R2VuZXJhdG9yLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsLml0ZW0gPSBpdGVtcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgcnNzLmNoYW5uZWwgPSBbY2hhbm5lbF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByc3M7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcml2YXRlIF9mZXRjaERhdGEocnNzVHlwZSwgY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFNlcnZpY2UuZ2V0UmF3RGF0YSh0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0RmVlZFVybHMoKVtyc3NUeXBlXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZVN0cmluZyhkYXRhLCAoZXJyLCByZXN1bHQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnNzID0gbmV3IFJzcyhyZXN1bHQsIHJzc1R5cGUsIHRoaXMuZ2V0TGFuZ3VhZ2UoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yc3NEYXRhW3Jzc1R5cGVdID0gcnNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYih0aGlzLnJzc0RhdGFbcnNzVHlwZV0uY2hhbm5lbFswXSwgdGhpcy5fZ2V0UGFnaW5hdGVkSXRlbXNGb3IocnNzVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL29uY2UgY2FsbCBiYWNrLCByZW1vdmUgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXN0cm95ZWQgZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3NhdmluZyB0byBkYiBpbiBkaWZmZXJlbnQgdGhyZWFkLCB0byBhdm9pZCBibG9ja2luZyB1c2VyIGV4cGVyaWVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJzc1R5cGUgPT09ICdxdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlNlcnZpY2UuYWRkSXRlbXMocnNzLCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYWZ0ZXIgYWRkaW5nIGFsbCBkYXRhLCB3ZSBjYW4gcmVtb3ZlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLnJzc0RhdGFbcnNzVHlwZV0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkZXN0cm95ZWQgYWxsIGRhdGEgZnJvbSBtZW1vcnknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIH1cbiJdfQ==