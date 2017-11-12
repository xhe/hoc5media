export class Rss {
    public channel: Channel[];
    constructor(data = null, rssType: string = "", lan:string="") {
        this.channel = [];
        if (data) {
            data.rss.channel.forEach(channelData => {
                this.channel.push(new Channel(channelData, rssType, lan));
            });
        }
    }
}

export class Channel {
    public title: string;
    public description: string;
    public image: ChannelImage;
    public summary: string;
    public item: Item[];
    public link: string;

    constructor(channelData = null, rssType: string = "", lan:string="") {

        if (channelData) {
            this.title = this._processTitle(channelData['title'][0], rssType, lan);
            this.description = this._processDescription(channelData['description'][0], rssType, lan);
            this.link = channelData['link'][0];
            this.image = new ChannelImage(channelData['image'][0]);
            this.summary = channelData['itunes:summary'][0];

            this.item = [];

            let index = 0;

            channelData.item.forEach(itemData => {
                this.item.push(new Item(itemData, index));
                index++;
            });
        } else {
            this.title = "";
            this.description = "";
            this.link = "";
            this.image = new ChannelImage(null);
            this.summary = "";

            this.item = [];
        }
    }

    _processTitle(title, rssType, lan){

        if(rssType=='qt'){
            if(lan=='en'){
                return 'Quiet Time';
            }else{
                return '每日灵修';
            }
        }
        if(rssType == "weekly_zh"){
            if(lan=='en'){
                return 'HOC5 Chinese Sermons';
            }else{
                return '基督之家第五家中文讲道';
            }
        }

        if(rssType == "weekly_en"){
            if(lan=='en'){
                return 'HOC5 English Sermons';
            }else{
                return '基督之家第五家英文讲道';
            }
        }

        return title;

    }

    _processDescription(description, rssType, lan) {
        if (rssType == "weekly_zh" || rssType == "weekly_en") {
            console.log('pased lan is ', lan);
            if(lan!='zh'){
                return 'We are called to magnify God and glorify Him, to lead people to Jesus and membership in his family, to play a role in nurturing them to Christ like maturity, and equip them for their ministry in the church and mission in the world.';
            }else{
                return '北加州基督之家是由台北基督之家創辦人寇世遠監督所創立，目前基督之家在灣區已經有七家教會。第五家位於矽谷Cupertino市。有關基督之家其他各家的詳細介紹，請到 www.hoc.org';
            }
        } else if(rssType='qt'){
            return lan=='en'?'For every reborn Christian, there should be one new thing added to his life, Quiet Time with God. This is not only a pure quiet time, but also a holy period with God. ': '每一個重生得救的基督徒，在他每天的生活裏就多了一樣新事，就是「靈修生活」，它不只是個安靜的時刻 (Quiet time)，也是個敬虔的時間，更是個與神獨處的時光。';
        }
        return description;
    }

}



export class ChannelImage {
    public url: string;
    public title: string;
    public link: string;

    constructor(channelImageData = null) {

        if (channelImageData) {
            this.url = channelImageData['url'][0];
            this.title = channelImageData['title'][0];
            this.link = channelImageData['link'][0];
        } else {

            this.url = "";
            this.title = "";
            this.link = "";
        }
    }
}

export class CustomItem{
    public id:number;
    public title:string;
    public note:string;
    public favorite:boolean;
    public uuid:number;
}

export class Item {

    public id:number;
    public title: string;
    public subTitle: string;
    public summary: string;
    public description: string;
    public link: string;
    public enclosure_link: string;
    public enclosure_length: string;
    public enclosure_type: string;

    public duration: string;
    public pubDate: string;

    public scriptUrl: string;
    public scripture: string;

    public uuid:number;

    constructor(itemData = null, id = 0) {
        this.id = id;
        if (itemData) {
            this.title = (itemData['title'] && itemData['title'][0]) ? itemData['title'][0] : "";
            this.subTitle = (itemData['itunes:subtitle'] && itemData['itunes:subtitle'][0]) ? itemData['itunes:subtitle'][0].replace('【詳見全文】', '') : "";

            this.summary = (itemData['itunes:summary'] && itemData['itunes:summary'][0]) ? itemData['itunes:summary'][0] : "";
            this.scriptUrl = this._extractScriptUrl(this.summary);

            this.description = (itemData['description'] && itemData['description'][0]) ? itemData['description'][0] : "";

            this.link =  (itemData['link'] &&  itemData['link'][0]) ? itemData['link'][0] : "";
            this.pubDate = itemData['pubDate'] ? this._convertDate(itemData['pubDate'][0]) : "";
            this.uuid = itemData['pubDate'] ? this._generateUUID(itemData['pubDate'][0]) : 0;

            this.duration = (itemData['itunes:duration'] && itemData['itunes:duration'][0]) ? itemData['itunes:duration'][0] : "";

            this.enclosure_link = (itemData['enclosure'] && itemData['enclosure'][0] && itemData['enclosure'][0]['$'] && itemData['enclosure'][0]['$']['url'])? itemData['enclosure'][0]['$']['url'] : "";
            this.enclosure_length = (itemData['enclosure'] && itemData['enclosure'][0] &&  itemData['enclosure'][0]['$'] && itemData['enclosure'][0]['$']['length'])? itemData['enclosure'][0]['$']['length'] : "";
            this.enclosure_type = (itemData['enclosure'] &&  itemData['enclosure'][0] &&  itemData['enclosure'][0]['$'] && itemData['enclosure'][0]['$']['type'])? itemData['enclosure'][0]['$']['type'] : "";

        } else {
            this.title = "";
            this.subTitle = "";
            this.summary = "";
            this.description = "";
            this.link = "";
            this.pubDate = "";
            this.duration = "";
            this.enclosure_link = "";
            this.enclosure_length = "";
            this.enclosure_type = "";

        }

    }

    isTodayPublished() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var dds = '';
        var mms = '';
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dds = '0' + dd
        } else {
            dds = '' + dd;
        }
        if (mm < 10) {
            mms = '0' + mm
        } else {
            mms = '' + mm;
        }
        var todayStr = yyyy + "-" + mms + "-" + dds;
        return this.pubDate === todayStr;
    }

    _extractScriptUrl(content: string): string {
        var startingPos = content.indexOf('<a href=') ;
        if (startingPos > 0) {
            var endingPos = content.indexOf('"', startingPos+20);
            if(endingPos > startingPos+9)
                return content.substring(startingPos+9, endingPos).replace('amp;','');
            else
                return '';
        } else {
            return '';
        }
    }

    _convertDate(dt: string) {
        //Sat, 26 Aug 2017 00:00:00 -0700
        var parts = dt.split(' ');
        var year = parts[3];
        var day = parts[1];
        var month = '01';
        switch (parts[2].toLowerCase()) {
            case "jan": month = '01'; break;
            case "feb": month = '02'; break;
            case "mar": month = '03'; break;
            case "apr": month = '04'; break;
            case "may": month = '05'; break;
            case "jun": month = '06'; break;
            case "jul": month = '07'; break;
            case "aug": month = '08'; break;
            case "sep": month = '09'; break;
            case "oct": month = '10'; break;
            case "nov": month = '11'; break;
            case "dec": month = '12'; break;
        }
        return year + '-' + month + '-' + day;
    }

    _generateUUID(dt:string):number{
        //Sat, 26 Aug 2017 00:00:00 -0700
        var parts = dt.split(' ');
        var year = parts[3];
        var day = parts[1];
        var month = '01';
        switch (parts[2].toLowerCase()) {
            case "jan": month = '01'; break;
            case "feb": month = '02'; break;
            case "mar": month = '03'; break;
            case "apr": month = '04'; break;
            case "may": month = '05'; break;
            case "jun": month = '06'; break;
            case "jul": month = '07'; break;
            case "aug": month = '08'; break;
            case "sep": month = '09'; break;
            case "oct": month = '10'; break;
            case "nov": month = '11'; break;
            case "dec": month = '12'; break;
        }
        var str = year + month + day;
        return parseInt(str);
    }
}
