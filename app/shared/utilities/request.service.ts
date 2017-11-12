import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class RequestService {

    constructor(private http: Http) {
    }

    get(url: string) {
        let headers = new Headers();
        return this.http.get(url)
            .map(this.extractData.bind(this))
            .catch(this.handleError.bind(this));
    }

    getRawData(url: string) {
        return this.http.get(url)
            .map(this.extractXMLData.bind(this))
            .catch(this.handleError.bind(this));
    }

    private extractXMLData(res: Response){
        let body = res.text();
        return body || {};
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response) {
        console.log('error is ===>', error);
    }
}
