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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNoYXJlZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUM7QUFDekMsc0RBQWtEO0FBQ2xELDZEQUF5RDtBQUN6RCwrREFBMkQ7QUFDM0Qsb0RBQWdEO0FBQ2hELGtFQUE2RDtBQU03RDtJQUFBO0lBRUEsQ0FBQztJQUZZLFlBQVk7UUFIeEIsZUFBUSxDQUFDO1lBQ04sU0FBUyxFQUFFLENBQUMsd0JBQVUsRUFBRSw4QkFBYSxFQUFFLGdDQUFjLEVBQUUsc0JBQVMsRUFBRSxtQ0FBZSxDQUFDO1NBQ3JGLENBQUM7T0FDVyxZQUFZLENBRXhCO0lBQUQsbUJBQUM7Q0FBQSxBQUZELElBRUM7QUFGWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7UnNzU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9yc3Muc2VydmljZSc7XG5pbXBvcnQge0NvbmZpZ1NlcnZpY2V9IGZyb20gJy4vdXRpbGl0aWVzL2NvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7UmVxdWVzdFNlcnZpY2V9IGZyb20gJy4vdXRpbGl0aWVzL3JlcXVlc3Quc2VydmljZSc7XG5pbXBvcnQge0RiU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9kYi5zZXJ2aWNlJztcbmltcG9ydCB7Q3VzdG9tRGJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL2N1c3RvbV9kYi5zZXJ2aWNlJztcblxuXG5ATmdNb2R1bGUoe1xuICAgIHByb3ZpZGVyczogW1Jzc1NlcnZpY2UsIENvbmZpZ1NlcnZpY2UsIFJlcXVlc3RTZXJ2aWNlLCBEYlNlcnZpY2UsIEN1c3RvbURiU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgU2hhcmVkTW9kdWxlIHtcblxufVxuIl19