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
            templateUrl: "./pages/home/home.component.html",
            styleUrls: ['./pages/home/home.component.css', './pages/home/home.css']
        }),
        __metadata("design:paramtypes", [rss_service_1.RssService, config_service_1.ConfigService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUVsRCxpRUFBNkQ7QUFDN0Qsd0VBQW9FO0FBTXBFO0lBR0ksdUJBQW9CLFVBQXFCLEVBQVUsYUFBMkI7UUFBMUQsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQzFFLElBQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVELDZCQUFLLEdBQUwsVUFBTSxFQUFFLEVBQUUsRUFBRTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUdELHNDQUFjLEdBQWQsVUFBZSxJQUFJO1FBQ2YsSUFBSSxhQUFhLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0wsQ0FBQztJQW5CUSxhQUFhO1FBSnpCLGdCQUFTLENBQUM7WUFDUCxXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLHVCQUF1QixDQUFDO1NBQzFFLENBQUM7eUNBSWlDLHdCQUFVLEVBQXdCLDhCQUFhO09BSHJFLGFBQWEsQ0FvQnpCO0lBQUQsb0JBQUM7Q0FBQSxBQXBCRCxJQW9CQztBQXBCWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFN3aXRjaCB9IGZyb20gXCJ1aS9zd2l0Y2hcIjtcbmltcG9ydCB7UnNzU2VydmljZX0gZnJvbSAnLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Jzcy5zZXJ2aWNlJztcbmltcG9ydCB7Q29uZmlnU2VydmljZX0gZnJvbSAnLi4vLi4vc2hhcmVkL3V0aWxpdGllcy9jb25maWcuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHRlbXBsYXRlVXJsOiBcIi4vcGFnZXMvaG9tZS9ob21lLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbJy4vcGFnZXMvaG9tZS9ob21lLmNvbXBvbmVudC5jc3MnLCAnLi9wYWdlcy9ob21lL2hvbWUuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgSG9tZUNvbXBvbmVudCB7XG5cbiAgICBsYW5nOnN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJzc1NlcnZpY2U6UnNzU2VydmljZSwgcHJpdmF0ZSBjb25maWdTZXJ2aWNlOkNvbmZpZ1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5sYW5nID0gY29uZmlnU2VydmljZS5nZXREZWZhdWx0TGFuZ3VhZ2UoKTtcbiAgICB9XG5cbiAgICB0cmFucyhlbiwgemgpe1xuICAgICAgICByZXR1cm4gdGhpcy5yc3NTZXJ2aWNlLnRyYW5zKGVuLCB6aCk7XG4gICAgfVxuXG5cbiAgICBjaGFuZ2VMYW5ndWFnZShhcmdzKSB7XG4gICAgICAgIGxldCBsYW5ndWFnZXdpdGNoID0gPFN3aXRjaD5hcmdzLm9iamVjdDtcbiAgICAgICAgaWYgKGxhbmd1YWdld2l0Y2guY2hlY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5yc3NTZXJ2aWNlLnNldExhbmd1YWdlKFwiemhcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJzc1NlcnZpY2Uuc2V0TGFuZ3VhZ2UoJ2VuJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=