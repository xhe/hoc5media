"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var config_service_1 = require("../utilities/config.service");
var entities_1 = require("../entities/entities");
var Sqlite = require("nativescript-sqlite");
var CustomDbService = (function () {
    function CustomDbService(configService) {
        this.configService = configService;
        this._prepareDb();
    }
    CustomDbService.prototype.clearDB = function (cb) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        console.log('start clearning db');
        this._prepareDb(function () {
            console.log('db prepared here');
            //delete dataBase first
            _this.database.execSQL('DROP TABLE IF EXISTS CustomItem').then(function () {
                console.log('table is dropped');
                _this.database.execSQL('DROP INDEX  IF EXISTS idx_CustomItem_uuid').then(function () {
                    console.log('index is dropped');
                    _this._createCustomItemTable(cb);
                });
            }, function (err) {
                console.log('dropping table error here', err);
                //if table can not be dropped, we then need to delete database
                Sqlite.deleteDatabase(_this.configService.getCustomDBName());
                _this.dropDB(cb);
            });
        });
    };
    CustomDbService.prototype.dropDB = function (cb) {
        if (cb === void 0) { cb = null; }
        Sqlite.deleteDatabase(this.configService.getCustomDBName());
        console.log('now let us delete the whole database:', this.configService.getCustomDBName());
        if (cb)
            cb([]);
    };
    CustomDbService.prototype.getNotedItems = function (pageSize, page, cb) {
        var queryStr = "SELECT * FROM CustomItem where note!='' limit " + pageSize + " offset " + pageSize * (page - 1);
        this._queryData(queryStr, cb);
    };
    CustomDbService.prototype.getSimplifiedNotedItems = function (pageSize, page, cb) {
        var queryStr = "SELECT id, uuid FROM CustomItem where note!='' limit " + pageSize + " offset " + pageSize * (page - 1);
        this._queryData(queryStr, cb);
    };
    CustomDbService.prototype.getFavoritedItems = function (pageSize, page, cb) {
        var queryStr = "SELECT * FROM CustomItem where favorite=1 limit " + pageSize + " offset " + pageSize * (page - 1);
        this._queryData(queryStr, cb);
    };
    CustomDbService.prototype.getSimplifiedFavoritedItems = function (pageSize, page, cb) {
        var queryStr = "SELECT id, uuid FROM CustomItem where favorite=1 limit " + pageSize + " offset " + pageSize * (page - 1);
        this._queryData(queryStr, cb);
    };
    CustomDbService.prototype.getFavoritedItemUUIDs = function (pageSize, page, cb) {
        var _this = this;
        var queryStr = "SELECT uuid FROM CustomItem where favorite=1 limit " + pageSize + " offset " + pageSize * (page - 1);
        this._prepareDb(function () {
            console.log('db prepared finished, query string:', queryStr);
            _this.database.all(queryStr).then(function (rows) {
                console.log('find all the data ', rows.length);
                var uuids = [];
                for (var row in rows) {
                    uuids.push(rows[row][0]);
                }
                cb(uuids);
            }, function (err) {
                console.log('got error here', err);
                //if there are error in DB, we need to clean db
                _this.clearDB(function () { return cb([]); });
            });
        });
    };
    CustomDbService.prototype.getNotedtemUUIDs = function (pageSize, page, cb) {
        var _this = this;
        var queryStr = "SELECT uuid FROM CustomItem where note!='' limit " + pageSize + " offset " + pageSize * (page - 1);
        this._prepareDb(function () {
            console.log('db prepared finished, query string:', queryStr);
            _this.database.all(queryStr).then(function (rows) {
                console.log('find all the data ', rows.length);
                var uuids = [];
                for (var row in rows) {
                    uuids.push(rows[row][0]);
                }
                cb(uuids);
            }, function (err) {
                console.log('got error here', err);
                //if there are error in DB, we need to clean db
                _this.clearDB(function () { return cb([]); });
            });
        });
    };
    CustomDbService.prototype.getAllFavoriteItems = function (cb) {
        var _this = this;
        var q = "select count(*) from CustomItem where favorite=1";
        console.log('getAllFavoriteItems');
        this._prepareDb(function () {
            console.log('db prepared done');
            _this.database.get(q).then(function (row) {
                if (row[0] > 0) {
                    _this._queryData("SELECT * FROM CustomItem where favorite=1", cb);
                }
                else {
                    console.log('return empty here');
                    cb([]);
                }
            });
        });
    };
    CustomDbService.prototype.getAllFavoriteItemsSimplified = function (cb) {
        var _this = this;
        var q = "select count(*) from CustomItem where favorite=1";
        console.log('getAllFavoriteItems');
        this._prepareDb(function () {
            console.log('db prepared done');
            _this.database.get(q).then(function (row) {
                console.log('query result is ');
                console.log(JSON.stringify(row));
                if (row[0] > 0) {
                    _this._queryData("SELECT id, uuid FROM CustomItem where favorite=1", cb);
                }
                else {
                    console.log('return empty here');
                    cb([]);
                }
            });
        });
    };
    CustomDbService.prototype.getFavoriteItemFor = function (uuid, cb) {
        var query = "select * from CustomItem where uuid = " + uuid;
        console.log('query===>', query);
        this._queryData(query, cb);
    };
    CustomDbService.prototype.getAllNotedItems = function (cb) {
        var _this = this;
        var q = "select count(*) from CustomItem where note !=''";
        console.log('query str ', q);
        this._prepareDb(function () {
            console.log('cust db prepard ');
            _this.database.get(q).then(function (row) {
                console.log('cust result is ', row[0]);
                if (row[0] > 0) {
                    _this._queryData("SELECT * FROM CustomItem where note !=''", cb);
                }
                else {
                    cb([]);
                }
            });
        });
    };
    CustomDbService.prototype.getAllNotedItemsSimplified = function (cb) {
        var _this = this;
        var q = "select count(*) from CustomItem where note !=''";
        console.log('query str ', q);
        this._prepareDb(function () {
            console.log('cust db prepard ');
            _this.database.get(q).then(function (row) {
                console.log('cust result is ', row[0]);
                if (row[0] > 0) {
                    _this._queryData("SELECT id, uuid FROM CustomItem where note !=''", cb);
                }
                else {
                    cb([]);
                }
            });
        });
    };
    CustomDbService.prototype.getAll = function (cb) {
        this._queryData("SELECT * FROM CustomItem", cb);
    };
    CustomDbService.prototype.updateCustomItemFor = function (uuid, updateField, updateValue, cb) {
        var _this = this;
        //first search to see if it existes
        var query = "select count(*) from CustomItem where uuid = " + uuid;
        console.log('query customItem: ', query);
        this._prepareDb(function () {
            _this.database.get(query).then(function (row) {
                var queryStr;
                console.log('rowf found ', JSON.stringify(row));
                if (row[0] == 0) {
                    queryStr = "INSERT INTO CustomItem (" + updateField + ", uuid) VALUES (?,?)";
                    _this.database.execSQL(queryStr, [updateValue, uuid])
                        .then(function (id) {
                        if (cb)
                            cb();
                    }, function (error) {
                        console.log("Update ERROR", JSON.stringify(error), queryStr);
                    });
                }
                else {
                    //inserting
                    queryStr = "UPDATE CustomItem set " + updateField + " = ? where uuid=?";
                    console.log('update here ', queryStr, updateValue, uuid);
                    _this.database.execSQL(queryStr, [updateValue, uuid])
                        .then(function (id) {
                        console.log('Successfully updated customItem for ', id);
                        if (cb)
                            cb();
                    }, function (error) {
                        console.log("Update ERROR", JSON.stringify(error));
                    });
                }
            }, function (err) {
                console.log('getting error for query ', query);
                console.log(err);
            });
        });
    };
    CustomDbService.prototype._prepareDb = function (cb) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        if (this.database && this.database.isOpen) {
            if (cb)
                cb();
        }
        else {
            (new Sqlite(this.configService.getCustomDBName())).then(function (db) {
                _this.database = db;
                _this._createCustomItemTable(cb);
            }, function (error) {
                console.log("OPEN DB ERROR", error);
            });
        }
    };
    //CREATE UNIQUE INDEX idx_CustomItem_uuid ON CustomItem (uuid);
    CustomDbService.prototype._createCustomItemTable = function (cb) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        this.database.execSQL("CREATE TABLE IF NOT EXISTS CustomItem\n        (id INTEGER PRIMARY KEY, title TEXT, note TEXT, favorite INTEGER, uuid INTEGER )\n    ")
            .then(function (id) {
            //if (cb) cb();
            console.log('CustomItem table is created here');
            _this.database.execSQL("CREATE INDEX idx_CustomItem_uuid ON CustomItem (uuid)")
                .then(function (id) {
                console.log('CustomItem index is created here');
                if (cb)
                    cb();
            }, function (error) {
                console.log("CREATE CustomItem TABLE ERROR", error);
            });
        }, function (error) {
            console.log("CREATE CustomItem TABLE ERROR", error);
        });
    };
    CustomDbService.prototype._queryData = function (queryStr, cb) {
        var _this = this;
        console.log('query data:', queryStr);
        this._prepareDb(function () {
            console.log('db prepared finished, query string:', queryStr);
            _this.database.all(queryStr).then(function (rows) {
                console.log('find all the data ', rows.length);
                var customItems = new Array();
                for (var row in rows) {
                    var item = new entities_1.CustomItem();
                    if (rows[row].length == 2) {
                        //this is simplifed mode, only UUID is needed
                        item.id = rows[row][0];
                        item.uuid = rows[row][1];
                    }
                    else {
                        item.id = rows[row][0];
                        item.title = rows[row][1];
                        item.note = rows[row][2];
                        item.favorite = rows[row][3];
                        item.uuid = rows[row][4];
                    }
                    customItems.push(item);
                }
                cb(customItems);
            }, function (err) {
                console.log('got error here', err);
                //if there are error in DB, we need to clean db
                _this.clearDB(function () { return cb([]); });
            });
        });
    };
    CustomDbService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [config_service_1.ConfigService])
    ], CustomDbService);
    return CustomDbService;
}());
exports.CustomDbService = CustomDbService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tX2RiLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b21fZGIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUN6Qyw4REFBMEQ7QUFDMUQsaURBQWdEO0FBRWhELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRzVDO0lBSUkseUJBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0saUNBQU8sR0FBZCxVQUFlLEVBQVM7UUFBeEIsaUJBb0JIO1FBcEJrQixtQkFBQSxFQUFBLFNBQVM7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDaEMsdUJBQXVCO1lBQ3ZCLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ2hDLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ2hDLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxDQUFDLENBQUM7WUFDUixDQUFDLEVBQ0QsVUFBQSxHQUFHO2dCQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLDhEQUE4RDtnQkFDOUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsYUFBYSxD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Q0FBQyxDQUFDO1lBQ3BCLENBQUMsRUFDRCxVQUFBLEdBQUc7Z0JBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbkMsK0NBQStDO2dCQUMvQyxLQUFJLENBQUMsT0FBTyxDQUFDLGNBQUksT0FBQSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQU4sQ0FBTSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNILENBQUM7SUFqU1ksZUFBZTtRQUQzQixpQkFBVSxFQUFFO3lDQUswQiw4QkFBYTtPQUp2QyxlQUFlLENBa1MzQjtJQUFELHNCQUFDO0NBQUEsQUFsU0QsSUFrU0M7QUFsU1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge0NvbmZpZ1NlcnZpY2V9IGZyb20gXCIuLi91dGlsaXRpZXMvY29uZmlnLnNlcnZpY2VcIjtcbmltcG9ydCB7Q3VzdG9tSXRlbX0gZnJvbSAnLi4vZW50aXRpZXMvZW50aXRpZXMnO1xuXG52YXIgU3FsaXRlID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1zcWxpdGVcIik7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDdXN0b21EYlNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBkYXRhYmFzZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWdTZXJ2aWNlOiBDb25maWdTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuX3ByZXBhcmVEYigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckRCKGNiID0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnQgY2xlYXJuaW5nIGRiJyk7XG4gICAgICAgIHRoaXMuX3ByZXBhcmVEYigoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGIgcHJlcGFyZWQgaGVyZScpO1xuICAgICAgICAgICAgLy9kZWxldGUgZGF0YUJhc2UgZmlyc3RcbiAgICAgICAgICAgIHRoaXMuZGF0YWJhc2UuZXhlY1NRTCgnRFJPUCBUQUJMRSBJRiBFWElTVFMgQ3VzdG9tSXRlbScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YWJsZSBpcyBkcm9wcGVkJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhYmFzZS5leGVjU1FMKCdEUk9QIElOREVYICBJRiBFWElTVFMgaWR4X0N1c3RvbUl0ZW1fdXVpZCcpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luZGV4IGlzIGRyb3BwZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUN1c3RvbUl0ZW1UYWJsZShjYik7XG4gICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycj0+e1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkcm9wcGluZyB0YWJsZSBlcnJvciBoZXJlJywgZXJyKTtcbiAgICAgICAgICAgICAgICAvL2lmIHRhYmxlIGNhbiBub3QgYmUgZHJvcHBlZCwgd2UgdGhlbiBuZWVkIHRvIGRlbGV0ZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgIFNxbGl0ZS5kZWxldGVEYXRhYmFzZSh0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0Q3VzdG9tREJOYW1lKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcERCKGNiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9KTtcbn1cblxucHVibGljIGRyb3BEQihjYj1udWxsKXtcbiAgICBTcWxpdGUuZGVsZXRlRGF0YWJhc2UodGhpcy5jb25maWdTZXJ2aWNlLmdldEN1c3RvbURCTmFtZSgpKTtcbiAgICBjb25zb2xlLmxvZygnbm93IGxldCB1cyBkZWxldGUgdGhlIHdob2xlIGRhdGFiYXNlOicsIHRoaXMuY29uZmlnU2VydmljZS5nZXRDdXN0b21EQk5hbWUoKSk7XG4gICAgaWYoY2IpXG4gICAgY2IoW10pO1xufVxuXG5wdWJsaWMgZ2V0Tm90ZWRJdGVtcyhwYWdlU2l6ZSwgcGFnZSwgY2Ipe1xuICAgIGxldCBxdWVyeVN0cjogc3RyaW5nID0gYFNFTEVDVCAqIEZST00gQ3VzdG9tSXRlbSB3aGVyZSBub3RlIT0nJyBsaW1pdCAke3BhZ2VTaXplfSBvZmZzZXQgJHtwYWdlU2l6ZSAqIChwYWdlIC0gMSl9YDtcbiAgICB0aGlzLl9xdWVyeURhdGEocXVlcnlTdHIsIGNiKTtcbn1cblxucHVibGljIGdldFNpbXBsaWZpZWROb3RlZEl0ZW1zKHBhZ2VTaXplLCBwYWdlLCBjYil7XG4gICAgbGV0IHF1ZXJ5U3RyOiBzdHJpbmcgPSBgU0VMRUNUIGlkLCB1dWlkIEZST00gQ3VzdG9tSXRlbSB3aGVyZSBub3RlIT0nJyBsaW1pdCAke3BhZ2VTaXplfSBvZmZzZXQgJHtwYWdlU2l6ZSAqIChwYWdlIC0gMSl9YDtcbiAgICB0aGlzLl9xdWVyeURhdGEocXVlcnlTdHIsIGNiKTtcbn1cblxucHVibGljIGdldEZhdm9yaXRlZEl0ZW1zKHBhZ2VTaXplLCBwYWdlLCBjYil7XG4gICAgbGV0IHF1ZXJ5U3RyOiBzdHJpbmcgPSBgU0VMRUNUICogRlJPTSBDdXN0b21JdGVtIHdoZXJlIGZhdm9yaXRlPTEgbGltaXQgJHtwYWdlU2l6ZX0gb2Zmc2V0ICR7cGFnZVNpemUgKiAocGFnZSAtIDEpfWA7XG4gICAgdGhpcy5fcXVlcnlEYXRhKHF1ZXJ5U3RyLCBjYik7XG59XG5cbnB1YmxpYyBnZXRTaW1wbGlmaWVkRmF2b3JpdGVkSXRlbXMocGFnZVNpemUsIHBhZ2UsIGNiKXtcbiAgICBsZXQgcXVlcnlTdHI6IHN0cmluZyA9IGBTRUxFQ1QgaWQsIHV1aWQgRlJPTSBDdXN0b21JdGVtIHdoZXJlIGZhdm9yaXRlPTEgbGltaXQgJHtwYWdlU2l6ZX0gb2Zmc2V0ICR7cGFnZVNpemUgKiAocGFnZSAtIDEpfWA7XG4gICAgdGhpcy5fcXVlcnlEYXRhKHF1ZXJ5U3RyLCBjYik7XG59XG5cbnB1YmxpYyBnZXRGYXZvcml0ZWRJdGVtVVVJRHMocGFnZVNpemUsIHBhZ2UsIGNiKXtcbiAgICBsZXQgcXVlcnlTdHI6IHN0cmluZyA9IGBTRUxFQ1QgdXVpZCBGUk9NIEN1c3RvbUl0ZW0gd2hlcmUgZmF2b3JpdGU9MSBsaW1pdCAke3BhZ2VTaXplfSBvZmZzZXQgJHtwYWdlU2l6ZSAqIChwYWdlIC0gMSl9YDtcbiAgICB0aGlzLl9wcmVwYXJlRGIoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnZGIgcHJlcGFyZWQgZmluaXNoZWQsIHF1ZXJ5IHN0cmluZzonLCBxdWVyeVN0cik7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UuYWxsKHF1ZXJ5U3RyKS50aGVuKHJvd3MgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmQgYWxsIHRoZSBkYXRhICcsIHJvd3MubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciB1dWlkcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgcm93IGluIHJvd3MpIHtcbiAgICAgICAgICAgICAgICB1dWlkcy5wdXNoKHJvd3Nbcm93XVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYih1dWlkcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycj0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2dvdCBlcnJvciBoZXJlJywgZXJyKTtcbiAgICAgICAgICAgIC8vaWYgdGhlcmUgYXJlIGVycm9yIGluIERCLCB3ZSBuZWVkIHRvIGNsZWFuIGRiXG4gICAgICAgICAgICB0aGlzLmNsZWFyREIoKCk9PmNiKFtdKSk7XG4gICAgICAgIH1cbiAgICApO1xufSk7XG59XG5cbnB1YmxpYyBnZXROb3RlZHRlbVVVSURzKHBhZ2VTaXplLCBwYWdlLCBjYil7XG4gICAgbGV0IHF1ZXJ5U3RyOiBzdHJpbmcgPSBgU0VMRUNUIHV1aWQgRlJPTSBDdXN0b21JdGVtIHdoZXJlIG5vdGUhPScnIGxpbWl0ICR7cGFnZVNpemV9IG9mZnNldCAke3BhZ2VTaXplICogKHBhZ2UgLSAxKX1gO1xuICAgIHRoaXMuX3ByZXBhcmVEYigoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkYiBwcmVwYXJlZCBmaW5pc2hlZCwgcXVlcnkgc3RyaW5nOicsIHF1ZXJ5U3RyKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZS5hbGwocXVlcnlTdHIpLnRoZW4ocm93cyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluZCBhbGwgdGhlIGRhdGEgJywgcm93cy5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIHV1aWRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciByb3cgaW4gcm93cykge1xuICAgICAgICAgICAgICAgIHV1aWRzLnB1c2gocm93c1tyb3ddWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNiKHV1aWRzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZ290IGVycm9yIGhlcmUnLCBlcnIpO1xuICAgICAgICAgICAgLy9pZiB0aGVyZSBhcmUgZXJyb3IgaW4gREIsIHdlIG5lZWQgdG8gY2xlYW4gZGJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEQigoKT0+Y2IoW10pKTtcbiAgICAgICAgfVxuICAgICk7XG59KTtcbn1cblxucHVibGljIGdldEFsbEZhdm9yaXRlSXRlbXMoY2Ipe1xuICAgIHZhciBxID0gXCJzZWxlY3QgY291bnQoKikgZnJvbSBDdXN0b21JdGVtIHdoZXJlIGZhdm9yaXRlPTFcIjtcbiAgICBjb25zb2xlLmxvZyggJ2dldEFsbEZhdm9yaXRlSXRlbXMnKTtcbiAgICB0aGlzLl9wcmVwYXJlRGIoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnZGIgcHJlcGFyZWQgZG9uZScpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlLmdldChxKS50aGVuKHJvdz0+e1xuICAgICAgICAgICAgaWYocm93WzBdPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuX3F1ZXJ5RGF0YShcIlNFTEVDVCAqIEZST00gQ3VzdG9tSXRlbSB3aGVyZSBmYXZvcml0ZT0xXCIsIGNiKVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JldHVybiBlbXB0eSBoZXJlJyk7XG4gICAgICAgICAgICAgICAgY2IoW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxucHVibGljIGdldEFsbEZhdm9yaXRlSXRlbXNTaW1wbGlmaWVkKGNiKXtcbiAgICB2YXIgcSA9IFwic2VsZWN0IGNvdW50KCopIGZyb20gQ3VzdG9tSXRlbSB3aGVyZSBmYXZvcml0ZT0xXCI7XG4gICAgY29uc29sZS5sb2coICdnZXRBbGxGYXZvcml0ZUl0ZW1zJyk7XG4gICAgdGhpcy5fcHJlcGFyZURiKCgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RiIHByZXBhcmVkIGRvbmUnKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZS5nZXQocSkudGhlbihyb3c9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdxdWVyeSByZXN1bHQgaXMgJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyb3cpKTtcbiAgICAgICAgICAgIGlmKHJvd1swXT4wKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9xdWVyeURhdGEoXCJTRUxFQ1QgaWQsIHV1aWQgRlJPTSBDdXN0b21JdGVtIHdoZXJlIGZhdm9yaXRlPTFcIiwgY2IpXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmV0dXJuIGVtcHR5IGhlcmUnKTtcbiAgICAgICAgICAgICAgICBjYihbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5wdWJsaWMgZ2V0RmF2b3JpdGVJdGVtRm9yKHV1aWQsIGNiKXtcbiAgICBsZXQgcXVlcnkgPSBgc2VsZWN0ICogZnJvbSBDdXN0b21JdGVtIHdoZXJlIHV1aWQgPSAke3V1aWR9YDtcbiAgICBjb25zb2xlLmxvZygncXVlcnk9PT0+JywgcXVlcnkpO1xuICAgIHRoaXMuX3F1ZXJ5RGF0YShxdWVyeSwgY2IpO1xufVxuXG5wdWJsaWMgZ2V0QWxsTm90ZWRJdGVtcyhjYil7XG4gICAgdmFyIHEgPSBcInNlbGVjdCBjb3VudCgqKSBmcm9tIEN1c3RvbUl0ZW0gd2hlcmUgbm90ZSAhPScnXCI7XG4gICAgY29uc29sZS5sb2coJ3F1ZXJ5IHN0ciAnLCBxKTtcbiAgICB0aGlzLl9wcmVwYXJlRGIoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnY3VzdCBkYiBwcmVwYXJkICcpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlLmdldChxKS50aGVuKHJvdz0+e1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjdXN0IHJlc3VsdCBpcyAnLCByb3dbMF0pO1xuICAgICAgICAgICAgaWYocm93WzBdPjApe1xuICAgICAgICAgICAgICAgIHRoaXMuX3F1ZXJ5RGF0YShcIlNFTEVDVCAqIEZST00gQ3VzdG9tSXRlbSB3aGVyZSBub3RlICE9JydcIiwgY2IpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY2IoW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxucHVibGljIGdldEFsbE5vdGVkSXRlbXNTaW1wbGlmaWVkKGNiKXtcbiAgICB2YXIgcSA9IFwic2VsZWN0IGNvdW50KCopIGZyb20gQ3VzdG9tSXRlbSB3aGVyZSBub3RlICE9JydcIjtcbiAgICBjb25zb2xlLmxvZygncXVlcnkgc3RyICcsIHEpO1xuICAgIHRoaXMuX3ByZXBhcmVEYigoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjdXN0IGRiIHByZXBhcmQgJyk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UuZ2V0KHEpLnRoZW4ocm93PT57XG4gICAgICAgICAgICAgY29uc29sZS5sb2coJ2N1c3QgcmVzdWx0IGlzICcsIHJvd1swXSk7XG4gICAgICAgICAgICBpZihyb3dbMF0+MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fcXVlcnlEYXRhKFwiU0VMRUNUIGlkLCB1dWlkIEZST00gQ3VzdG9tSXRlbSB3aGVyZSBub3RlICE9JydcIiwgY2IpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY2IoW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxucHVibGljIGdldEFsbChjYil7XG4gICAgdGhpcy5fcXVlcnlEYXRhKFwiU0VMRUNUICogRlJPTSBDdXN0b21JdGVtXCIsIGNiKVxufVxuXG5wdWJsaWMgdXBkYXRlQ3VzdG9tSXRlbUZvcih1dWlkOm51bWJlciwgdXBkYXRlRmllbGQ6c3RyaW5nLCB1cGRhdGVWYWx1ZTphbnksIGNiKXtcbiAgICAvL2ZpcnN0IHNlYXJjaCB0byBzZWUgaWYgaXQgZXhpc3Rlc1xuICAgIGxldCBxdWVyeSA9IGBzZWxlY3QgY291bnQoKikgZnJvbSBDdXN0b21JdGVtIHdoZXJlIHV1aWQgPSAke3V1aWR9YDtcbiAgICBjb25zb2xlLmxvZygncXVlcnkgY3VzdG9tSXRlbTogJywgcXVlcnkpO1xuICAgIHRoaXMuX3ByZXBhcmVEYigoKSA9PiB7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UuZ2V0KHF1ZXJ5KS50aGVuKHJvdz0+e1xuXG4gICAgICAgICAgICB2YXIgIHF1ZXJ5U3RyO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jvd2YgZm91bmQgJywgSlNPTi5zdHJpbmdpZnkocm93KSk7XG4gICAgICAgICAgICBpZihyb3dbMF09PTApe1xuXG4gICAgICAgICAgICAgICAgcXVlcnlTdHIgPSBgSU5TRVJUIElOVE8gQ3VzdG9tSXRlbSAoJHt1cGRhdGVGaWVsZH0sIHV1aWQpIFZBTFVFUyAoPyw/KWA7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhYmFzZS5leGVjU1FMKHF1ZXJ5U3RyLCBbdXBkYXRlVmFsdWUsIHV1aWRdKVxuICAgICAgICAgICAgICAgIC50aGVuKGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNiKSBjYigpO1xuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGRhdGUgRVJST1JcIiwgSlNPTi5zdHJpbmdpZnkoZXJyb3IpLCBxdWVyeVN0ciApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAvL2luc2VydGluZ1xuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyID0gYFVQREFURSBDdXN0b21JdGVtIHNldCAke3VwZGF0ZUZpZWxkfSA9ID8gd2hlcmUgdXVpZD0/YDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ3VwZGF0ZSBoZXJlICcsIHF1ZXJ5U3RyLCB1cGRhdGVWYWx1ZSwgdXVpZClcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFiYXNlLmV4ZWNTUUwocXVlcnlTdHIsIFt1cGRhdGVWYWx1ZSwgdXVpZF0pXG4gICAgICAgICAgICAgICAgLnRoZW4oaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IHVwZGF0ZWQgY3VzdG9tSXRlbSBmb3IgJywgaWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2IpIGNiKCk7XG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZSBFUlJPUlwiLCBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGVycj0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldHRpbmcgZXJyb3IgZm9yIHF1ZXJ5ICcscXVlcnkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgfSk7XG59XG5cbnByaXZhdGUgX3ByZXBhcmVEYihjYiA9IG51bGwpIHtcblxuICAgIGlmICh0aGlzLmRhdGFiYXNlICYmIHRoaXMuZGF0YWJhc2UuaXNPcGVuKSB7XG4gICAgICAgIGlmIChjYikgY2IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAobmV3IFNxbGl0ZSh0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0Q3VzdG9tREJOYW1lKCkpKS50aGVuKGRiID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YWJhc2UgPSBkYjtcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUN1c3RvbUl0ZW1UYWJsZShjYik7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT1BFTiBEQiBFUlJPUlwiLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuLy9DUkVBVEUgVU5JUVVFIElOREVYIGlkeF9DdXN0b21JdGVtX3V1aWQgT04gQ3VzdG9tSXRlbSAodXVpZCk7XG5wcml2YXRlIF9jcmVhdGVDdXN0b21JdGVtVGFibGUoY2IgPSBudWxsKSB7XG4gICAgdGhpcy5kYXRhYmFzZS5leGVjU1FMKGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBDdXN0b21JdGVtXG4gICAgICAgIChpZCBJTlRFR0VSIFBSSU1BUlkgS0VZLCB0aXRsZSBURVhULCBub3RlIFRFWFQsIGZhdm9yaXRlIElOVEVHRVIsIHV1aWQgSU5URUdFUiApXG4gICAgYClcbiAgICAudGhlbihcbiAgICAgICAgaWQgPT4ge1xuICAgICAgICAgICAgLy9pZiAoY2IpIGNiKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ3VzdG9tSXRlbSB0YWJsZSBpcyBjcmVhdGVkIGhlcmUnKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YWJhc2UuZXhlY1NRTChgQ1JFQVRFIElOREVYIGlkeF9DdXN0b21JdGVtX3V1aWQgT04gQ3VzdG9tSXRlbSAodXVpZClgKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgaWQ9PntcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0N1c3RvbUl0ZW0gaW5kZXggaXMgY3JlYXRlZCBoZXJlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYikgY2IoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yPT57XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ1JFQVRFIEN1c3RvbUl0ZW0gVEFCTEUgRVJST1JcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDUkVBVEUgQ3VzdG9tSXRlbSBUQUJMRSBFUlJPUlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5wcml2YXRlIF9xdWVyeURhdGEocXVlcnlTdHI6IHN0cmluZywgY2IpIHtcbiAgICBjb25zb2xlLmxvZygncXVlcnkgZGF0YTonLCBxdWVyeVN0cik7XG4gICAgdGhpcy5fcHJlcGFyZURiKCgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RiIHByZXBhcmVkIGZpbmlzaGVkLCBxdWVyeSBzdHJpbmc6JywgcXVlcnlTdHIpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlLmFsbChxdWVyeVN0cikudGhlbihyb3dzID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5kIGFsbCB0aGUgZGF0YSAnLCByb3dzLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgY3VzdG9tSXRlbXM6IEN1c3RvbUl0ZW1bXSA9IG5ldyBBcnJheTxDdXN0b21JdGVtPigpO1xuICAgICAgICAgICAgZm9yICh2YXIgcm93IGluIHJvd3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBDdXN0b21JdGVtKCk7XG4gICAgICAgICAgICAgICAgaWYocm93c1tyb3ddLmxlbmd0aD09Mil7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcyBpcyBzaW1wbGlmZWQgbW9kZSwgb25seSBVVUlEIGlzIG5lZWRlZFxuICAgICAgICAgICAgICAgICAgICBpdGVtLmlkID0gcm93c1tyb3ddWzBdO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnV1aWQgPSByb3dzW3Jvd11bMV07XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaWQgPSByb3dzW3Jvd11bMF07XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udGl0bGUgPSByb3dzW3Jvd11bMV07XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubm90ZSA9IHJvd3Nbcm93XVsyXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5mYXZvcml0ZSA9IHJvd3Nbcm93XVszXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS51dWlkID0gcm93c1tyb3ddWzRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXN0b21JdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2IoY3VzdG9tSXRlbXMpO1xuICAgICAgICB9LFxuICAgICAgICBlcnI9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnb3QgZXJyb3IgaGVyZScsIGVycik7XG4gICAgICAgICAgICAvL2lmIHRoZXJlIGFyZSBlcnJvciBpbiBEQiwgd2UgbmVlZCB0byBjbGVhbiBkYlxuICAgICAgICAgICAgdGhpcy5jbGVhckRCKCgpPT5jYihbXSkpO1xuICAgICAgICB9XG4gICAgKTtcbn0pO1xufVxufVxuIl19