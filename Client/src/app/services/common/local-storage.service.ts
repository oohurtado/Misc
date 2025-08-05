import { Injectable } from '@angular/core';
import { IPageFilter } from '../../source/models/paginator.models';
import { EnumFormula1StandingType } from '../../source/models/enums/formula1-standing-types.enum';
import { Tuple3 } from '../../source/models/tuple.models';
import { general } from '../../source/general';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

	////////////
	/* common */
	////////////

	// guarda en local storage
	setValue(key: string, value: string) {
		if (typeof (Storage) !== "undefined") {
			localStorage.setItem(key, value);
		}
		else {
			console.error('localStorage not supported');
		}
	}

	// obtiene de local storage
	getValue(key: string) {
		if (typeof (Storage) !== "undefined") {
			return localStorage.getItem(key);
		}
		else {
			console.error('localStorage not supported');
			return null;
		}
	}    

    clean() {
		localStorage.clear();
	}

	///////////
	/* pages */
	///////////

	getPageSize() : number {
        let pageSize = localStorage.getItem(general.LS_PAGE_SIZE);
        if (pageSize === null || pageSize === '') {
            localStorage.setItem(general.LS_PAGE_SIZE, '10');
        }

		pageSize = localStorage.getItem(general.LS_PAGE_SIZE);
		return Number(pageSize);
    }

	setPageSize(pageSize: number) {
        localStorage.setItem(general.LS_PAGE_SIZE, pageSize.toString());
    }	

	/////////////////
	/* page filter */
	/////////////////
	
    getPageFilter(section: string) : IPageFilter[] {
		let pageFilter: IPageFilter[] = [];

		// si existe en LS
		let field = this.getValue('pf-' + section);
		if (field !== null) {
			pageFilter = JSON.parse(field);
			return pageFilter;
		}

		if (section === 'formula1-standings') {	

            let startYear: number = 2001;
            let endYear: number = new Date().getFullYear();
            let years: Tuple3<string, string, boolean>[] = [];
            for (let i = startYear; i <= endYear; i++) {
                years.push(new Tuple3(i.toString(), i.toString(), true));
            }

			let pageFilter: IPageFilter[] = [
				{
					section: 'Type',
					extra: [
						new Tuple3(EnumFormula1StandingType.Drivers, EnumFormula1StandingType.Drivers, true),
                        new Tuple3(EnumFormula1StandingType.Constructors, EnumFormula1StandingType.Constructors, true)
					]
				},
                {
                    section: 'Year',
                    extra: years
                }               
			];        
			let json = JSON.stringify(pageFilter)
			this.setValue('pf-' + section, json);	
			return pageFilter;
		}			 

		return pageFilter;
    }

    getPageFilterForAsString(pageFilter: IPageFilter[]): string {
		let result = '';

		pageFilter.forEach(p => {
			if (result !== '') {
				result = result + ';';
			}
			result = result + p.section;

			var values = p.extra.filter(p => p.param3).map(p => p.param1);
			result = result + ':' + values.join(',');
		});
		
        return result;
    }	

	setPageFilter(section: string, data: IPageFilter[]) {
		let json = JSON.stringify(data)
		this.setValue('pf-' + section, json);	
    }    
}
