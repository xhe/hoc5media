"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var home_component_1 = require("./pages/home/home.component");
var rss_list_component_1 = require("./pages/rss/rss_list/rss-list.component");
var detail_component_1 = require("./pages/rss/rss_detail/detail.component");
var rss_book_list_component_1 = require("./pages/rss/rss_filter_comps/rss-book-list.component");
var rss_date_picker_component_1 = require("./pages/rss/rss_filter_comps/rss-date-picker.component");
var note_component_1 = require("./pages/rss/rss_note/note.component");
var db_component_1 = require("./pages/home/db.component");
exports.routes = [
    { path: "", component: home_component_1.HomeComponent },
    { path: "rss/:type", component: rss_list_component_1.RssListComponent },
    { path: "rss/:rssType/:index", component: detail_component_1.RssDetailComponent },
    { path: "db", component: db_component_1.DBComponent },
    { path: "rssnote", component: note_component_1.RssNoteComponent }
];
exports.navigatableComponents = [
    home_component_1.HomeComponent,
    rss_list_component_1.RssListComponent,
    detail_component_1.RssDetailComponent,
    rss_book_list_component_1.RssBookListComponent,
    rss_date_picker_component_1.RssDataPickerComponent,
    db_component_1.DBComponent,
    note_component_1.RssNoteComponent
];
exports.entryComponents = [rss_book_list_component_1.RssBookListComponent, rss_date_picker_component_1.RssDataPickerComponent, note_component_1.RssNoteComponent];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAucm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUE0RDtBQUM1RCw4RUFBeUU7QUFDekUsNEVBQTJFO0FBQzNFLGdHQUEwRjtBQUMxRixvR0FBOEY7QUFDOUYsc0VBQXFFO0FBRXJFLDBEQUFzRDtBQUV6QyxRQUFBLE1BQU0sR0FBRztJQUNsQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLDhCQUFhLEVBQUU7SUFDdEMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxxQ0FBZ0IsRUFBRTtJQUNsRCxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxTQUFTLEVBQUUscUNBQWtCLEVBQUU7SUFDOUQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSwwQkFBVyxFQUFFO0lBQ3RDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUNBQWdCLEVBQUM7Q0FDbEQsQ0FBQztBQUVXLFFBQUEscUJBQXFCLEdBQUc7SUFDakMsOEJBQWE7SUFDYixxQ0FBZ0I7SUFDaEIscUNBQWtCO0lBQ2xCLDhDQUFvQjtJQUNwQixrREFBc0I7SUFDdEIsMEJBQVc7SUFDWCxpQ0FBZ0I7Q0FDbkIsQ0FBQztBQUVXLFFBQUEsZUFBZSxHQUFHLENBQUMsOENBQW9CLEVBQUUsa0RBQXNCLEVBQUUsaUNBQWdCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy9ob21lL2hvbWUuY29tcG9uZW50XCI7XG5pbXBvcnQge1Jzc0xpc3RDb21wb25lbnR9IGZyb20gXCIuL3BhZ2VzL3Jzcy9yc3NfbGlzdC9yc3MtbGlzdC5jb21wb25lbnRcIjtcbmltcG9ydCB7UnNzRGV0YWlsQ29tcG9uZW50fSBmcm9tIFwiLi9wYWdlcy9yc3MvcnNzX2RldGFpbC9kZXRhaWwuY29tcG9uZW50XCI7XG5pbXBvcnQge1Jzc0Jvb2tMaXN0Q29tcG9uZW50fSBmcm9tIFwiLi9wYWdlcy9yc3MvcnNzX2ZpbHRlcl9jb21wcy9yc3MtYm9vay1saXN0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHtSc3NEYXRhUGlja2VyQ29tcG9uZW50fSBmcm9tIFwiLi9wYWdlcy9yc3MvcnNzX2ZpbHRlcl9jb21wcy9yc3MtZGF0ZS1waWNrZXIuY29tcG9uZW50XCI7XG5pbXBvcnQge1Jzc05vdGVDb21wb25lbnR9IGZyb20gXCIuL3BhZ2VzL3Jzcy9yc3Nfbm90ZS9ub3RlLmNvbXBvbmVudFwiO1xuXG5pbXBvcnQge0RCQ29tcG9uZW50fSBmcm9tIFwiLi9wYWdlcy9ob21lL2RiLmNvbXBvbmVudFwiO1xuXG5leHBvcnQgY29uc3Qgcm91dGVzID0gW1xuICAgIHsgcGF0aDogXCJcIiwgY29tcG9uZW50OiBIb21lQ29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcInJzcy86dHlwZVwiLCBjb21wb25lbnQ6IFJzc0xpc3RDb21wb25lbnQgfSxcbiAgICB7IHBhdGg6IFwicnNzLzpyc3NUeXBlLzppbmRleFwiLCBjb21wb25lbnQ6IFJzc0RldGFpbENvbXBvbmVudCB9LFxuICAgIHsgcGF0aDogXCJkYlwiLCBjb21wb25lbnQ6IERCQ29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcInJzc25vdGVcIiwgY29tcG9uZW50OiBSc3NOb3RlQ29tcG9uZW50fVxuXTtcblxuZXhwb3J0IGNvbnN0IG5hdmlnYXRhYmxlQ29tcG9uZW50cyA9IFtcbiAgICBIb21lQ29tcG9uZW50LFxuICAgIFJzc0xpc3RDb21wb25lbnQsXG4gICAgUnNzRGV0YWlsQ29tcG9uZW50LFxuICAgIFJzc0Jvb2tMaXN0Q29tcG9uZW50LFxuICAgIFJzc0RhdGFQaWNrZXJDb21wb25lbnQsXG4gICAgREJDb21wb25lbnQsXG4gICAgUnNzTm90ZUNvbXBvbmVudFxuXTtcblxuZXhwb3J0IGNvbnN0IGVudHJ5Q29tcG9uZW50cyA9IFtSc3NCb29rTGlzdENvbXBvbmVudCwgUnNzRGF0YVBpY2tlckNvbXBvbmVudCwgUnNzTm90ZUNvbXBvbmVudF07XG4iXX0=