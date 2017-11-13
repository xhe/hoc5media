import {Component, OnInit} from "@angular/core";
import {RssService} from '../../shared/services/rss.service';
import {DbService} from '../../shared/services/db.service';
import {CustomDbService} from '../../shared/services/custom_db.service';

import { confirm } from "ui/dialogs";

@Component({
    moduleId: module.id,
    templateUrl: "./db.component.html",
    styleUrls: ['./db.component.css']
})
export class DBComponent implements OnInit {
    msg:string;
    constructor(private dbService: DbService, private customDbService:CustomDbService,
        private rssService:RssService
    ) {
        this.msg="";
    }
    ngOnInit(){

    }

    cleanDB(){
        let options = {
            title: this.trans('Clean DB', '清理数据'),
            message: this.trans('Are you sure to clean data?', '您确认清理数据吗？'),
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        };

        confirm(options).then((result: boolean) => {
            if(result){
                this.dbService.clearDB(()=>{
                    this.msg= this.trans("QT Database has been cleaned, please try again.",
                    "每日灵修数据库已成功修复,请重试。");
                });
            }
        });
    }

    cleanCustomDB(){
        let options = {
            title: this.trans('Clean DB', '清理数据'),
            message: this.trans('Are you sure to clean data?', '您确认清理数据吗？'),
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        };

        confirm(options).then((result: boolean) => {
            if(result){
                this.customDbService.clearDB(()=>{
                    this.msg= this.trans("Custom Database has been cleaned, please try again.",
                    "用户数据库已成功修复,请重试。");;
                });
            }
        });
    }

    trans(en, zh){
        return this.rssService.trans(en, zh);
    }

    backup(){
        console.log("backing up");
        this.rssService.backupCustomData();
    }


    testworker(){
        console.log('testing');

        var rssWorker = new Worker("../../shared/services/rss.worker");
        rssWorker.postMessage({ src: "abc", fileName: "zenyatta-bw.jpg", appDir: "123" });

        rssWorker.onmessage = function (msg) {
            console.log('msg backehre ');
            console.log(msg);
            rssWorker.terminate();
        }

        rssWorker.onerror = function(err) {
            console.log(`An unhandled error occurred in worker: ${err.filename}, line: ${err.lineno} :`);
            console.log(err.message);
        }
    }
}
