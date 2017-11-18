"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rss_service_1 = require("../../shared/services/rss.service");
var db_service_1 = require("../../shared/services/db.service");
var custom_db_service_1 = require("../../shared/services/custom_db.service");
var dialogs_1 = require("ui/dialogs");
var DBComponent = (function () {
    function DBComponent(dbService, customDbService, rssService) {
        this.dbService = dbService;
        this.customDbService = customDbService;
        this.rssService = rssService;
        this.msg = "";
    }
    DBComponent.prototype.ngOnInit = function () {
    };
    DBComponent.prototype.cleanDB = function () {
        var _this = this;
        var options = {
            title: this.trans('Clean DB', '清理数据'),
            message: this.trans('Are you sure to clean data?', '您确认清理数据吗？'),
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        };
        dialogs_1.confirm(options).then(function (result) {
            if (result) {
                _this.dbService.clearDB(function () {
                    _this.msg = _this.trans("QT Database has been cleaned, please try again.", "每日灵修数据库已成功修复,请重试。");
                });
            }
        });
    };
    DBComponent.prototype.cleanCustomDB = function () {
        var _this = this;
        var options = {
            title: this.trans('Clean DB', '清理数据'),
            message: this.trans('Are you sure to clean data?', '您确认清理数据吗？'),
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        };
        dialogs_1.confirm(options).then(function (result) {
            if (result) {
                _this.customDbService.clearDB(function () {
                    _this.msg = _this.trans("Custom Database has been cleaned, please try again.", "用户数据库已成功修复,请重试。");
                    ;
                });
            }
        });
    };
    DBComponent.prototype.trans = function (en, zh) {
        return this.rssService.trans(en, zh);
    };
    DBComponent.prototype.backup = function () {
        console.log("backing up");
        this.rssService.backupCustomData();
    };
    DBComponent.prototype.testworker = function () {
        console.log('testing');
        var rssWorker = new Worker("../../shared/services/rss.worker");
        rssWorker.postMessage({ src: "abc", fileName: "zenyatta-bw.jpg", appDir: "123" });
        rssWorker.onmessage = function (msg) {
            console.log('msg backehre ');
            console.log(msg);
            rssWorker.terminate();
        };
        rssWorker.onerror = function (err) {
            console.log("An unhandled error occurred in worker: " + err.filename + ", line: " + err.lineno + " :");
            console.log(err.message);
        };
    };
    DBComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./db.component.html",
            styleUrls: ['./db.component.css']
        }),
        __metadata("design:paramtypes", [db_service_1.DbService, custom_db_service_1.CustomDbService,
            rss_service_1.RssService])
    ], DBComponent);
    return DBComponent;
}());
exports.DBComponent = DBComponent;
