"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var page_1 = require("ui/page");
var RssDataPickerComponent = (function () {
    function RssDataPickerComponent(params, page) {
        var _this = this;
        this.params = params;
        this.page = page;
        this.currentdate = new Date();
        this.dateOptions = ["On", "On or Before", "On Or After", "Between"];
        this.selectedDateOption = 'On';
        this.currentSelectedDateType = "date1";
        this.page.on("unloaded", function () {
            // using the unloaded event to close the modal when there is user interaction
            // e.g. user taps outside the modal page
            _this.params.closeCallback();
        });
    }
    RssDataPickerComponent.prototype.ngOnInit = function () {
        this.datePicker = this.page.getViewById("datePicker");
        this.datePicker.year = this.currentdate.getFullYear();
        this.datePicker.month = this.currentdate.getMonth() + 1;
        this.datePicker.day = this.currentdate.getDate();
        this.datePicker.minDate = new Date(1975, 0, 29);
        this.datePicker.maxDate = new Date(2045, 4, 12);
    };
    RssDataPickerComponent.prototype.selectedIndexChanged = function (args) {
        var picker = args.object;
        this.selectedDateOption = this.dateOptions[picker.selectedIndex];
    };
    RssDataPickerComponent.prototype.showCalendar = function (dt) {
        this.currentSelectedDateType = dt;
    };
    RssDataPickerComponent.prototype.onDateChanged = function (args) {
        if (this.currentSelectedDateType === 'date1') {
            this.selectedDate1 = this._formatDate(args.value);
        }
        else {
            this.selectedDate2 = this._formatDate(args.value);
        }
    };
    RssDataPickerComponent.prototype._formatDate = function (dt) {
        var tmpDt = new Date(dt);
        var month = tmpDt.getMonth() + 1;
        var day = tmpDt.getDate();
        var monthStr = (month < 10 ? '0' : '') + month;
        var dayStr = (day < 10 ? '0' : '') + day;
        return tmpDt.getFullYear() + '-' + monthStr + '-' + dayStr;
    };
    RssDataPickerComponent.prototype.submit = function () {
        this.params.closeCallback([this.selectedDateOption, this.selectedDate1, this.selectedDate2]);
    };
    RssDataPickerComponent.prototype.cancel = function () {
        this.params.closeCallback();
    };
    RssDataPickerComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./rss-date-picker.component.html",
            styleUrls: ['./rss-date-picker.component.common.css'],
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams, page_1.Page])
    ], RssDataPickerComponent);
    return RssDataPickerComponent;
}());
exports.RssDataPickerComponent = RssDataPickerComponent;
