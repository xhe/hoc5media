import { HomeComponent } from "./pages/home/home.component";
import {RssListComponent} from "./pages/rss/rss_list/rss-list.component";
import {RssDetailComponent} from "./pages/rss/rss_detail/detail.component";
import {RssBookListComponent} from "./pages/rss/rss_filter_comps/rss-book-list.component";
import {RssDataPickerComponent} from "./pages/rss/rss_filter_comps/rss-date-picker.component";
import {RssNoteComponent} from "./pages/rss/rss_note/note.component";

import {DBComponent} from "./pages/home/db.component";

export const routes = [
    { path: "", component: HomeComponent },
    { path: "rss/:type", component: RssListComponent },
    { path: "rss/:rssType/:index", component: RssDetailComponent },
    { path: "db", component: DBComponent },
    { path: "rssnote", component: RssNoteComponent}
];

export const navigatableComponents = [
    HomeComponent,
    RssListComponent,
    RssDetailComponent,
    RssBookListComponent,
    RssDataPickerComponent,
    DBComponent,
    RssNoteComponent
];

export const entryComponents = [RssBookListComponent, RssDataPickerComponent, RssNoteComponent];
