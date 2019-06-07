import { Injectable } from '@angular/core';

@Injectable()
export class PostDateService {
    constructor() {
    }

    buildDate(date:number): string {
        // // TODO: Build string here that tells how old 'date' is from now
        // var today = new Date();
        // var hours: number = Math.abs(today - date) / 36e5;
        let now = Date.now();
        let elapsed = now - date;
        elapsed = (elapsed / (1000*60*60)) % 24;
        var hourstr: string = "Posted " + elapsed + "hrs ago"
        return hourstr;
    }
}