"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
//https://github.com/bradmartin/nativescript-audio
var timer = require("timer");
var DetailService = (function () {
    function DetailService() {
        this.timerId = null;
        this.cb = null;
    }
    DetailService.prototype.onInterval = function (cb) {
        var _this = this;
        this.cb = cb;
        if (this.timerId == null) {
            this.timerId = timer.setInterval(function () {
                console.log('timer hapened');
                _this.cb();
            }, 1000);
        }
    };
    DetailService.prototype.clearInterval = function () {
        console.log('clearing timer heree');
        timer.clearInterval(this.timerId);
        this.timerId = null;
        this.cb = null;
    };
    DetailService = __decorate([
        core_1.Injectable()
    ], DetailService);
    return DetailService;
}());
exports.DetailService = DetailService;
