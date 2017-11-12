import {Injectable} from "@angular/core";
import {ConfigService} from "../utilities/config.service";
import {Item, Rss} from '../entities/entities';

var Sqlite = require("nativescript-sqlite");

@Injectable()
export class DbService {

    private database: any;

    constructor(private configService: ConfigService) {
        this._prepareDb();
    }

    public clearDB(cb = null) {
        console.log('start clearning db');
        this._prepareDb(() => {
            console.log('db prepared here');
            //delete dataBase first
            this.database.execSQL('DROP TABLE IF EXISTS items').then(() => {
                console.log('table is dropped');
                this.database.execSQL('DROP INDEX  IF EXISTS idx_items_uuid').then(() => {
                    console.log('index is dropped');
                    this._createItemTable(cb);
                });
            },
            err=>{
                console.log('dropping table error here', err);
                //if table can not be dropped, we then need to delete database
                Sqlite.deleteDatabase(this.configService.getDBName());
                this.dropDB(cb);
            }
        );
    });
}

public dropDB(cb=null){
    Sqlite.deleteDatabase(this.configService.getDBName());
    console.log('now let us delete the whole database');
    if(cb)
    cb([]);
}

public getAllItems(cb) {
    this._queryData("SELECT * FROM items", cb)
}

private bookTitles: string[];

public getBookList(cb) {

    if(this.bookTitles){
        return cb(this.bookTitles);
    }

    let queryStr = 'SELECT title FROM items';
    this._prepareDb(() => {
        this.database.all(queryStr).then(rows => {
            let bookTitles = [];
            rows.forEach(row => {
                let title = row[0];
                let startPos = 0;
                let endPos = 0;
                for (let i = 0; i < title.length; i++) {
                    let tmpStr = title.substr(i, 1);
                    if (isNaN(tmpStr) && tmpStr != '-' && tmpStr != ' ') {
                        startPos = i;
                        break;
                    }
                }
                for (let i = startPos + 1; i < title.length; i++) {
                    if (!isNaN(title.substr(i, 1))) {
                        if ( title.substring(startPos, i)!='QT' && bookTitles.indexOf(title.substring(startPos, i)) === -1) {
                            bookTitles.push(title.substring(startPos, i));
                        }
                        break;
                    }
                }
            });
            this.bookTitles = bookTitles;
            cb(bookTitles);
        });
    });
}

public getItemFromUUID(uuid, cb){
    this._queryData(`select * from items where uuid = ${uuid}`, items=>{
        cb(items[0]);
    });
}

public getFavoritedItemsForUUIDs(uuids, cb){
    let uuidStr = "";
    uuids.forEach(uuid=>{
        uuidStr+= (uuidStr==''?'':',') +uuid;
    });

    let queryStr = `select * from items where uuid in ( ${uuidStr} ) order by id asc`;
    console.log(queryStr);
    this._queryData(queryStr, cb);
}

public getNotedItemsForUUIDs(uuids, cb){
    let uuidStr = "";
    uuids.forEach(uuid=>{
        uuidStr+= (uuidStr==''?'':',') +uuid;
    });

    let queryStr = `select * from items where uuid in ( ${uuidStr} ) order by id asc`;
    console.log(queryStr);
    this._queryData(queryStr, cb);
}

public getSimplifiedNotedItemsForUUIDs(uuids, cb){
    let uuidStr = "";
    uuids.forEach(uuid=>{
        uuidStr+= (uuidStr==''?'':',') +uuid;
    });

    let queryStr = `select title, subTitle, uuid, pubDate from items where uuid in ( ${uuidStr} ) order by id asc`;
    console.log(queryStr);
    this._queryData(queryStr, cb);
}

public getSimplifiedFavoritedItemsForUUIDs(uuids, cb){
    let uuidStr = "";
    uuids.forEach(uuid=>{
        uuidStr+= (uuidStr==''?'':',') +uuid;
    });

    let queryStr = `select title, subTitle, uuid, pubDate from items where uuid in ( ${uuidStr} ) order by id asc`;
    console.log(queryStr);
    this._queryData(queryStr, cb);
}


public searchSimplifiedItemsFor(bookNames:String[], period:any, pageSize, page, cb){
    //prepare query here
    let queryStr="SELECT title, subTitle, uuid, pubDate FROM items ";
    let whereStr = '';

    if(bookNames.length>0){
        let whereStrs = [];
        bookNames.forEach(bookName=>{
            whereStrs.push(`title like "%${bookName}%"`);
        });
        if(whereStrs.length>0){
            whereStr = whereStrs.join(' or ');
        }
    }

    var dateStr = '';

    if(period.length>0 && period[0] && period[1]){
        switch(period[0].toLowerCase()){
            case 'on':
            dateStr=`pubDate='${period[1]}'`;
            break;
            case 'on or before':
            dateStr=`pubDate<='${period[1]}'`;
            break;
            case 'on or after':
            dateStr=`pubDate>='${period[1]}'`;
            break;
            default:
            dateStr=`pubDate between '${period[1]}' and '${period[2]}'`;
        }
    }

    var queryParts = [];

    if(whereStr.length>0){
        queryParts.push(`( ${whereStr} )`);
    }

    if(dateStr.length>0){
        queryParts.push(dateStr);
    }

    if(queryParts.length>0){
        queryStr+=` where ` + queryParts.join(' and ');
    }
    //for search, we need to order from low to high
    if(bookNames.length!=this.bookTitles.length){
        queryStr+=` order by id desc `;
    }
    queryStr+=` limit ${pageSize} offset ${pageSize * (page - 1)}`;

    this._queryData(queryStr, cb);
}

public searchItemsFor(bookNames:String[], period:any, pageSize, page, cb){
    //prepare query here
    let queryStr="SELECT * FROM items ";
    let whereStr = '';

    if(bookNames.length>0){
        let whereStrs = [];
        bookNames.forEach(bookName=>{
            whereStrs.push(`title like "%${bookName}%"`);
        });
        if(whereStrs.length>0){
            whereStr = whereStrs.join(' or ');
        }
    }

    var dateStr = '';

    if(period.length>0 && period[0] && period[1]){
        switch(period[0].toLowerCase()){
            case 'on':
            dateStr=`pubDate='${period[1]}'`;
            break;
            case 'on or before':
            dateStr=`pubDate<='${period[1]}'`;
            break;
            case 'on or after':
            dateStr=`pubDate>='${period[1]}'`;
            break;
            default:
            dateStr=`pubDate between '${period[1]}' and '${period[2]}'`;
        }
    }

    var queryParts = [];

    if(whereStr.length>0){
        queryParts.push(`( ${whereStr} )`);
    }

    if(dateStr.length>0){
        queryParts.push(dateStr);
    }

    if(queryParts.length>0){
        queryStr+=` where ` + queryParts.join(' and ');
    }

    //for search, we need to order from low to high
    if(bookNames.length!=this.bookTitles.length){
        queryStr+=` order by id desc `;
    }

    //for search, we need to order from low to high
    queryStr+=` limit ${pageSize} offset ${pageSize * (page - 1)}`;

    this._queryData(queryStr, cb);
}

public getPaginatedItems(pageSize, page, cb) {
    let queryStr:string = `SELECT *  FROM  items limit ${pageSize} offset ${pageSize * (page - 1)}`;
    this._queryData(queryStr, cb);
}

public getSimplifiedPaginatedItems(pageSize, page, cb) {
    let queryStr:string = `SELECT title, subTitle, uuid, pubDate  FROM  items limit ${pageSize} offset ${pageSize * (page - 1)}`;
    this._queryData(queryStr, cb);
}

public addItem(item: Item, cb) {
    this._prepareDb(() => {
        var queryStr: string;
        queryStr = `INSERT INTO items (id, title,subTitle,summary,description,link,enclosure_link,enclosure_length,enclosure_type,duration,pubDate,scriptUrl,uuid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        this.database.execSQL(queryStr, [item.id, item.title, item.subTitle, item.summary, item.description, item.link, item.enclosure_link, item.enclosure_length, item.enclosure_type, item.duration, item.pubDate, item.scriptUrl, item.uuid])
        .then(id => {
            if (cb) cb();
        }, error => {
            console.log("INSERT ERROR", error);
        });
    });
}
public addItems(rss: Rss, cb) {

    //step 1: clear DB
    this.clearDB(() => {
        //now we need to add
        let items: Item[] = rss.channel[0].item;
        var __this = this;
        var addingSingle = function(index: number) {
            __this.addItem(items[index], () => {
                index++;
                if (index == items.length) {
                    console.log('added all data');
                    if(cb)
                    cb();
                } else {
                    addingSingle(index);
                }
            });
        };
        addingSingle(0);
    });
}

public updateItemScript(item: Item, cb = null) {

    this._prepareDb(() => {
        let queryStr: string = `update items set scripture=? where id=?`;
        this.database.execSQL(queryStr, [item.scripture, item.id])
        .then(id => {
            console.log('Successfully updated scripture for ', id);
            if (cb) cb();
        }, error => {
            console.log("Update ERROR", JSON.stringify(error));
        });
    });

}


private _prepareDb(cb = null) {

    if (this.database && this.database.isOpen) {
        if (cb) cb();
    } else {
        (new Sqlite(this.configService.getDBName())).then(db => {
            this.database = db;
            this._createItemTable(cb);
        }, error => {
            console.log("OPEN DB ERROR", error);
        });
    }
}
//CREATE UNIQUE INDEX idx_items_uuid ON items (uuid);
private _createItemTable(cb = null) {
    this.database.execSQL(`CREATE TABLE IF NOT EXISTS items (id INTEGER, title TEXT,
        subTitle TEXT,summary TEXT,description TEXT,link TEXT,
        enclosure_link TEXT,enclosure_length TEXT,enclosure_type TEXT,
        duration TEXT,pubDate TEXT,scriptUrl TEXT,scripture TEXT, uuid INTEGER);
        `).then(
            id=>{
                if (cb) cb();
            },
            error=>{
                console.log("CREATE TABLE ERROR", error);
            }
        )
    }

    private _queryData(queryStr: string, cb) {
        console.log('query data:', queryStr);
        this._prepareDb(() => {
            console.log('db prepared finished');
            this.database.all(queryStr).then(rows => {
                console.log('find all the data ', rows.length);
                var items = [];
                for (var row in rows) {
                    var item = new Item();;

                    if(rows[row].length<5){
                        item['title'] = rows[row][0]==null?"":rows[row][0];
                        item['subTitle'] = rows[row][1]==null?"":rows[row][1];
                        item['uuid'] = rows[row][2]==null?"":rows[row][2];
                        item['pubDate'] = rows[row][3]==null?"":rows[row][3];
                    }else{
                        item.id = rows[row][0];
                        item.title = rows[row][1];
                        item.subTitle = rows[row][2];
                        item.summary = rows[row][3];
                        item.description = rows[row][4];
                        item.link = rows[row][5];

                        item.enclosure_link = rows[row][6];
                        item.enclosure_length = rows[row][7];
                        item.enclosure_type = rows[row][8];
                        item.duration = rows[row][9];
                        item.pubDate = rows[row][10];

                        item.scriptUrl = rows[row][11];
                        item.scripture = rows[row][12];

                        item.uuid = rows[row][13];
                    }

                    items.push(item);
                }

                cb(items);
            },
            err=>{
                console.log('got error here', err);
                //if there are error in DB, we need to clean db
                this.clearDB(()=>cb([]));
            }
        );
    });
}
}
