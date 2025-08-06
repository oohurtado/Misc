import { Component } from '@angular/core';
import { PaginatorComponent } from "../../../_shared/paginator/paginator.component";
import { IPageNavigationOption, IPageNavigation, IPageOrder, IPageOrderSelected, IPageFilter, IPageReady } from '../../../../source/models/paginator.models';
import { Formula1StandingsListComponent } from '../formula1-standings-list/formula1-standings-list.component';
import { LocalStorageService } from '../../../../services/common/local-storage.service';
import { Tuple2 } from '../../../../source/models/tuple.models';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbFactory } from '../../../../source/factories/breadcrumb.factory';
import { EnumSections } from '../../../../source/models/enums/sections.enum';

@Component({
	selector: 'app-formula1-standings-base',
	standalone: true,
	imports: [PaginatorComponent, Formula1StandingsListComponent, BreadcrumbComponent],
	templateUrl: './formula1-standings-base.component.html',
	styleUrl: './formula1-standings-base.component.css'
})
export class Formula1StandingsBaseComponent {

	section: string = 'formula1-standings';
	pageReady!: IPageReady;	// parameters to request data
	pagerDataInfo!: Tuple2<number, number>; // total, grandtotal
	breadcrumb: Tuple2<string,string>[] = [];

	constructor(
		private router: Router,
	) {		
		this.breadcrumb = BreadcrumbFactory.create(EnumSections.Formula1StandingsList);
	}

	onNavigationClicked($event: IPageNavigationOption) {
		if ($event.value === "scrap-data") {
			this.router.navigateByUrl("/sections/f1-standings/editor")
		}
	}	

	onDataInfoChanged($event: Tuple2<number, number>) {
		this.pagerDataInfo = $event;
	}
}
