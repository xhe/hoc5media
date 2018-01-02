"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var config_service_1 = require("../utilities/config.service");
var entities_1 = require("../entities/entities");
var Sqlite = require("nativescript-sqlite");
var DbService = (function () {
    function DbService(configService) {
        this.configService = configService;
        this._prepareDb();
    }
    DbService.prototype.clearDB = function (cb) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        console.log('start clearning db');
        this._prepareDb(function () {
            console.log('db prepared here');
            //delete dataBase first
            _this.database.execSQL('DROP TABLE IF EXISTS items').then(function () {
                console.log('table is dropped');
                _this.database.execSQL('DROP INDEX  IF EXISTS idx_items_uuid').then(function () {
                    console.log('index is dropped');
                    _this._createItemTable(cb);
                });
            }, function (err) {
                console.log('dropping table error here', err);
                //if table can not be dropped, we then need to delete database
                Sqlite.deleteDatabase(_this.configService.getDBName());
                _this.dropDB(cb);
            });
        });
    };
    DbService.prototype.dropDB = function (cb) {
        if (cb === void 0) { cb = null; }
        Sqlite.deleteDatabase(this.configService.getDBName());
        console.log('now let us delete the whole database');
        if (cb)
            cb([]);
    };
    DbService.prototype.getAllItems = function (cb) {
        this._queryData("SELECT * FROM items", cb);
    };
    DbService.prototype.getBookList = function (cb) {
        var _this = this;
        if (this.bookTitles) {
            return cb(this.bookTitles);
        }
        var queryStr = 'SELECT title FROM items';
        this._prepareDb(function () {
            _this.database.all(queryStr).then(function (rows) {
                var bookTitles = [];
                rows.forEach(function (row) {
                    var title = row[0];
                    var startPos = 0;
                    var endPos = 0;
                    for (var i = 0; i < title.length; i++) {
                        var tmpStr = title.substr(i, 1);
                        if (isNaN(tmpStr) && tmpStr != '-' && tmpStr != ' ') {
                            startPos = i;
                            break;
                        }
                    }
                    for (var i = startPos + 1; i < title.length; i++) {
                        if (!isNaN(title.substr(i, 1))) {
                            if (title.substring(startPos, i) != 'QT' && bookTitles.indexOf(title.substring(startPos, i)) === -1) {
                                bookTitles.push(title.substring(startPos, i));
                            }
                            break;
                        }
                    }
                });
                _this.bookTitles = bookTitles;
                cb(bookTitles);
            });
        });
    };
    DbService.prototype.getItemFromUUID = function (uuid, cb) {
        this._queryData("select * from items where uuid = " + uuid, function (items) {
            cb(items[0]);
        });
    };
    DbService.prototype.getFavoritedItemsForUUIDs = function (uuids, cb) {
        var uuidStr = "";
        uuids.forEach(function (uuid) {
            uuidStr += (uuidStr == '' ? '' : ',') + uuid;
        });
        var queryStr = "select * from items where uuid in ( " + uuidStr + " ) order by id asc";
        console.log(queryStr);
        this._queryData(queryStr, cb);
    };
    DbService.prototype.getNotedItemsForUUIDs = function (uuids, cb) {
        var uuidStr = "";
        uuids.forEach(function (uuid) {
            uuidStr += (uuidStr == '' ? '' : ',') + uuid;
        });
        var queryStr = "select * from items where uuid in ( " + uuidStr + " ) order by id asc";
        console.log(queryStr);
        this._queryData(queryStr, cb);
    };
    DbService.prototype.getSimplifiedNotedItemsForUUIDs = function (uuids, cb) {
        var uuidStr = "";
        uuids.forEach(function (uuid) {
            uuidStr += (uuidStr == '' ? '' : ',') + uuid;
        });
        var queryStr = "select title, subTitle, uuid, pubDate from items where uuid in ( " + uuidStr + " ) order by id asc";
        console.log(queryStr);
        this._queryData(queryStr, cb);
    };
    DbService.prototype.getSimplifiedFavoritedItemsForUUIDs = function (uuids, cb) {
        var uuidStr = "";
        uuids.forEach(function (uuid) {
            uuidStr += (uuidStr == '' ? '' : ',') + uuid;
        });
        var queryStr = "select title, subTitle, uuid, pubDate from items where uuid in ( " + uuidStr + " ) order by id asc";
        console.log(queryStr);
        this._queryData(queryStr, cb);
    };
    DbService.prototype.searchSimplifiedItemsFor = function (bookNames, period, pageSize, page, cb) {
        //prepare query here
        var queryStr = "SELECT title, subTitle, uuid, pubDate FROM items ";
        var whereStr = '';
        if (bookNames.length > 0) {
            var whereStrs_1 = [];
            bookNames.forEach(function (bookName) {
                whereStrs_1.push("title like \"%" + bookName + "%\"");
            });
            if (whereStrs_1.length > 0) {
                whereStr = whereStrs_1.join(' or ');
            }
        }
        var dateStr = '';
        if (period.length > 0 && period[0] && period[1]) {
            switch (period[0].toLowerCase()) {
                case 'on':
                    dateStr = "pubDate='" + period[1] + "'";
                    break;
                case 'on or before':
                    dateStr = "pubDate<='" + period[1] + "'";
                    break;
                case 'on or after':
                    dateStr = "pubDate>='" + period[1] + "'";
                    break;
                default:
                    dateStr = "pubDate between '" + period[1] + "' and '" + period[2] + "'";
            }
        }
        var queryParts = [];
        if (whereStr.length > 0) {
            queryParts.push("( " + whereStr + " )");
        }
        if (dateStr.length > 0) {
            queryParts.push(dateStr);
        }
        if (queryParts.length > 0) {
            queryStr += " where " + queryParts.join(' and ');
        }
        //for search, we need to order from low to high
        if (bookNames.length != this.bookTitles.length) {
            queryStr += " order by id desc ";
        }
        queryStr += " limit " + pageSize + " offset " + pageSize * (page - 1);
        this._queryData(queryStr, cb);
    };
    DbService.prototype.searchItemsFor = function (bookNames, period, pageSize, page, cb) {
        //prepare query here
        var queryStr = "SELECT * FROM items ";
        var whereStr = '';
        if (bookNames.length > 0) {
            var whereStrs_2 = [];
            bookNames.forEach(function (bookName) {
                whereStrs_2.push("title like \"%" + bookName + "%\"");
            });
            if (whereStrs_2.length > 0) {
                whereStr = whereStrs_2.join(' or ');
            }
        }
        var dateStr = '';
        if (period.length > 0 && period[0] && period[1]) {
            switch (period[0].toLowerCase()) {
                case 'on':
                    dateStr = "pubDate='" + period[1] + "'";
                    break;
                case 'on or before':
                    dateStr = "pubDate<='" + period[1] + "'";
                    break;
                case 'on or after':
                    dateStr = "pubDate>='" + period[1] + "'";
                    break;
                default:
                    dateStr = "pubDate between '" + period[1] + "' and '" + period[2] + "'";
            }
        }
        var queryParts = [];
        if (whereStr.length > 0) {
            queryParts.push("( " + whereStr + " )");
        }
        if (dateStr.length > 0) {
            queryParts.push(dateStr);
        }
        if (queryParts.length > 0) {
            queryStr += " where " + queryParts.join(' and ');
        }
        //for search, we need to order from low to high
        if (bookNames.length != this.bookTitles.length) {
            queryStr += " order by id desc ";
        }
        //for search, we need to order from low to high
        queryStr += " limit " + pageSize + " offset " + pageSize * (page - 1);
        this._queryData(queryStr, cb);
    };
    DbService.prototype.getPaginatedItems = function (pageSize, page, cb) {
        var queryStr = "SELECT *  FROM  items limit " + pageSize + " offset " + pageSize * (page - 1);
        this._queryData(queryStr, cb);
    };
    DbService.prototype.getSimplifiedPaginatedItems = function (pageSize, page, cb) {
        var queryStr = "SELECT title, subTitle, uuid, pubDate  FROM  items limit " + pageSize + " offset " + pageSize * (page - 1);
        this._queryData(queryStr, cb);
    };
    DbService.prototype.addItem = function (item, cb) {
        var _this = this;
        this._prepareDb(function () {
            var queryStr;
            queryStr = "INSERT INTO items (id, title,subTitle,summary,description,link,enclosure_link,enclosure_length,enclosure_type,duration,pubDate,scriptUrl,uuid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
            _this.database.execSQL(queryStr, [item.id, item.title, item.subTitle, item.summary, item.description, item.link, item.enclosure_link, item.enclosure_length, item.enclosure_type, item.duration, item.pubDate, item.scriptUrl, item.uuid])
                .then(function (id) {
                if (cb)
                    cb();
            }, function (error) {
                console.log("INSERT ERROR", error);
            });
        });
    };
    DbService.prototype.addItems = function (rss, cb) {
        var _this = this;
        //step 1: clear DB
        this.clearDB(function () {
            //now we need to add
            var items = rss.channel[0].item;
            var __this = _this;
            var addingSingle = function (index) {
                __this.addItem(items[index], function () {
                    index++;
                    if (index == items.length) {
                        console.log('added all data');
                        if (cb)
                            cb();
                    }
                    else {
                        addingSingle(index);
                    }
                });
            };
            addingSingle(0);
        });
    };
    DbService.prototype.updateItemScript = function (item, cb) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        this._prepareDb(function () {
            var queryStr = "update items set scripture=? where id=?";
            _this.database.execSQL(queryStr, [item.scripture, item.id])
                .then(function (id) {
                console.log('Successfully updated scripture for ', id);
                if (cb)
                    cb();
            }, function (error) {
                console.log("Update ERROR", JSON.stringify(error));
            });
        });
    };
    DbService.prototype._prepareDb = function (cb) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        if (this.database && this.database.isOpen) {
            if (cb)
                cb();
        }
        else {
            (new Sqlite(this.configService.getDBName())).then(function (db) {
                _this.database = db;
                _this._createItemTable(cb);
            }, function (error) {
                console.log("OPEN DB ERROR", error);
            });
        }
    };
    //CREATE UNIQUE INDEX idx_items_uuid ON items (uuid);
    DbService.prototype._createItemTable = function (cb) {
        if (cb === void 0) { cb = null; }
        this.database.execSQL("CREATE TABLE IF NOT EXISTS items (id INTEGER, title TEXT,\n        subTitle TEXT,summary TEXT,description TEXT,link TEXT,\n        enclosure_link TEXT,enclosure_length TEXT,enclosure_type TEXT,\n        duration TEXT,pubDate TEXT,scriptUrl TEXT,scripture TEXT, uuid INTEGER);\n        ").then(function (id) {
            if (cb)
                cb();
        }, function (error) {
            console.log("CREATE TABLE ERROR", error);
        });
    };
    DbService.prototype._queryData = function (queryStr, cb) {
        var _this = this;
        console.log('query data:', queryStr);
        this._prepareDb(function () {
            console.log('db prepared finished');
            _this.database.all(queryStr).then(function (rows) {
                console.log('find all the data ', rows.length);
                var items = [];
                for (var row in rows) {
                    var item = new entities_1.Item();
                    ;
                    if (rows[row].length < 5) {
                        item['title'] = rows[row][0] == null ? "" : rows[row][0];
                        item['subTitle'] = rows[row][1] == null ? "" : rows[row][1];
                        item['uuid'] = rows[row][2] == null ? "" : rows[row][2];
                        item['pubDate'] = rows[row][3] == null ? "" : rows[row][3];
                    }
                    else {
                        item.id = rows[row][0];
                        item.title = rows[row][1];
                        item.subTitle = rows[row][2];
                        item.summary = rows[row][3];
                        item.description = rows[row][4];
                        item.link = rows[row][5];
                        item.enclosure_link = rows[row][6];
                        item.enclosure_length = rows[row][7];
                        item.enclosure_type = rows[row][8];
                        item.duration = rows[row][9];
                        item.pubDate = rows[row][10];
                        item.scriptUrl = rows[row][11];
                        item.scripture = rows[row][12];
                        item.uuid = rows[row][13];
                    }
                    items.push(item);
                }
                cb(items);
            }, function (err) {
                console.log('got error here', err);
                //if there are error in DB, we need to clean db
                _this.clearDB(function () { return cb([]); });
            });
        });
    };
    DbService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [config_service_1.ConfigService])
    ], DbService);
    return DbService;
}());
exports.DbService = DbService;
