import {Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Page } from "ui/page";
import {RssService} from '../../../shared/services/rss.service';

@Component({
    templateUrl: 'pages/rss/rss_filter_comps/rss-book-list.component.html',
    styleUrls: ['pages/rss/rss_filter_comps/filter.common.css'],
})
export class RssBookListComponent implements OnInit {

    public bookList: Item[] = [];

    constructor(private params: ModalDialogParams, private page: Page, private rssService: RssService) {

        this.bookList = [];
        this.page.on("unloaded", () => {
            this._closeCallBack();
        });
    }

    ngOnInit() {
        this.rssService.getBookList(books => {
            books.forEach(name => {
                this.bookList.push(new Item(name));
            });
            this.bookList.unshift(new Item("Select All"));
        });
    }

    public onItemTap(args) {
        let tapIndex = args.index;
        let item = this.bookList[tapIndex];
        if (tapIndex == 0) {
            let selected = !item.selected;
            this.bookList.forEach(item => {
                item.selected = selected;
            });
        } else {
            item.selected = !item.selected;
        }
    }

    submit() {
        this._closeCallBack();
    }

    _closeCallBack(){
        let selectedBooks: String[] = [];
        for (let i = 1; i < this.bookList.length; i++) {
            if (this.bookList[i].selected)
            selectedBooks.push(this.bookList[i].name);
        }
        console.log('selected books are ', selectedBooks);
        this.params.closeCallback(selectedBooks);
    }
}

class Item {
    name: string;
    selected: boolean;
    constructor(name: string) {
        this.name = name;
        this.selected = true;
    }
}
