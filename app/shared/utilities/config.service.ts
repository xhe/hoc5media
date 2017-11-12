import { Injectable } from '@angular/core';
import {getString} from "application-settings";

@Injectable()
export class ConfigService {

    getFeedUrls(): any {
        return {
            qt: 'https://hoc5.net/qt/PodcastGenerator/feed.xml',
            //qt: 'http://localhost:4200/demo_data.xml',
            weekly_zh: 'http://www.hoc5.net/PodcastGenerator/feed.xml',
            weekly_en: 'http://hoc5.us/podcastgen/feed.xml',
            sister: 'http://hoc5.us/sisters/podcastgen/feed.xml'
        }
    }

    getDBName(): string {
        return 'hoc5.db';
    }
    getCustomDBName(): string {
        return 'hoc5_cust.db';
    }
    getDefaultLanguage():string{
        return getString("language", "zh");
    }
}
