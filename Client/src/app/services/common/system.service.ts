import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Sys_Ping } from '../../source/models/system/ping';

@Injectable({
    providedIn: 'root'
})
export class SystemService {

    constructor(private requestService: RequestService) { }

    getPing() {
        return this.requestService.get<Sys_Ping>('/system/ping');
    }

    getPingAsync(): Promise<Sys_Ping> {
        return new Promise((resolve, reject) => {
            this.getPing()
                .subscribe({
                    next: (value) => {
                        resolve(value);
                    },
                    error: (response) => {
                        reject(response);
                    }
                });
        });
    }
}
