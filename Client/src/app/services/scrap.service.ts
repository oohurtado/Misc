import { Injectable } from '@angular/core';
import { RequestService } from './common/request.service';
import { Scr_Formula1StandingRequest } from '../source/models/scrap/formula1-standing.request';
import { ApiResponse } from '../source/models/api.response';
import { Scr_Formula1StandingScrap } from '../source/models/scrap/formula1-standing.scrap';
import { Scr_Formula1StandingResponse } from '../source/models/scrap/formula1-standing.response';

@Injectable({
    providedIn: 'root'
})
export class ScrapService {

    constructor(private requestService: RequestService) { }

    scrapFormula1Standings(model: Scr_Formula1StandingRequest) {
        return this.requestService.post(`/scrap/formula1/standings`, model);
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

    getFormula1StandingsExists(type: string, year: number) {
        return this.requestService.get<ApiResponse<Date>>(`/scrap/formula1/standings/${type}/${year}/exists`);
    }

    getFormula1StandingsExistsAsync(type: string, year: number) : Promise<ApiResponse<Date>> {
        return new Promise((resolve, reject) => {
            this.getFormula1StandingsExists(type, year)
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

    getFormula1StandingsByPage(sortColumn: string, sortOrder: string, pageNumber: number, pageSize: number, term: string, filters: string) {	
		return this.requestService.get<ApiResponse<Scr_Formula1StandingResponse[]>>(`/scrap/formula1/standings/${sortColumn}/${sortOrder}/${pageNumber}/${pageSize}?term=${term}&filters=${filters}`);
	}

	getFormula1StandingsByPageAsync(sortColumn: string, sortOrder: string, pageNumber: number, pageSize: number, term: string, filters: string) : Promise<ApiResponse<Scr_Formula1StandingResponse[]>> {
		return new Promise((resolve, reject) => {
			this.getFormula1StandingsByPage(sortColumn, sortOrder, pageNumber, pageSize, term, filters)
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
