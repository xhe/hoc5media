"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
var RequestService = (function () {
    function RequestService(http) {
        this.http = http;
    }
    RequestService.prototype.get = function (url) {
        var headers = new http_1.Headers();
        return this.http.get(url)
            .map(this.extractData.bind(this))
            .catch(this.handleError.bind(this));
    };
    RequestService.prototype.getRawData = function (url) {
        return this.http.get(url)
            .map(this.extractXMLData.bind(this))
            .catch(this.handleError.bind(this));
    };
    RequestService.prototype.extractXMLData = function (res) {
        var body = res.text();
        return body || {};
    };
    RequestService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    RequestService.prototype.handleError = function (error) {
        console.log('error is ===>', error);
    };
    RequestService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], RequestService);
    return RequestService;
}());
exports.RequestService = RequestService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVxdWVzdC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlDO0FBQ3pDLHNDQUFzRDtBQUd0RCxtQ0FBaUM7QUFDakMsaUNBQStCO0FBSS9CO0lBRUksd0JBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBQzlCLENBQUM7SUFFRCw0QkFBRyxHQUFILFVBQUksR0FBVztRQUNYLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzthQUNwQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELG1DQUFVLEdBQVYsVUFBVyxHQUFXO1FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7YUFDcEIsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25DLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFTyx1Q0FBYyxHQUF0QixVQUF1QixHQUFhO1FBQ2hDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU8sb0NBQVcsR0FBbkIsVUFBb0IsR0FBYTtRQUM3QixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLG9DQUFXLEdBQW5CLFVBQW9CLEtBQWU7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQTlCUSxjQUFjO1FBRDFCLGlCQUFVLEVBQUU7eUNBR2lCLFdBQUk7T0FGckIsY0FBYyxDQStCMUI7SUFBRCxxQkFBQztDQUFBLEFBL0JELElBK0JDO0FBL0JZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cCwgUmVzcG9uc2UsIEhlYWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL2NhdGNoJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWFwJztcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVxdWVzdFNlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XG4gICAgfVxuXG4gICAgZ2V0KHVybDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKVxuICAgICAgICAgICAgLm1hcCh0aGlzLmV4dHJhY3REYXRhLmJpbmQodGhpcykpXG4gICAgICAgICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvci5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBnZXRSYXdEYXRhKHVybDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybClcbiAgICAgICAgICAgIC5tYXAodGhpcy5leHRyYWN0WE1MRGF0YS5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleHRyYWN0WE1MRGF0YShyZXM6IFJlc3BvbnNlKXtcbiAgICAgICAgbGV0IGJvZHkgPSByZXMudGV4dCgpO1xuICAgICAgICByZXR1cm4gYm9keSB8fCB7fTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGV4dHJhY3REYXRhKHJlczogUmVzcG9uc2UpIHtcbiAgICAgICAgbGV0IGJvZHkgPSByZXMuanNvbigpO1xuICAgICAgICByZXR1cm4gYm9keSB8fCB7fTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZUVycm9yKGVycm9yOiBSZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgaXMgPT09PicsIGVycm9yKTtcbiAgICB9XG59XG4iXX0=