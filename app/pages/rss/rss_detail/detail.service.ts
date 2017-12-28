import {Injectable} from "@angular/core";
//https://github.com/bradmartin/nativescript-audio
var timer = require("timer");

@Injectable()
export class DetailService{

    private timerId = null;
    private cb = null;

    public onInterval(cb){
        this.cb = cb;
        if(this.timerId==null){
            this.timerId = timer.setInterval(()=>{
                console.log('timer hapened');
                this.cb();
            }, 1000);
        }
    }

    public clearInterval(){
        console.log('clearing timer heree');
        timer.clearInterval(this.timerId);
        this.timerId = null;
        this.cb = null;
    }
}
