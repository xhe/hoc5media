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
            templateUrl: "pages/home/db.component.html",
            styleUrls: ['./pages/home/db.component.css']
        }),
        __metadata("design:paramtypes", [db_service_1.DbService, custom_db_service_1.CustomDbService,
            rss_service_1.RssService])
    ], DBComponent);
    return DBComponent;
}());
exports.DBComponent = DBComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdEO0FBQ2hELGlFQUE2RDtBQUM3RCwrREFBMkQ7QUFDM0QsNkVBQXdFO0FBRXhFLHNDQUFxQztBQU1yQztJQUVJLHFCQUFvQixTQUFvQixFQUFVLGVBQStCLEVBQ3JFLFVBQXFCO1FBRGIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUNyRSxlQUFVLEdBQVYsVUFBVSxDQUFXO1FBRTdCLElBQUksQ0FBQyxHQUFHLEdBQUMsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFDRCw4QkFBUSxHQUFSO0lBRUEsQ0FBQztJQUVELDZCQUFPLEdBQVA7UUFBQSxpQkFpQkM7UUFoQkcsSUFBSSxPQUFPLEdBQUc7WUFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDO1lBQ3JDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLFdBQVcsQ0FBQztZQUMvRCxZQUFZLEVBQUUsS0FBSztZQUNuQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGlCQUFpQixFQUFFLFFBQVE7U0FDOUIsQ0FBQztRQUVGLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBZTtZQUNsQyxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO2dCQUNQLEtBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO29CQUNuQixLQUFJLENBQUMsR0FBRyxHQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsaURBQWlELEVBQ3RFLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELG1DQUFhLEdBQWI7UUFBQSxpQkFpQkM7UUFoQkcsSUFBSSxPQUFPLEdBQUc7WUFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDO1lBQ3JDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLFdBQVcsQ0FBQztZQUMvRCxZQUFZLEVBQUUsS0FBSztZQUNuQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGlCQUFpQixFQUFFLFFBQVE7U0FDOUIsQ0FBQztRQUVGLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBZTtZQUNsQyxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO2dCQUNQLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO29CQUN6QixLQUFJLENBQUMsR0FBRyxHQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMscURBQXFELEVBQzFFLGlCQUFpQixDQUFDLENBQUM7b0JBQUEsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsMkJBQUssR0FBTCxVQUFNLEVBQUUsRUFBRSxFQUFFO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsNEJBQU0sR0FBTjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFHRCxnQ0FBVSxHQUFWO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV2QixJQUFJLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQy9ELFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUVsRixTQUFTLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRztZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQTtRQUVELFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBUyxHQUFHO1lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTBDLEdBQUcsQ0FBQyxRQUFRLGdCQUFXLEdBQUcsQ0FBQyxNQUFNLE9BQUksQ0FBQyxDQUFDO1lBQzdGLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQTtJQUNMLENBQUM7SUEzRVEsV0FBVztRQUp2QixnQkFBUyxDQUFDO1lBQ1AsV0FBVyxFQUFFLDhCQUE4QjtZQUMzQyxTQUFTLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztTQUMvQyxDQUFDO3lDQUdpQyxzQkFBUyxFQUEwQixtQ0FBZTtZQUMxRCx3QkFBVTtPQUh4QixXQUFXLENBNEV2QjtJQUFELGtCQUFDO0NBQUEsQUE1RUQsSUE0RUM7QUE1RVksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtSc3NTZXJ2aWNlfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvcnNzLnNlcnZpY2UnO1xuaW1wb3J0IHtEYlNlcnZpY2V9IGZyb20gJy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9kYi5zZXJ2aWNlJztcbmltcG9ydCB7Q3VzdG9tRGJTZXJ2aWNlfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvY3VzdG9tX2RiLnNlcnZpY2UnO1xuXG5pbXBvcnQgeyBjb25maXJtIH0gZnJvbSBcInVpL2RpYWxvZ3NcIjtcblxuQENvbXBvbmVudCh7XG4gICAgdGVtcGxhdGVVcmw6IFwicGFnZXMvaG9tZS9kYi5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogWycuL3BhZ2VzL2hvbWUvZGIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIERCQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBtc2c6c3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZGJTZXJ2aWNlOiBEYlNlcnZpY2UsIHByaXZhdGUgY3VzdG9tRGJTZXJ2aWNlOkN1c3RvbURiU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByc3NTZXJ2aWNlOlJzc1NlcnZpY2VcbiAgICApIHtcbiAgICAgICAgdGhpcy5tc2c9XCJcIjtcbiAgICB9XG4gICAgbmdPbkluaXQoKXtcblxuICAgIH1cblxuICAgIGNsZWFuREIoKXtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogdGhpcy50cmFucygnQ2xlYW4gREInLCAn5riF55CG5pWw5o2uJyksXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLnRyYW5zKCdBcmUgeW91IHN1cmUgdG8gY2xlYW4gZGF0YT8nLCAn5oKo56Gu6K6k5riF55CG5pWw5o2u5ZCX77yfJyksXG4gICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiWWVzXCIsXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIk5vXCIsXG4gICAgICAgICAgICBuZXV0cmFsQnV0dG9uVGV4dDogXCJDYW5jZWxcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbmZpcm0ob3B0aW9ucykudGhlbigocmVzdWx0OiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuZGJTZXJ2aWNlLmNsZWFyREIoKCk9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2c9IHRoaXMudHJhbnMoXCJRVCBEYXRhYmFzZSBoYXMgYmVlbiBjbGVhbmVkLCBwbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgICAgICAgICAgICAgICBcIuavj+aXpeeBteS/ruaVsOaNruW6k+W3suaIkOWKn+S/ruWkjSzor7fph43or5XjgIJcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNsZWFuQ3VzdG9tREIoKXtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogdGhpcy50cmFucygnQ2xlYW4gREInLCAn5riF55CG5pWw5o2uJyksXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLnRyYW5zKCdBcmUgeW91IHN1cmUgdG8gY2xlYW4gZGF0YT8nLCAn5oKo56Gu6K6k5riF55CG5pWw5o2u5ZCX77yfJyksXG4gICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiWWVzXCIsXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIk5vXCIsXG4gICAgICAgICAgICBuZXV0cmFsQnV0dG9uVGV4dDogXCJDYW5jZWxcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbmZpcm0ob3B0aW9ucykudGhlbigocmVzdWx0OiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tRGJTZXJ2aWNlLmNsZWFyREIoKCk9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2c9IHRoaXMudHJhbnMoXCJDdXN0b20gRGF0YWJhc2UgaGFzIGJlZW4gY2xlYW5lZCwgcGxlYXNlIHRyeSBhZ2Fpbi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCLnlKjmiLfmlbDmja7lupPlt7LmiJDlip/kv67lpI0s6K+36YeN6K+V44CCXCIpOztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJhbnMoZW4sIHpoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucnNzU2VydmljZS50cmFucyhlbiwgemgpO1xuICAgIH1cblxuICAgIGJhY2t1cCgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcImJhY2tpbmcgdXBcIik7XG4gICAgICAgIHRoaXMucnNzU2VydmljZS5iYWNrdXBDdXN0b21EYXRhKCk7XG4gICAgfVxuXG5cbiAgICB0ZXN0d29ya2VyKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0ZXN0aW5nJyk7XG5cbiAgICAgICAgdmFyIHJzc1dvcmtlciA9IG5ldyBXb3JrZXIoXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvcnNzLndvcmtlclwiKTtcbiAgICAgICAgcnNzV29ya2VyLnBvc3RNZXNzYWdlKHsgc3JjOiBcImFiY1wiLCBmaWxlTmFtZTogXCJ6ZW55YXR0YS1idy5qcGdcIiwgYXBwRGlyOiBcIjEyM1wiIH0pO1xuXG4gICAgICAgIHJzc1dvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbXNnIGJhY2tlaHJlICcpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICAgIHJzc1dvcmtlci50ZXJtaW5hdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJzc1dvcmtlci5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQW4gdW5oYW5kbGVkIGVycm9yIG9jY3VycmVkIGluIHdvcmtlcjogJHtlcnIuZmlsZW5hbWV9LCBsaW5lOiAke2Vyci5saW5lbm99IDpgKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==