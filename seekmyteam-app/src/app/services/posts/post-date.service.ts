import { Injectable } from '@angular/core';

@Injectable()
export class PostDateService {
    constructor() {
    }

    buildDate(date: number): string {
        // // TODO: Build string here that tells how old 'date' is from now
        // var today = new Date();
        // var hours: number = Math.abs(today - date) / 36e5;
        let now = Date.now();
        let elapsed = now - date;
        let elapsedHrs = (elapsed / (1000 * 60 * 60));

        if (elapsedHrs / 24 < 1) {
            if (elapsed < 1)
                return "< 1 hour ago";
            else if (elapsed < 24) {
                return Math.round(elapsed) + " hours ago";
            }
        } else {
            let days = Math.round(elapsed / 24);
            return days + " day(s) ago";
        }
    }
}