"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rss_service_1 = require("../../shared/services/rss.service");
var config_service_1 = require("../../shared/utilities/config.service");
var HomeComponent = (function () {
    function HomeComponent(rssService, configService) {
        this.rssService = rssService;
        this.configService = configService;
        this.lang = configService.getDefaultLanguage();
    }
    HomeComponent.prototype.trans = function (en, zh) {
        return this.rssService.trans(en, zh);
    };
    HomeComponent.prototype.changeLanguage = function (args) {
        var languagewitch = args.object;
        if (languagewitch.checked) {
            this.rssService.setLanguage("zh");
        }
        else {
            this.rssService.setLanguage('en');
        }
    };
    HomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./home.component.html",
            styleUrls: ['./home.component.css', './home.css']
        }),
        __metadata("design:paramtypes", [rss_service_1.RssService, config_service_1.ConfigService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
