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
