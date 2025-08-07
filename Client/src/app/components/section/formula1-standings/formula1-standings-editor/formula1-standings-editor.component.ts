import { Component, OnInit } from '@angular/core';
import { Tuple2 } from '../../../../source/models/tuple.models';
import { BreadcrumbComponent } from '../../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbFactory } from '../../../../source/factories/breadcrumb.factory';
import { EnumSections } from '../../../../source/models/enums/sections.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-formula1-standings-editor',
    standalone: true,
    imports: [BreadcrumbComponent],
    templateUrl: './formula1-standings-editor.component.html',
    styleUrl: './formula1-standings-editor.component.css'
})
export class Formula1StandingsEditorComponent implements OnInit {

    breadcrumb: Tuple2<string,string>[] = [];

    constructor(
        private activatedRoute: ActivatedRoute) {
        this.breadcrumb = BreadcrumbFactory.create(EnumSections.Formula1StandingsEditor);
    }

    /*
        parameters are received?
        yes:
            block form
            exists data?
            yes:            
                msg: data exists
                button: redo scrap data
            no:
                msg: data does not exists
                button: scrap data
        no:
            button: scrap data
    */

    async ngOnInit() {
        this.activatedRoute.params.subscribe(async params => {			
			let type: string = params['type'];
            let year: number = params['year'];

            if (type !== undefined && year !== undefined) {                
                await this.getDataAsync(type, year);
            }

            this.setupForm(type, year);
		});	
    }

    async getDataAsync(type: string, year: number) {        
    }

    setupForm(type: string, year: number) {        
    }
}
