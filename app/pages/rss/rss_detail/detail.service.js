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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0YWlsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXRhaWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUN6QyxrREFBa0Q7QUFDbEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRzdCO0lBREE7UUFHWSxZQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ2YsT0FBRSxHQUFHLElBQUksQ0FBQztJQWtCdEIsQ0FBQztJQWhCVSxrQ0FBVSxHQUFqQixVQUFrQixFQUFFO1FBQXBCLGlCQVFDO1FBUEcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFFLElBQUksQ0FBQyxDQUFBLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO2dCQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUM3QixLQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDZCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDO0lBQ0wsQ0FBQztJQUVNLHFDQUFhLEdBQXBCO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFwQlEsYUFBYTtRQUR6QixpQkFBVSxFQUFFO09BQ0EsYUFBYSxDQXFCekI7SUFBRCxvQkFBQztDQUFBLEFBckJELElBcUJDO0FBckJZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuLy9odHRwczovL2dpdGh1Yi5jb20vYnJhZG1hcnRpbi9uYXRpdmVzY3JpcHQtYXVkaW9cbnZhciB0aW1lciA9IHJlcXVpcmUoXCJ0aW1lclwiKTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERldGFpbFNlcnZpY2V7XG5cbiAgICBwcml2YXRlIHRpbWVySWQgPSBudWxsO1xuICAgIHByaXZhdGUgY2IgPSBudWxsO1xuXG4gICAgcHVibGljIG9uSW50ZXJ2YWwoY2Ipe1xuICAgICAgICB0aGlzLmNiID0gY2I7XG4gICAgICAgIGlmKHRoaXMudGltZXJJZD09bnVsbCl7XG4gICAgICAgICAgICB0aGlzLnRpbWVySWQgPSB0aW1lci5zZXRJbnRlcnZhbCgoKT0+e1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aW1lciBoYXBlbmVkJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYigpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJJbnRlcnZhbCgpe1xuICAgICAgICBjb25zb2xlLmxvZygnY2xlYXJpbmcgdGltZXIgaGVyZWUnKTtcbiAgICAgICAgdGltZXIuY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xuICAgICAgICB0aGlzLnRpbWVySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmNiID0gbnVsbDtcbiAgICB9XG59XG4iXX0=