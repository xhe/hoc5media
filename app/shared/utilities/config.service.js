"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var application_settings_1 = require("application-settings");
var ConfigService = (function () {
    function ConfigService() {
    }
    ConfigService.prototype.getFeedUrls = function () {
        return {
            qt: 'https://hoc5.net/qt/PodcastGenerator/feed.xml',
            //qt: 'http://localhost:4200/demo_data.xml',
            weekly_zh: 'http://www.hoc5.net/PodcastGenerator/feed.xml',
            weekly_en: 'http://hoc5.us/podcastgen/feed.xml',
            sister: 'http://hoc5.us/sisters/podcastgen/feed.xml'
        };
    };
    ConfigService.prototype.getDBName = function () {
        return 'hoc5.db';
    };
    ConfigService.prototype.getCustomDBName = function () {
        return 'hoc5_cust.db';
    };
    ConfigService.prototype.getDefaultLanguage = function () {
        return application_settings_1.getString("language", "zh");
    };
    ConfigService = __decorate([
        core_1.Injectable()
    ], ConfigService);
    return ConfigService;
}());
exports.ConfigService = ConfigService;
