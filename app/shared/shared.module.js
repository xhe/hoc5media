"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rss_service_1 = require("./services/rss.service");
var config_service_1 = require("./utilities/config.service");
var request_service_1 = require("./utilities/request.service");
var db_service_1 = require("./services/db.service");
var custom_db_service_1 = require("./services/custom_db.service");
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            providers: [rss_service_1.RssService, config_service_1.ConfigService, request_service_1.RequestService, db_service_1.DbService, custom_db_service_1.CustomDbService]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
