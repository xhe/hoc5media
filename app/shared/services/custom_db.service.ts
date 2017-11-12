import {Injectable} from "@angular/core";
import {ConfigService} from "../utilities/config.service";
import {CustomItem} from '../entities/entities';

var Sqlite = require("nativescript-sqlite");

@Injectable()
export class CustomDbService {

    private database: any;

    constructor(private configService: ConfigService) {
        this._prepareDb();
    }

    public clearDB(cb = null) {
        console.log('start clearning db');
        this._prepareDb(() => {
            console.log('db prepared here');
            //delete dataBase first
            this.database.execSQL('DROP TABLE IF EXISTS CustomItem').then(() => {
                console.log('table is dropped');
                this.database.execSQL('DROP INDEX  IF EXISTS idx_CustomItem_uuid').then(() => {
                     console.log('index is dropped');
                     this._createCustomItemTable(cb);
                 });
            },
            err=>{
                console.log('dropping table error here', err);
                //if table can not be dropped, we then need to delete database
                Sqlite.deleteDatabase(this.configService.getCustomDBName());
                this.dropDB(cb);
            }
        );
    });
}

public dropDB(cb=null){
    Sqlite.deleteDatabase(this.configService.getCustomDBName());
    console.log('now let us delete the whole database:', this.configService.getCustomDBName());
    if(cb)
    cb([]);
}

public getNotedItems(pageSize, page, cb){
    let queryStr: string = `SELECT * FROM CustomItem where note!='' limit ${pageSize} offset ${pageSize * (page - 1)}`;
    this._queryData(queryStr, cb);
}

public getSimplifiedNotedItems(pageSize, page, cb){
    let queryStr: string = `SELECT id, uuid FROM CustomItem where note!='' limit ${pageSize} offset ${pageSize * (page - 1)}`;
    this._queryData(queryStr, cb);
}

public getFavoritedItems(pageSize, page, cb){
    let queryStr: string = `SELECT * FROM CustomItem where favorite=1 limit ${pageSize} offset ${pageSize * (page - 1)}`;
    this._queryData(queryStr, cb);
}

public getSimplifiedFavoritedItems(pageSize, page, cb){
    let queryStr: string = `SELECT id, uuid FROM CustomItem where favorite=1 limit ${pageSize} offset ${pageSize * (page - 1)}`;
    this._queryData(queryStr, cb);
}

public getFavoritedItemUUIDs(pageSize, page, cb){
    let queryStr: string = `SELECT uuid FROM CustomItem where favorite=1 limit ${pageSize} offset ${pageSize * (page - 1)}`;
    this._prepareDb(() => {
        console.log('db prepared finished, query string:', queryStr);
        this.database.all(queryStr).then(rows => {
            console.log('find all the data ', rows.length);
            var uuids = [];
            for (var row in rows) {
                uuids.push(rows[row][0]);
            }
            cb(uuids);
        },
        err=>{
            console.log('got error here', err);
            //if there are error in DB, we need to clean db
            this.clearDB(()=>cb([]));
        }
    );
});
}

public getNotedtemUUIDs(pageSize, page, cb){
    let queryStr: string = `SELECT uuid FROM CustomItem where note!='' limit ${pageSize} offset ${pageSize * (page - 1)}`;
    this._prepareDb(() => {
        console.log('db prepared finished, query string:', queryStr);
        this.database.all(queryStr).then(rows => {
            console.log('find all the data ', rows.length);
            var uuids = [];
            for (var row in rows) {
                uuids.push(rows[row][0]);
            }
            cb(uuids);
        },
        err=>{
            console.log('got error here', err);
            //if there are error in DB, we need to clean db
            this.clearDB(()=>cb([]));
        }
    );
});
}

public getAllFavoriteItems(cb){
    var q = "select count(*) from CustomItem where favorite=1";
    console.log( 'getAllFavoriteItems');
    this._prepareDb(() => {
        console.log('db prepared done');
        this.database.get(q).then(row=>{
            if(row[0]>0){
                this._queryData("SELECT * FROM CustomItem where favorite=1", cb)
            }else{
                console.log('return empty here');
                cb([]);
            }
        });
    });
}

public getAllFavoriteItemsSimplified(cb){
    var q = "select count(*) from CustomItem where favorite=1";
    console.log( 'getAllFavoriteItems');
    this._prepareDb(() => {
        console.log('db prepared done');
        this.database.get(q).then(row=>{
            console.log('query result is ');
            console.log(JSON.stringify(row));
            if(row[0]>0){
                this._queryData("SELECT id, uuid FROM CustomItem where favorite=1", cb)
            }else{
                console.log('return empty here');
                cb([]);
            }
        });
    });
}

public getFavoriteItemFor(uuid, cb){
    let query = `select * from CustomItem where uuid = ${uuid}`;
    console.log('query===>', query);
    this._queryData(query, cb);
}

public getAllNotedItems(cb){
    var q = "select count(*) from CustomItem where note !=''";
    console.log('query str ', q);
    this._prepareDb(() => {
        console.log('cust db prepard ');
        this.database.get(q).then(row=>{
             console.log('cust result is ', row[0]);
            if(row[0]>0){
                this._queryData("SELECT * FROM CustomItem where note !=''", cb);
            }else{
                cb([]);
            }
        });
    });
}

public getAllNotedItemsSimplified(cb){
    var q = "select count(*) from CustomItem where note !=''";
    console.log('query str ', q);
    this._prepareDb(() => {
        console.log('cust db prepard ');
        this.database.get(q).then(row=>{
             console.log('cust result is ', row[0]);
            if(row[0]>0){
                this._queryData("SELECT id, uuid FROM CustomItem where note !=''", cb);
            }else{
                cb([]);
            }
        });
    });
}

public getAll(cb){
    this._queryData("SELECT * FROM CustomItem", cb)
}

public updateCustomItemFor(uuid:number, updateField:string, updateValue:any, cb){
    //first search to see if it existes
    let query = `select count(*) from CustomItem where uuid = ${uuid}`;
    console.log('query customItem: ', query);
    this._prepareDb(() => {
        this.database.get(query).then(row=>{

            var  queryStr;
            console.log('rowf found ', JSON.stringify(row));
            if(row[0]==0){

                queryStr = `INSERT INTO CustomItem (${updateField}, uuid) VALUES (?,?)`;
                this.database.execSQL(queryStr, [updateValue, uuid])
                .then(id => {
                    if (cb) cb();
                }, error => {
                    console.log("Update ERROR", JSON.stringify(error), queryStr );
                })
                ;

            }else{
                //inserting
                queryStr = `UPDATE CustomItem set ${updateField} = ? where uuid=?`;
                console.log( 'update here ', queryStr, updateValue, uuid)
                this.database.execSQL(queryStr, [updateValue, uuid])
                .then(id => {
                    console.log('Successfully updated customItem for ', id);
                    if (cb) cb();
                }, error => {
                    console.log("Update ERROR", JSON.stringify(error));
                })
                ;
            }
        },

        err=>{
            console.log('getting error for query ',query);
            console.log(err);
        }
    );
    });
}

private _prepareDb(cb = null) {

    if (this.database && this.database.isOpen) {
        if (cb) cb();
    } else {
        (new Sqlite(this.configService.getCustomDBName())).then(db => {
            this.database = db;
            this._createCustomItemTable(cb);
        }, error => {
            console.log("OPEN DB ERROR", error);
        });
    }

}
//CREATE UNIQUE INDEX idx_CustomItem_uuid ON CustomItem (uuid);
private _createCustomItemTable(cb = null) {
    this.database.execSQL(`CREATE TABLE IF NOT EXISTS CustomItem
        (id INTEGER PRIMARY KEY, title TEXT, note TEXT, favorite INTEGER, uuid INTEGER )
    `)
    .then(
        id => {
            //if (cb) cb();
            console.log('CustomItem table is created here');
            this.database.execSQL(`CREATE INDEX idx_CustomItem_uuid ON CustomItem (uuid)`)
            .then(
                id=>{
                    console.log('CustomItem index is created here');
                    if (cb) cb();
                },
                error=>{
                    console.log("CREATE CustomItem TABLE ERROR", error);
                }
            )
        },
        error => {
            console.log("CREATE CustomItem TABLE ERROR", error);
        }
    );
}

private _queryData(queryStr: string, cb) {
    console.log('query data:', queryStr);
    this._prepareDb(() => {
        console.log('db prepared finished, query string:', queryStr);
        this.database.all(queryStr).then(rows => {
            console.log('find all the data ', rows.length);
            var customItems: CustomItem[] = new Array<CustomItem>();
            for (var row in rows) {
                var item = new CustomItem();
                if(rows[row].length==2){
                    //this is simplifed mode, only UUID is needed
                    item.id = rows[row][0];
                    item.uuid = rows[row][1];
                }else{
                    item.id = rows[row][0];
                    item.title = rows[row][1];
                    item.note = rows[row][2];
                    item.favorite = rows[row][3];
                    item.uuid = rows[row][4];
                }
                customItems.push(item);
            }
            cb(customItems);
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
