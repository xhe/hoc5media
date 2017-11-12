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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRiLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUM7QUFDekMsOERBQTBEO0FBQzFELGlEQUErQztBQUUvQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUc1QztJQUlJLG1CQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLDJCQUFPLEdBQWQsVUFBZSxFQUFTO1FBQXhCLGlCQW9CSDtRQXBCa0IsbUJBQUEsRUFBQSxTQUFTO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2hDLHVCQUF1QjtZQUN2QixLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNoQyxLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUNoQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzlCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxFQUNELFVBQUEsR0FBRztnQkFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM5Qyw4REFBOEQ7Z0JBQzlELE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUs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QUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzlCLENBQUM7b0JBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckIsQ0FBQztnQkFFRCxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDLEVBQ0QsVUFBQSxHQUFHO2dCQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ25DLCtDQUErQztnQkFDL0MsS0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFJLE9BQUEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFOLENBQU0sQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FDSixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBNVhZLFNBQVM7UUFEckIsaUJBQVUsRUFBRTt5Q0FLMEIsOEJBQWE7T0FKdkMsU0FBUyxDQTZYckI7SUFBRCxnQkFBQztDQUFBLEFBN1hELElBNlhDO0FBN1hZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtDb25maWdTZXJ2aWNlfSBmcm9tIFwiLi4vdXRpbGl0aWVzL2NvbmZpZy5zZXJ2aWNlXCI7XG5pbXBvcnQge0l0ZW0sIFJzc30gZnJvbSAnLi4vZW50aXRpZXMvZW50aXRpZXMnO1xuXG52YXIgU3FsaXRlID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1zcWxpdGVcIik7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEYlNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBkYXRhYmFzZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWdTZXJ2aWNlOiBDb25maWdTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuX3ByZXBhcmVEYigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckRCKGNiID0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnQgY2xlYXJuaW5nIGRiJyk7XG4gICAgICAgIHRoaXMuX3ByZXBhcmVEYigoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGIgcHJlcGFyZWQgaGVyZScpO1xuICAgICAgICAgICAgLy9kZWxldGUgZGF0YUJhc2UgZmlyc3RcbiAgICAgICAgICAgIHRoaXMuZGF0YWJhc2UuZXhlY1NRTCgnRFJPUCBUQUJMRSBJRiBFWElTVFMgaXRlbXMnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGFibGUgaXMgZHJvcHBlZCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YWJhc2UuZXhlY1NRTCgnRFJPUCBJTkRFWCAgSUYgRVhJU1RTIGlkeF9pdGVtc191dWlkJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbmRleCBpcyBkcm9wcGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUl0ZW1UYWJsZShjYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyPT57XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Ryb3BwaW5nIHRhYmxlIGVycm9yIGhlcmUnLCBlcnIpO1xuICAgICAgICAgICAgICAgIC8vaWYgdGFibGUgY2FuIG5vdCBiZSBkcm9wcGVkLCB3ZSB0aGVuIG5lZWQgdG8gZGVsZXRlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgU3FsaXRlLmRlbGV0ZURhdGFiYXNlKHRoaXMuY29uZmlnU2VydmljZS5nZXREQk5hbWUoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wREIoY2IpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0pO1xufVxuXG5wdWJsaWMgZHJvcERCKGNiPW51bGwpe1xuICAgIFNxbGl0ZS5kZWxldGVEYXRhYmFzZSh0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0REJOYW1lKCkpO1xuICAgIGNvbnNvbGUubG9nKCdub3cgbGV0IHVzIGRlbGV0ZSB0aGUgd2hvbGUgZGF0YWJhc2UnKTtcbiAgICBpZihjYilcbiAgICBjYihbXSk7XG59XG5cbnB1YmxpYyBnZXRBbGxJdGVtcyhjYikge1xuICAgIHRoaXMuX3F1ZXJ5RGF0YShcIlNFTEVDVCAqIEZST00gaXRlbXNcIiwgY2IpXG59XG5cbnByaXZhdGUgYm9va1RpdGxlczogc3RyaW5nW107XG5cbnB1YmxpYyBnZXRCb29rTGlzdChjYikge1xuXG4gICAgaWYodGhpcy5ib29rVGl0bGVzKXtcbiAgICAgICAgcmV0dXJuIGNiKHRoaXMuYm9va1RpdGxlcyk7XG4gICAgfVxuXG4gICAgbGV0IHF1ZXJ5U3RyID0gJ1NFTEVDVCB0aXRsZSBGUk9NIGl0ZW1zJztcbiAgICB0aGlzLl9wcmVwYXJlRGIoKCkgPT4ge1xuICAgICAgICB0aGlzLmRhdGFiYXNlLmFsbChxdWVyeVN0cikudGhlbihyb3dzID0+IHtcbiAgICAgICAgICAgIGxldCBib29rVGl0bGVzID0gW107XG4gICAgICAgICAgICByb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSByb3dbMF07XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0UG9zID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgZW5kUG9zID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpdGxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0bXBTdHIgPSB0aXRsZS5zdWJzdHIoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTih0bXBTdHIpICYmIHRtcFN0ciAhPSAnLScgJiYgdG1wU3RyICE9ICcgJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3MgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0UG9zICsgMTsgaSA8IHRpdGxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4odGl0bGUuc3Vic3RyKGksIDEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aXRsZS5zdWJzdHJpbmcoc3RhcnRQb3MsIGkpIT0nUVQnICYmIGJvb2tUaXRsZXMuaW5kZXhPZih0aXRsZS5zdWJzdHJpbmcoc3RhcnRQb3MsIGkpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29rVGl0bGVzLnB1c2godGl0bGUuc3Vic3RyaW5nKHN0YXJ0UG9zLCBpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5ib29rVGl0bGVzID0gYm9va1RpdGxlcztcbiAgICAgICAgICAgIGNiKGJvb2tUaXRsZXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxucHVibGljIGdldEl0ZW1Gcm9tVVVJRCh1dWlkLCBjYil7XG4gICAgdGhpcy5fcXVlcnlEYXRhKGBzZWxlY3QgKiBmcm9tIGl0ZW1zIHdoZXJlIHV1aWQgPSAke3V1aWR9YCwgaXRlbXM9PntcbiAgICAgICAgY2IoaXRlbXNbMF0pO1xuICAgIH0pO1xufVxuXG5wdWJsaWMgZ2V0RmF2b3JpdGVkSXRlbXNGb3JVVUlEcyh1dWlkcywgY2Ipe1xuICAgIGxldCB1dWlkU3RyID0gXCJcIjtcbiAgICB1dWlkcy5mb3JFYWNoKHV1aWQ9PntcbiAgICAgICAgdXVpZFN0cis9ICh1dWlkU3RyPT0nJz8nJzonLCcpICt1dWlkO1xuICAgIH0pO1xuXG4gICAgbGV0IHF1ZXJ5U3RyID0gYHNlbGVjdCAqIGZyb20gaXRlbXMgd2hlcmUgdXVpZCBpbiAoICR7dXVpZFN0cn0gKSBvcmRlciBieSBpZCBhc2NgO1xuICAgIGNvbnNvbGUubG9nKHF1ZXJ5U3RyKTtcbiAgICB0aGlzLl9xdWVyeURhdGEocXVlcnlTdHIsIGNiKTtcbn1cblxucHVibGljIGdldE5vdGVkSXRlbXNGb3JVVUlEcyh1dWlkcywgY2Ipe1xuICAgIGxldCB1dWlkU3RyID0gXCJcIjtcbiAgICB1dWlkcy5mb3JFYWNoKHV1aWQ9PntcbiAgICAgICAgdXVpZFN0cis9ICh1dWlkU3RyPT0nJz8nJzonLCcpICt1dWlkO1xuICAgIH0pO1xuXG4gICAgbGV0IHF1ZXJ5U3RyID0gYHNlbGVjdCAqIGZyb20gaXRlbXMgd2hlcmUgdXVpZCBpbiAoICR7dXVpZFN0cn0gKSBvcmRlciBieSBpZCBhc2NgO1xuICAgIGNvbnNvbGUubG9nKHF1ZXJ5U3RyKTtcbiAgICB0aGlzLl9xdWVyeURhdGEocXVlcnlTdHIsIGNiKTtcbn1cblxucHVibGljIGdldFNpbXBsaWZpZWROb3RlZEl0ZW1zRm9yVVVJRHModXVpZHMsIGNiKXtcbiAgICBsZXQgdXVpZFN0ciA9IFwiXCI7XG4gICAgdXVpZHMuZm9yRWFjaCh1dWlkPT57XG4gICAgICAgIHV1aWRTdHIrPSAodXVpZFN0cj09Jyc/Jyc6JywnKSArdXVpZDtcbiAgICB9KTtcblxuICAgIGxldCBxdWVyeVN0ciA9IGBzZWxlY3QgdGl0bGUsIHN1YlRpdGxlLCB1dWlkLCBwdWJEYXRlIGZyb20gaXRlbXMgd2hlcmUgdXVpZCBpbiAoICR7dXVpZFN0cn0gKSBvcmRlciBieSBpZCBhc2NgO1xuICAgIGNvbnNvbGUubG9nKHF1ZXJ5U3RyKTtcbiAgICB0aGlzLl9xdWVyeURhdGEocXVlcnlTdHIsIGNiKTtcbn1cblxucHVibGljIGdldFNpbXBsaWZpZWRGYXZvcml0ZWRJdGVtc0ZvclVVSURzKHV1aWRzLCBjYil7XG4gICAgbGV0IHV1aWRTdHIgPSBcIlwiO1xuICAgIHV1aWRzLmZvckVhY2godXVpZD0+e1xuICAgICAgICB1dWlkU3RyKz0gKHV1aWRTdHI9PScnPycnOicsJykgK3V1aWQ7XG4gICAgfSk7XG5cbiAgICBsZXQgcXVlcnlTdHIgPSBgc2VsZWN0IHRpdGxlLCBzdWJUaXRsZSwgdXVpZCwgcHViRGF0ZSBmcm9tIGl0ZW1zIHdoZXJlIHV1aWQgaW4gKCAke3V1aWRTdHJ9ICkgb3JkZXIgYnkgaWQgYXNjYDtcbiAgICBjb25zb2xlLmxvZyhxdWVyeVN0cik7XG4gICAgdGhpcy5fcXVlcnlEYXRhKHF1ZXJ5U3RyLCBjYik7XG59XG5cblxucHVibGljIHNlYXJjaFNpbXBsaWZpZWRJdGVtc0Zvcihib29rTmFtZXM6U3RyaW5nW10sIHBlcmlvZDphbnksIHBhZ2VTaXplLCBwYWdlLCBjYil7XG4gICAgLy9wcmVwYXJlIHF1ZXJ5IGhlcmVcbiAgICBsZXQgcXVlcnlTdHI9XCJTRUxFQ1QgdGl0bGUsIHN1YlRpdGxlLCB1dWlkLCBwdWJEYXRlIEZST00gaXRlbXMgXCI7XG4gICAgbGV0IHdoZXJlU3RyID0gJyc7XG5cbiAgICBpZihib29rTmFtZXMubGVuZ3RoPjApe1xuICAgICAgICBsZXQgd2hlcmVTdHJzID0gW107XG4gICAgICAgIGJvb2tOYW1lcy5mb3JFYWNoKGJvb2tOYW1lPT57XG4gICAgICAgICAgICB3aGVyZVN0cnMucHVzaChgdGl0bGUgbGlrZSBcIiUke2Jvb2tOYW1lfSVcImApO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYod2hlcmVTdHJzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIHdoZXJlU3RyID0gd2hlcmVTdHJzLmpvaW4oJyBvciAnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkYXRlU3RyID0gJyc7XG5cbiAgICBpZihwZXJpb2QubGVuZ3RoPjAgJiYgcGVyaW9kWzBdICYmIHBlcmlvZFsxXSl7XG4gICAgICAgIHN3aXRjaChwZXJpb2RbMF0udG9Mb3dlckNhc2UoKSl7XG4gICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICBkYXRlU3RyPWBwdWJEYXRlPScke3BlcmlvZFsxXX0nYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnb24gb3IgYmVmb3JlJzpcbiAgICAgICAgICAgIGRhdGVTdHI9YHB1YkRhdGU8PScke3BlcmlvZFsxXX0nYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnb24gb3IgYWZ0ZXInOlxuICAgICAgICAgICAgZGF0ZVN0cj1gcHViRGF0ZT49JyR7cGVyaW9kWzFdfSdgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZGF0ZVN0cj1gcHViRGF0ZSBiZXR3ZWVuICcke3BlcmlvZFsxXX0nIGFuZCAnJHtwZXJpb2RbMl19J2A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcXVlcnlQYXJ0cyA9IFtdO1xuXG4gICAgaWYod2hlcmVTdHIubGVuZ3RoPjApe1xuICAgICAgICBxdWVyeVBhcnRzLnB1c2goYCggJHt3aGVyZVN0cn0gKWApO1xuICAgIH1cblxuICAgIGlmKGRhdGVTdHIubGVuZ3RoPjApe1xuICAgICAgICBxdWVyeVBhcnRzLnB1c2goZGF0ZVN0cik7XG4gICAgfVxuXG4gICAgaWYocXVlcnlQYXJ0cy5sZW5ndGg+MCl7XG4gICAgICAgIHF1ZXJ5U3RyKz1gIHdoZXJlIGAgKyBxdWVyeVBhcnRzLmpvaW4oJyBhbmQgJyk7XG4gICAgfVxuICAgIC8vZm9yIHNlYXJjaCwgd2UgbmVlZCB0byBvcmRlciBmcm9tIGxvdyB0byBoaWdoXG4gICAgaWYoYm9va05hbWVzLmxlbmd0aCE9dGhpcy5ib29rVGl0bGVzLmxlbmd0aCl7XG4gICAgICAgIHF1ZXJ5U3RyKz1gIG9yZGVyIGJ5IGlkIGRlc2MgYDtcbiAgICB9XG4gICAgcXVlcnlTdHIrPWAgbGltaXQgJHtwYWdlU2l6ZX0gb2Zmc2V0ICR7cGFnZVNpemUgKiAocGFnZSAtIDEpfWA7XG5cbiAgICB0aGlzLl9xdWVyeURhdGEocXVlcnlTdHIsIGNiKTtcbn1cblxucHVibGljIHNlYXJjaEl0ZW1zRm9yKGJvb2tOYW1lczpTdHJpbmdbXSwgcGVyaW9kOmFueSwgcGFnZVNpemUsIHBhZ2UsIGNiKXtcbiAgICAvL3ByZXBhcmUgcXVlcnkgaGVyZVxuICAgIGxldCBxdWVyeVN0cj1cIlNFTEVDVCAqIEZST00gaXRlbXMgXCI7XG4gICAgbGV0IHdoZXJlU3RyID0gJyc7XG5cbiAgICBpZihib29rTmFtZXMubGVuZ3RoPjApe1xuICAgICAgICBsZXQgd2hlcmVTdHJzID0gW107XG4gICAgICAgIGJvb2tOYW1lcy5mb3JFYWNoKGJvb2tOYW1lPT57XG4gICAgICAgICAgICB3aGVyZVN0cnMucHVzaChgdGl0bGUgbGlrZSBcIiUke2Jvb2tOYW1lfSVcImApO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYod2hlcmVTdHJzLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIHdoZXJlU3RyID0gd2hlcmVTdHJzLmpvaW4oJyBvciAnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkYXRlU3RyID0gJyc7XG5cbiAgICBpZihwZXJpb2QubGVuZ3RoPjAgJiYgcGVyaW9kWzBdICYmIHBlcmlvZFsxXSl7XG4gICAgICAgIHN3aXRjaChwZXJpb2RbMF0udG9Mb3dlckNhc2UoKSl7XG4gICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICBkYXRlU3RyPWBwdWJEYXRlPScke3BlcmlvZFsxXX0nYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnb24gb3IgYmVmb3JlJzpcbiAgICAgICAgICAgIGRhdGVTdHI9YHB1YkRhdGU8PScke3BlcmlvZFsxXX0nYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnb24gb3IgYWZ0ZXInOlxuICAgICAgICAgICAgZGF0ZVN0cj1gcHViRGF0ZT49JyR7cGVyaW9kWzFdfSdgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZGF0ZVN0cj1gcHViRGF0ZSBiZXR3ZWVuICcke3BlcmlvZFsxXX0nIGFuZCAnJHtwZXJpb2RbMl19J2A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcXVlcnlQYXJ0cyA9IFtdO1xuXG4gICAgaWYod2hlcmVTdHIubGVuZ3RoPjApe1xuICAgICAgICBxdWVyeVBhcnRzLnB1c2goYCggJHt3aGVyZVN0cn0gKWApO1xuICAgIH1cblxuICAgIGlmKGRhdGVTdHIubGVuZ3RoPjApe1xuICAgICAgICBxdWVyeVBhcnRzLnB1c2goZGF0ZVN0cik7XG4gICAgfVxuXG4gICAgaWYocXVlcnlQYXJ0cy5sZW5ndGg+MCl7XG4gICAgICAgIHF1ZXJ5U3RyKz1gIHdoZXJlIGAgKyBxdWVyeVBhcnRzLmpvaW4oJyBhbmQgJyk7XG4gICAgfVxuXG4gICAgLy9mb3Igc2VhcmNoLCB3ZSBuZWVkIHRvIG9yZGVyIGZyb20gbG93IHRvIGhpZ2hcbiAgICBpZihib29rTmFtZXMubGVuZ3RoIT10aGlzLmJvb2tUaXRsZXMubGVuZ3RoKXtcbiAgICAgICAgcXVlcnlTdHIrPWAgb3JkZXIgYnkgaWQgZGVzYyBgO1xuICAgIH1cblxuICAgIC8vZm9yIHNlYXJjaCwgd2UgbmVlZCB0byBvcmRlciBmcm9tIGxvdyB0byBoaWdoXG4gICAgcXVlcnlTdHIrPWAgbGltaXQgJHtwYWdlU2l6ZX0gb2Zmc2V0ICR7cGFnZVNpemUgKiAocGFnZSAtIDEpfWA7XG5cbiAgICB0aGlzLl9xdWVyeURhdGEocXVlcnlTdHIsIGNiKTtcbn1cblxucHVibGljIGdldFBhZ2luYXRlZEl0ZW1zKHBhZ2VTaXplLCBwYWdlLCBjYikge1xuICAgIGxldCBxdWVyeVN0cjpzdHJpbmcgPSBgU0VMRUNUICogIEZST00gIGl0ZW1zIGxpbWl0ICR7cGFnZVNpemV9IG9mZnNldCAke3BhZ2VTaXplICogKHBhZ2UgLSAxKX1gO1xuICAgIHRoaXMuX3F1ZXJ5RGF0YShxdWVyeVN0ciwgY2IpO1xufVxuXG5wdWJsaWMgZ2V0U2ltcGxpZmllZFBhZ2luYXRlZEl0ZW1zKHBhZ2VTaXplLCBwYWdlLCBjYikge1xuICAgIGxldCBxdWVyeVN0cjpzdHJpbmcgPSBgU0VMRUNUIHRpdGxlLCBzdWJUaXRsZSwgdXVpZCwgcHViRGF0ZSAgRlJPTSAgaXRlbXMgbGltaXQgJHtwYWdlU2l6ZX0gb2Zmc2V0ICR7cGFnZVNpemUgKiAocGFnZSAtIDEpfWA7XG4gICAgdGhpcy5fcXVlcnlEYXRhKHF1ZXJ5U3RyLCBjYik7XG59XG5cbnB1YmxpYyBhZGRJdGVtKGl0ZW06IEl0ZW0sIGNiKSB7XG4gICAgdGhpcy5fcHJlcGFyZURiKCgpID0+IHtcbiAgICAgICAgdmFyIHF1ZXJ5U3RyOiBzdHJpbmc7XG4gICAgICAgIHF1ZXJ5U3RyID0gYElOU0VSVCBJTlRPIGl0ZW1zIChpZCwgdGl0bGUsc3ViVGl0bGUsc3VtbWFyeSxkZXNjcmlwdGlvbixsaW5rLGVuY2xvc3VyZV9saW5rLGVuY2xvc3VyZV9sZW5ndGgsZW5jbG9zdXJlX3R5cGUsZHVyYXRpb24scHViRGF0ZSxzY3JpcHRVcmwsdXVpZCkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sPyw/LD8sPyw/KWA7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UuZXhlY1NRTChxdWVyeVN0ciwgW2l0ZW0uaWQsIGl0ZW0udGl0bGUsIGl0ZW0uc3ViVGl0bGUsIGl0ZW0uc3VtbWFyeSwgaXRlbS5kZXNjcmlwdGlvbiwgaXRlbS5saW5rLCBpdGVtLmVuY2xvc3VyZV9saW5rLCBpdGVtLmVuY2xvc3VyZV9sZW5ndGgsIGl0ZW0uZW5jbG9zdXJlX3R5cGUsIGl0ZW0uZHVyYXRpb24sIGl0ZW0ucHViRGF0ZSwgaXRlbS5zY3JpcHRVcmwsIGl0ZW0udXVpZF0pXG4gICAgICAgIC50aGVuKGlkID0+IHtcbiAgICAgICAgICAgIGlmIChjYikgY2IoKTtcbiAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTlNFUlQgRVJST1JcIiwgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbnB1YmxpYyBhZGRJdGVtcyhyc3M6IFJzcywgY2IpIHtcblxuICAgIC8vc3RlcCAxOiBjbGVhciBEQlxuICAgIHRoaXMuY2xlYXJEQigoKSA9PiB7XG4gICAgICAgIC8vbm93IHdlIG5lZWQgdG8gYWRkXG4gICAgICAgIGxldCBpdGVtczogSXRlbVtdID0gcnNzLmNoYW5uZWxbMF0uaXRlbTtcbiAgICAgICAgdmFyIF9fdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBhZGRpbmdTaW5nbGUgPSBmdW5jdGlvbihpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICBfX3RoaXMuYWRkSXRlbShpdGVtc1tpbmRleF0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FkZGVkIGFsbCBkYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNiKVxuICAgICAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGluZ1NpbmdsZShpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGFkZGluZ1NpbmdsZSgwKTtcbiAgICB9KTtcbn1cblxucHVibGljIHVwZGF0ZUl0ZW1TY3JpcHQoaXRlbTogSXRlbSwgY2IgPSBudWxsKSB7XG5cbiAgICB0aGlzLl9wcmVwYXJlRGIoKCkgPT4ge1xuICAgICAgICBsZXQgcXVlcnlTdHI6IHN0cmluZyA9IGB1cGRhdGUgaXRlbXMgc2V0IHNjcmlwdHVyZT0/IHdoZXJlIGlkPT9gO1xuICAgICAgICB0aGlzLmRhdGFiYXNlLmV4ZWNTUUwocXVlcnlTdHIsIFtpdGVtLnNjcmlwdHVyZSwgaXRlbS5pZF0pXG4gICAgICAgIC50aGVuKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzZnVsbHkgdXBkYXRlZCBzY3JpcHR1cmUgZm9yICcsIGlkKTtcbiAgICAgICAgICAgIGlmIChjYikgY2IoKTtcbiAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGRhdGUgRVJST1JcIiwgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn1cblxuXG5wcml2YXRlIF9wcmVwYXJlRGIoY2IgPSBudWxsKSB7XG5cbiAgICBpZiAodGhpcy5kYXRhYmFzZSAmJiB0aGlzLmRhdGFiYXNlLmlzT3Blbikge1xuICAgICAgICBpZiAoY2IpIGNiKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgKG5ldyBTcWxpdGUodGhpcy5jb25maWdTZXJ2aWNlLmdldERCTmFtZSgpKSkudGhlbihkYiA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGFiYXNlID0gZGI7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVJdGVtVGFibGUoY2IpO1xuICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9QRU4gREIgRVJST1JcIiwgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4vL0NSRUFURSBVTklRVUUgSU5ERVggaWR4X2l0ZW1zX3V1aWQgT04gaXRlbXMgKHV1aWQpO1xucHJpdmF0ZSBfY3JlYXRlSXRlbVRhYmxlKGNiID0gbnVsbCkge1xuICAgIHRoaXMuZGF0YWJhc2UuZXhlY1NRTChgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgaXRlbXMgKGlkIElOVEVHRVIsIHRpdGxlIFRFWFQsXG4gICAgICAgIHN1YlRpdGxlIFRFWFQsc3VtbWFyeSBURVhULGRlc2NyaXB0aW9uIFRFWFQsbGluayBURVhULFxuICAgICAgICBlbmNsb3N1cmVfbGluayBURVhULGVuY2xvc3VyZV9sZW5ndGggVEVYVCxlbmNsb3N1cmVfdHlwZSBURVhULFxuICAgICAgICBkdXJhdGlvbiBURVhULHB1YkRhdGUgVEVYVCxzY3JpcHRVcmwgVEVYVCxzY3JpcHR1cmUgVEVYVCwgdXVpZCBJTlRFR0VSKTtcbiAgICAgICAgYCkudGhlbihcbiAgICAgICAgICAgIGlkPT57XG4gICAgICAgICAgICAgICAgaWYgKGNiKSBjYigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yPT57XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDUkVBVEUgVEFCTEUgRVJST1JcIiwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcXVlcnlEYXRhKHF1ZXJ5U3RyOiBzdHJpbmcsIGNiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdxdWVyeSBkYXRhOicsIHF1ZXJ5U3RyKTtcbiAgICAgICAgdGhpcy5fcHJlcGFyZURiKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYiBwcmVwYXJlZCBmaW5pc2hlZCcpO1xuICAgICAgICAgICAgdGhpcy5kYXRhYmFzZS5hbGwocXVlcnlTdHIpLnRoZW4ocm93cyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmQgYWxsIHRoZSBkYXRhICcsIHJvd3MubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciByb3cgaW4gcm93cykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBJdGVtKCk7O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHJvd3Nbcm93XS5sZW5ndGg8NSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtWyd0aXRsZSddID0gcm93c1tyb3ddWzBdPT1udWxsP1wiXCI6cm93c1tyb3ddWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVsnc3ViVGl0bGUnXSA9IHJvd3Nbcm93XVsxXT09bnVsbD9cIlwiOnJvd3Nbcm93XVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ3V1aWQnXSA9IHJvd3Nbcm93XVsyXT09bnVsbD9cIlwiOnJvd3Nbcm93XVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ3B1YkRhdGUnXSA9IHJvd3Nbcm93XVszXT09bnVsbD9cIlwiOnJvd3Nbcm93XVszXTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmlkID0gcm93c1tyb3ddWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50aXRsZSA9IHJvd3Nbcm93XVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3ViVGl0bGUgPSByb3dzW3Jvd11bMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN1bW1hcnkgPSByb3dzW3Jvd11bM107XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmRlc2NyaXB0aW9uID0gcm93c1tyb3ddWzRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5saW5rID0gcm93c1tyb3ddWzVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmVuY2xvc3VyZV9saW5rID0gcm93c1tyb3ddWzZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5lbmNsb3N1cmVfbGVuZ3RoID0gcm93c1tyb3ddWzddO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5lbmNsb3N1cmVfdHlwZSA9IHJvd3Nbcm93XVs4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZHVyYXRpb24gPSByb3dzW3Jvd11bOV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnB1YkRhdGUgPSByb3dzW3Jvd11bMTBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNjcmlwdFVybCA9IHJvd3Nbcm93XVsxMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNjcmlwdHVyZSA9IHJvd3Nbcm93XVsxMl07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udXVpZCA9IHJvd3Nbcm93XVsxM107XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNiKGl0ZW1zKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnI9PntcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ290IGVycm9yIGhlcmUnLCBlcnIpO1xuICAgICAgICAgICAgICAgIC8vaWYgdGhlcmUgYXJlIGVycm9yIGluIERCLCB3ZSBuZWVkIHRvIGNsZWFuIGRiXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckRCKCgpPT5jYihbXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0pO1xufVxufVxuIl19