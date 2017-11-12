import {Component} from "@angular/core";
import {RssService} from "../../../shared/services/rss.service";
import { TextView } from "ui/text-view";
import { isAndroid } from "platform";
import {Rss, Channel, ChannelImage, Item, CustomItem} from '../../../shared/entities/entities';
import {RouterExtensions} from "nativescript-angular/router";

@Component({
    styleUrls: ['pages/rss/rss_note/note.component.css', 'pages/rss/rss_note/note.css'],
    templateUrl: 'pages/rss/rss_note/note.component.html'
})
export class RssNoteComponent {

    rssItem:Item;
    title:string;
    note:string;

    constructor( private rssService: RssService, private routerExtensions: RouterExtensions) {
        this.rssItem = rssService.getItem();
        rssService.getNotedItemFor(this.rssItem.uuid, (customItems:CustomItem[])=>{
            this.title = customItems[0].title;
            this.note = customItems[0].note;
        })
    }

    save(){
        this.rssService.addNoteToItem(this.rssItem.uuid,this.title, this.note, ()=>{
            this.routerExtensions.back();
        });
    }

    back(){
        this.routerExtensions.back();
    }
}
