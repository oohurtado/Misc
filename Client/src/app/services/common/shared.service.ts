import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    constructor() { }

    public evtLoading: Subject<boolean> = new Subject<boolean>();
    public onLoading(value: boolean) {
        this.evtLoading.next(value);
    }
}
