import { Component, OnInit } from "@angular/core";
import { Switch } from "ui/switch";
import {RssService} from '../../shared/services/rss.service';
import {ConfigService} from '../../shared/utilities/config.service';

@Component({
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css', './home.css']
})
export class HomeComponent {

    lang:string;
    constructor(private rssService:RssService, private configService:ConfigService) {
        this.lang = configService.getDefaultLanguage();
    }

    trans(en, zh){
        return this.rssService.trans(en, zh);
    }


    changeLanguage(args) {
        let languagewitch = <Switch>args.object;
        if (languagewitch.checked) {
            this.rssService.setLanguage("zh");
        } else {
            this.rssService.setLanguage('en');
        }
    }
}
