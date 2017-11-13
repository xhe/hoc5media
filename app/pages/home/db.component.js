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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdEO0FBQ2hELGlFQUE2RDtBQUM3RCwrREFBMkQ7QUFDM0QsNkVBQXdFO0FBRXhFLHNDQUFxQztBQU9yQztJQUVJLHFCQUFvQixTQUFvQixFQUFVLGVBQStCLEVBQ3JFLFVBQXFCO1FBRGIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUNyRSxlQUFVLEdBQVYsVUFBVSxDQUFXO1FBRTdCLElBQUksQ0FBQyxHQUFHLEdBQUMsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFDRCw4QkFBUSxHQUFSO0lBRUEsQ0FBQztJQUVELDZCQUFPLEdBQVA7UUFBQSxpQkFpQkM7UUFoQkcsSUFBSSxPQUFPLEdBQUc7WUFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDO1lBQ3JDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLFdBQVcsQ0FBQztZQUMvRCxZQUFZLEVBQUUsS0FBSztZQUNuQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGlCQUFpQixFQUFFLFFBQVE7U0FDOUIsQ0FBQztRQUVGLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBZTtZQUNsQyxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO2dCQUNQLEtBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO29CQUNuQixLQUFJLENBQUMsR0FBRyxHQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsaURBQWlELEVBQ3RFLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELG1DQUFhLEdBQWI7UUFBQSxpQkFpQkM7UUFoQkcsSUFBSSxPQUFPLEdBQUc7WUFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDO1lBQ3JDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLFdBQVcsQ0FBQztZQUMvRCxZQUFZLEVBQUUsS0FBSztZQUNuQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGlCQUFpQixFQUFFLFFBQVE7U0FDOUIsQ0FBQztRQUVGLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBZTtZQUNsQyxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO2dCQUNQLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO29CQUN6QixLQUFJLENBQUMsR0FBRyxHQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMscURBQXFELEVBQzFFLGlCQUFpQixDQUFDLENBQUM7b0JBQUEsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsMkJBQUssR0FBTCxVQUFNLEVBQUUsRUFBRSxFQUFFO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsNEJBQU0sR0FBTjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFHRCxnQ0FBVSxHQUFWO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV2QixJQUFJLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQy9ELFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUVsRixTQUFTLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRztZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQTtRQUVELFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBUyxHQUFHO1lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTBDLEdBQUcsQ0FBQyxRQUFRLGdCQUFXLEdBQUcsQ0FBQyxNQUFNLE9BQUksQ0FBQyxDQUFDO1lBQzdGLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQTtJQUNMLENBQUM7SUEzRVEsV0FBVztRQUx2QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxxQkFBcUI7WUFDbEMsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDcEMsQ0FBQzt5Q0FHaUMsc0JBQVMsRUFBMEIsbUNBQWU7WUFDMUQsd0JBQVU7T0FIeEIsV0FBVyxDQTRFdkI7SUFBRCxrQkFBQztDQUFBLEFBNUVELElBNEVDO0FBNUVZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7UnNzU2VydmljZX0gZnJvbSAnLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Jzcy5zZXJ2aWNlJztcbmltcG9ydCB7RGJTZXJ2aWNlfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvZGIuc2VydmljZSc7XG5pbXBvcnQge0N1c3RvbURiU2VydmljZX0gZnJvbSAnLi4vLi4vc2hhcmVkL3NlcnZpY2VzL2N1c3RvbV9kYi5zZXJ2aWNlJztcblxuaW1wb3J0IHsgY29uZmlybSB9IGZyb20gXCJ1aS9kaWFsb2dzXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9kYi5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogWycuL2RiLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBEQkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgbXNnOnN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRiU2VydmljZTogRGJTZXJ2aWNlLCBwcml2YXRlIGN1c3RvbURiU2VydmljZTpDdXN0b21EYlNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcnNzU2VydmljZTpSc3NTZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHRoaXMubXNnPVwiXCI7XG4gICAgfVxuICAgIG5nT25Jbml0KCl7XG5cbiAgICB9XG5cbiAgICBjbGVhbkRCKCl7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgdGl0bGU6IHRoaXMudHJhbnMoJ0NsZWFuIERCJywgJ+a4heeQhuaVsOaNricpLFxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy50cmFucygnQXJlIHlvdSBzdXJlIHRvIGNsZWFuIGRhdGE/JywgJ+aCqOehruiupOa4heeQhuaVsOaNruWQl++8nycpLFxuICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIlllc1wiLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJOb1wiLFxuICAgICAgICAgICAgbmV1dHJhbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCJcbiAgICAgICAgfTtcblxuICAgICAgICBjb25maXJtKG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICB0aGlzLmRiU2VydmljZS5jbGVhckRCKCgpPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnPSB0aGlzLnRyYW5zKFwiUVQgRGF0YWJhc2UgaGFzIGJlZW4gY2xlYW5lZCwgcGxlYXNlIHRyeSBhZ2Fpbi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCLmr4/ml6XngbXkv67mlbDmja7lupPlt7LmiJDlip/kv67lpI0s6K+36YeN6K+V44CCXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjbGVhbkN1c3RvbURCKCl7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgdGl0bGU6IHRoaXMudHJhbnMoJ0NsZWFuIERCJywgJ+a4heeQhuaVsOaNricpLFxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy50cmFucygnQXJlIHlvdSBzdXJlIHRvIGNsZWFuIGRhdGE/JywgJ+aCqOehruiupOa4heeQhuaVsOaNruWQl++8nycpLFxuICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIlllc1wiLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJOb1wiLFxuICAgICAgICAgICAgbmV1dHJhbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCJcbiAgICAgICAgfTtcblxuICAgICAgICBjb25maXJtKG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgaWYocmVzdWx0KXtcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbURiU2VydmljZS5jbGVhckRCKCgpPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnPSB0aGlzLnRyYW5zKFwiQ3VzdG9tIERhdGFiYXNlIGhhcyBiZWVuIGNsZWFuZWQsIHBsZWFzZSB0cnkgYWdhaW4uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwi55So5oi35pWw5o2u5bqT5bey5oiQ5Yqf5L+u5aSNLOivt+mHjeivleOAglwiKTs7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRyYW5zKGVuLCB6aCl7XG4gICAgICAgIHJldHVybiB0aGlzLnJzc1NlcnZpY2UudHJhbnMoZW4sIHpoKTtcbiAgICB9XG5cbiAgICBiYWNrdXAoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJiYWNraW5nIHVwXCIpO1xuICAgICAgICB0aGlzLnJzc1NlcnZpY2UuYmFja3VwQ3VzdG9tRGF0YSgpO1xuICAgIH1cblxuXG4gICAgdGVzdHdvcmtlcigpe1xuICAgICAgICBjb25zb2xlLmxvZygndGVzdGluZycpO1xuXG4gICAgICAgIHZhciByc3NXb3JrZXIgPSBuZXcgV29ya2VyKFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Jzcy53b3JrZXJcIik7XG4gICAgICAgIHJzc1dvcmtlci5wb3N0TWVzc2FnZSh7IHNyYzogXCJhYmNcIiwgZmlsZU5hbWU6IFwiemVueWF0dGEtYncuanBnXCIsIGFwcERpcjogXCIxMjNcIiB9KTtcblxuICAgICAgICByc3NXb3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ21zZyBiYWNrZWhyZSAnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgICAgICByc3NXb3JrZXIudGVybWluYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByc3NXb3JrZXIub25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEFuIHVuaGFuZGxlZCBlcnJvciBvY2N1cnJlZCBpbiB3b3JrZXI6ICR7ZXJyLmZpbGVuYW1lfSwgbGluZTogJHtlcnIubGluZW5vfSA6YCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=