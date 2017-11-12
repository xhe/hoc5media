import { Component, OnInit, NgModule } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { DatePicker } from "ui/date-picker";
import { Page } from "ui/page";
import { ListPicker } from "ui/list-picker";

@Component({
    templateUrl: "pages/rss/rss_filter_comps/rss-date-picker.component.html",
    styleUrls: ['pages/rss/rss_filter_comps/rss-date-picker.component.common.css'],
})
export class RssDataPickerComponent implements OnInit{

    public currentdate: Date;
    datePicker: DatePicker;

    dateOptions: string[];

    selectedDateOption:string;
    currentSelectedDateType: string;

    selectedDate1:string;
    selectedDate2:string;

    constructor(private params: ModalDialogParams, private page: Page) {
        this.currentdate = new Date();

        this.dateOptions = ["On", "On or Before", "On Or After", "Between"];
        this.selectedDateOption = 'On';
        this.currentSelectedDateType = "date1";

        this.page.on("unloaded", () => {
            // using the unloaded event to close the modal when there is user interaction
            // e.g. user taps outside the modal page
            this.params.closeCallback();
        });
    }

    ngOnInit(){

        this.datePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");
        this.datePicker.year = this.currentdate.getFullYear();
        this.datePicker.month = this.currentdate.getMonth() + 1;
        this.datePicker.day = this.currentdate.getDate();
        this.datePicker.minDate = new Date(1975, 0, 29);
        this.datePicker.maxDate = new Date(2045, 4, 12);

    }

    public selectedIndexChanged(args) {
        let picker = <ListPicker>args.object;
        this.selectedDateOption = this.dateOptions[picker.selectedIndex];
    }

    public showCalendar(dt){
        this.currentSelectedDateType = dt;
    }

    onDateChanged(args) {

        if(this.currentSelectedDateType==='date1'){
            this.selectedDate1 = this._formatDate(args.value);
        }else{
            this.selectedDate2 = this._formatDate( args.value);
        }
    }

    _formatDate(dt){
        let tmpDt = new Date(dt);

        let month = tmpDt.getMonth() + 1;
        let day = tmpDt.getDate();

        let monthStr = (month<10?'0':'') + month;
        let dayStr= (day<10?'0':'')+day;

        return tmpDt.getFullYear()+'-'+ monthStr +'-'+ dayStr;
    }

    public submit() {
        this.params.closeCallback([this.selectedDateOption, this.selectedDate1, this.selectedDate2]);
    }

    public cancel(){
        this.params.closeCallback();
    }
}
