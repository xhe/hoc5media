import { NgModule } from "@angular/core";
import {RssService} from './services/rss.service';
import {ConfigService} from './utilities/config.service';
import {RequestService} from './utilities/request.service';
import {DbService} from './services/db.service';
import {CustomDbService} from './services/custom_db.service';


@NgModule({
    providers: [RssService, ConfigService, RequestService, DbService, CustomDbService]
})
export class SharedModule {

}
