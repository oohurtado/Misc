import { Component, OnInit } from '@angular/core';
import { Tuple2 } from '../../../../source/models/tuple.models';
import { BreadcrumbFactory } from '../../../../source/factories/breadcrumb.factory';
import { EnumSections } from '../../../../source/models/enums/sections.enum';
import { BreadcrumbComponent } from '../../../_shared/breadcrumb/breadcrumb.component';
import { ScrapService } from '../../../../services/scrap.service';
import { ActivatedRoute } from '@angular/router';
import { Utils } from '../../../../source/helpers/utils.helper';
import { Scr_Formula1StandingScrap } from '../../../../source/models/scrap/formula1-standing.scrap';
import { ApiResponse } from '../../../../source/models/api.response';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-formula1-standings-details',
    standalone: true,
    imports: [BreadcrumbComponent, JsonPipe],
    templateUrl: './formula1-standings-details.component.html',
    styleUrl: './formula1-standings-details.component.css'
})
export class Formula1StandingsDetailsComponent implements OnInit {

    breadcrumb: Tuple2<string,string>[] = [];   // navigation
    errorMessage!: string | null;               // error handling
    isProcessing!: boolean;                     // processing request

    response!: ApiResponse<Scr_Formula1StandingScrap>; 
    rows: number = 0;

    constructor(
        private scrapService: ScrapService,
        private activatedRoute: ActivatedRoute
    ) {
        this.breadcrumb = BreadcrumbFactory.create(EnumSections.Formula1StandingsDetails);
    }

    async ngOnInit() {
        this.activatedRoute.params.subscribe(async params => {			
			let type: string | undefined = params['type'];
            let year: number | undefined = params['year'];

            if (type !== undefined && year !== undefined) {
                await this.getDataAsync(type, year);

                this.breadcrumb[this.breadcrumb.length - 1].param2 = `Details ${type}, ${year}`;
            }
		});	
    }

    async getDataAsync(type: string, year: number) {  
        this.errorMessage = null;
        await this.scrapService
            .getFormula1StandingsAsync(type, year)
            .then(p => { 
                this.response = p;     
            })
            .catch(p => {
                this.errorMessage = Utils.getErrorsResponse(p);
            });
    }

    getPositionFixed(sPos: string) : string{
        let pos = Number(sPos);
        return pos < 10 ? '\u00A0' + pos : pos + '';
    }    

    sum(arr: string[]) : number {
        return arr.map(str => {
            // Si está vacío o es "-", devolver 0
            if (str === "" || str === "-") {
                return 0;
            }
            // Intentar convertir a número
            const n = Number(str);
            // Si no es un número válido (NaN), devolver 0
            return isNaN(n) ? 0 : n;
        })
        .reduce((acc, curr) => acc + curr, 0);
    }
}
