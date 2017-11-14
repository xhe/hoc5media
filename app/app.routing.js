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
