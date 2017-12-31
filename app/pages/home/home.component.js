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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUVsRCxpRUFBNkQ7QUFDN0Qsd0VBQW9FO0FBT3BFO0lBR0ksdUJBQW9CLFVBQXFCLEVBQVUsYUFBMkI7UUFBMUQsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQzFFLElBQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVELDZCQUFLLEdBQUwsVUFBTSxFQUFFLEVBQUUsRUFBRTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUdELHNDQUFjLEdBQWQsVUFBZSxJQUFJO1FBQ2YsSUFBSSxhQUFhLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0wsQ0FBQztJQW5CUSxhQUFhO1FBTHpCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHVCQUF1QjtZQUNwQyxTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxZQUFZLENBQUM7U0FDcEQsQ0FBQzt5Q0FJaUMsd0JBQVUsRUFBd0IsOEJBQWE7T0FIckUsYUFBYSxDQW9CekI7SUFBRCxvQkFBQztDQUFBLEFBcEJELElBb0JDO0FBcEJZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgU3dpdGNoIH0gZnJvbSBcInVpL3N3aXRjaFwiO1xuaW1wb3J0IHtSc3NTZXJ2aWNlfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvcnNzLnNlcnZpY2UnO1xuaW1wb3J0IHtDb25maWdTZXJ2aWNlfSBmcm9tICcuLi8uLi9zaGFyZWQvdXRpbGl0aWVzL2NvbmZpZy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2hvbWUuY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFsnLi9ob21lLmNvbXBvbmVudC5jc3MnLCAnLi9ob21lLmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQge1xuXG4gICAgbGFuZzpzdHJpbmc7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByc3NTZXJ2aWNlOlJzc1NlcnZpY2UsIHByaXZhdGUgY29uZmlnU2VydmljZTpDb25maWdTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMubGFuZyA9IGNvbmZpZ1NlcnZpY2UuZ2V0RGVmYXVsdExhbmd1YWdlKCk7XG4gICAgfVxuXG4gICAgdHJhbnMoZW4sIHpoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucnNzU2VydmljZS50cmFucyhlbiwgemgpO1xuICAgIH1cblxuXG4gICAgY2hhbmdlTGFuZ3VhZ2UoYXJncykge1xuICAgICAgICBsZXQgbGFuZ3VhZ2V3aXRjaCA9IDxTd2l0Y2g+YXJncy5vYmplY3Q7XG4gICAgICAgIGlmIChsYW5ndWFnZXdpdGNoLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHRoaXMucnNzU2VydmljZS5zZXRMYW5ndWFnZShcInpoXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLnNldExhbmd1YWdlKCdlbicpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19