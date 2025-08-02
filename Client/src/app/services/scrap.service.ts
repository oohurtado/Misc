import { Injectable } from '@angular/core';
import { RequestService } from './common/request.service';
import { Scr_Formula1StandingRequest } from '../source/models/scrap/formula1-standing.request';
import { ApiResponse } from '../source/models/api.response';
import { Scr_Formula1StandingScrap } from '../source/models/scrap/formula1-standing.scrap';

@Injectable({
    providedIn: 'root'
})
export class ScrapService {

    constructor(private requestService: RequestService) { }

    scrapFormula1Standings(model: Scr_Formula1StandingRequest) {
        return this.requestService.post(`/formula1/standings`, model);
    }

    scrapFormula1StandingsAsync(model: Scr_Formula1StandingRequest) {
        return new Promise((resolve, reject) => {
            this.scrapFormula1Standings(model)
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

    getFormula1Standings(type: string, year: number) {
        return this.requestService.get<ApiResponse<Scr_Formula1StandingScrap>>(`/scrap/formula1/standings/${type}/${year}`);
    }

    getFormula1StandingsAsync(type: string, year: number) : Promise<ApiResponse<Scr_Formula1StandingScrap>> {
        return new Promise((resolve, reject) => {
            this.getFormula1Standings(type, year)
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
