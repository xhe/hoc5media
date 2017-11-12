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
        this.currentdate = new Date(params.context);
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
    RssDataPickerComponent.prototype.submit = function () {
        this.params.closeCallback(this.datePicker.date);
    };
    RssDataPickerComponent = __decorate([
        core_1.Component({
            templateUrl: "pages/rss/rss_list/rss-date-picker.component.html"
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams, page_1.Page])
    ], RssDataPickerComponent);
    return RssDataPickerComponent;
}());
exports.RssDataPickerComponent = RssDataPickerComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLWRhdGUtcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJzcy1kYXRlLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNEQ7QUFDNUQsa0VBQXNFO0FBRXRFLGdDQUErQjtBQUsvQjtJQUtJLGdDQUFvQixNQUF5QixFQUFVLElBQVU7UUFBakUsaUJBUUM7UUFSbUIsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQzlELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRTtZQUNyQiw2RUFBNkU7WUFDN0Usd0NBQXdDO1lBQ3hDLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQseUNBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxVQUFVLEdBQWUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQWEsWUFBWSxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN0RCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU8sdUNBQU0sR0FBYjtRQUNHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQTFCUSxzQkFBc0I7UUFIbEMsZ0JBQVMsQ0FBQztZQUNQLFdBQVcsRUFBRSxtREFBbUQ7U0FDbkUsQ0FBQzt5Q0FNOEIsZ0NBQWlCLEVBQWdCLFdBQUk7T0FMeEQsc0JBQXNCLENBMkJsQztJQUFELDZCQUFDO0NBQUEsQUEzQkQsSUEyQkM7QUEzQlksd0RBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE1vZGFsRGlhbG9nUGFyYW1zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xuaW1wb3J0IHsgRGF0ZVBpY2tlciB9IGZyb20gXCJ1aS9kYXRlLXBpY2tlclwiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHRlbXBsYXRlVXJsOiBcInBhZ2VzL3Jzcy9yc3NfbGlzdC9yc3MtZGF0ZS1waWNrZXIuY29tcG9uZW50Lmh0bWxcIlxufSlcbmV4cG9ydCBjbGFzcyBSc3NEYXRhUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0e1xuICAgIFxuICAgICBwdWJsaWMgY3VycmVudGRhdGU6IERhdGU7XG4gICAgIGRhdGVQaWNrZXI6IERhdGVQaWNrZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmFtczogTW9kYWxEaWFsb2dQYXJhbXMsIHByaXZhdGUgcGFnZTogUGFnZSkge1xuICAgICAgIHRoaXMuY3VycmVudGRhdGUgPSBuZXcgRGF0ZShwYXJhbXMuY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5wYWdlLm9uKFwidW5sb2FkZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgLy8gdXNpbmcgdGhlIHVubG9hZGVkIGV2ZW50IHRvIGNsb3NlIHRoZSBtb2RhbCB3aGVuIHRoZXJlIGlzIHVzZXIgaW50ZXJhY3Rpb25cbiAgICAgICAgICAgIC8vIGUuZy4gdXNlciB0YXBzIG91dHNpZGUgdGhlIG1vZGFsIHBhZ2VcbiAgICAgICAgICAgIHRoaXMucGFyYW1zLmNsb3NlQ2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKXtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyID0gPERhdGVQaWNrZXI+dGhpcy5wYWdlLmdldFZpZXdCeUlkPERhdGVQaWNrZXI+KFwiZGF0ZVBpY2tlclwiKTtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLnllYXIgPSB0aGlzLmN1cnJlbnRkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlci5tb250aCA9IHRoaXMuY3VycmVudGRhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlci5kYXkgPSB0aGlzLmN1cnJlbnRkYXRlLmdldERhdGUoKTtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLm1pbkRhdGUgPSBuZXcgRGF0ZSgxOTc1LCAwLCAyOSk7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlci5tYXhEYXRlID0gbmV3IERhdGUoMjA0NSwgNCwgMTIpO1xuICAgIH1cbiAgICBcbiAgICAgcHVibGljIHN1Ym1pdCgpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMuY2xvc2VDYWxsYmFjayh0aGlzLmRhdGVQaWNrZXIuZGF0ZSk7XG4gICAgfVxufSJdfQ==