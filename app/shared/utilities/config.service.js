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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWcuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyw2REFBK0M7QUFHL0M7SUFBQTtJQXFCQSxDQUFDO0lBbkJHLG1DQUFXLEdBQVg7UUFDSSxNQUFNLENBQUM7WUFDSCxFQUFFLEVBQUUsK0NBQStDO1lBQ25ELDRDQUE0QztZQUM1QyxTQUFTLEVBQUUsK0NBQStDO1lBQzFELFNBQVMsRUFBRSxvQ0FBb0M7WUFDL0MsTUFBTSxFQUFFLDRDQUE0QztTQUN2RCxDQUFBO0lBQ0wsQ0FBQztJQUVELGlDQUFTLEdBQVQ7UUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCx1Q0FBZSxHQUFmO1FBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUMxQixDQUFDO0lBQ0QsMENBQWtCLEdBQWxCO1FBQ0ksTUFBTSxDQUFDLGdDQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFwQlEsYUFBYTtRQUR6QixpQkFBVSxFQUFFO09BQ0EsYUFBYSxDQXFCekI7SUFBRCxvQkFBQztDQUFBLEFBckJELElBcUJDO0FBckJZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtnZXRTdHJpbmd9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29uZmlnU2VydmljZSB7XG5cbiAgICBnZXRGZWVkVXJscygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcXQ6ICdodHRwczovL2hvYzUubmV0L3F0L1BvZGNhc3RHZW5lcmF0b3IvZmVlZC54bWwnLFxuICAgICAgICAgICAgLy9xdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDIwMC9kZW1vX2RhdGEueG1sJyxcbiAgICAgICAgICAgIHdlZWtseV96aDogJ2h0dHA6Ly93d3cuaG9jNS5uZXQvUG9kY2FzdEdlbmVyYXRvci9mZWVkLnhtbCcsXG4gICAgICAgICAgICB3ZWVrbHlfZW46ICdodHRwOi8vaG9jNS51cy9wb2RjYXN0Z2VuL2ZlZWQueG1sJyxcbiAgICAgICAgICAgIHNpc3RlcjogJ2h0dHA6Ly9ob2M1LnVzL3Npc3RlcnMvcG9kY2FzdGdlbi9mZWVkLnhtbCdcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldERCTmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ2hvYzUuZGInO1xuICAgIH1cbiAgICBnZXRDdXN0b21EQk5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdob2M1X2N1c3QuZGInO1xuICAgIH1cbiAgICBnZXREZWZhdWx0TGFuZ3VhZ2UoKTpzdHJpbmd7XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmcoXCJsYW5ndWFnZVwiLCBcInpoXCIpO1xuICAgIH1cbn1cbiJdfQ==