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
