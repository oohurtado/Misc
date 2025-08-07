import { Component } from '@angular/core';
import { Tuple2 } from '../../../../source/models/tuple.models';
import { BreadcrumbFactory } from '../../../../source/factories/breadcrumb.factory';
import { EnumSections } from '../../../../source/models/enums/sections.enum';
import { BreadcrumbComponent } from '../../../_shared/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-formula1-standings-details',
    standalone: true,
    imports: [BreadcrumbComponent],
    templateUrl: './formula1-standings-details.component.html',
    styleUrl: './formula1-standings-details.component.css'
})
export class Formula1StandingsDetailsComponent {

    breadcrumb: Tuple2<string,string>[] = [];

    constructor() {
        this.breadcrumb = BreadcrumbFactory.create(EnumSections.Formula1StandingsDetails);
    }
}
