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
