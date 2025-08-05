import { Component } from '@angular/core';
import { PaginatorComponent } from "../../../_shared/paginator/paginator.component";
import { IPageNavigationOption, IPageNavigation, IPageOrder, IPageOrderSelected, IPageFilter, IPageReady } from '../../../../source/models/paginator.models';
import { Formula1StandingsListComponent } from '../formula1-standings-list/formula1-standings-list.component';
import { LocalStorageService } from '../../../../services/common/local-storage.service';
import { Tuple2 } from '../../../../source/models/tuple.models';

@Component({
	selector: 'app-formula1-standings-base',
	standalone: true,
	imports: [PaginatorComponent, Formula1StandingsListComponent],
	templateUrl: './formula1-standings-base.component.html',
	styleUrl: './formula1-standings-base.component.css'
})
export class Formula1StandingsBaseComponent {

	navigation!: IPageNavigation;
	order!: IPageOrder;
	filterSection: string = 'formula1-standings';
	pageReadyData!: IPageReady;
	pagerDataInfo!: Tuple2<number, number>;

	constructor(private localStorageService: LocalStorageService) {
		this.initialNavigation();
	}

	initialNavigation(){
		this.navigation = {
			options: [
				{ text: 'Scrap data', value: "scrap-data", disabled: false },
				
			],
			icon: 'fa-solid fa-user-ninja'
		};
		this.order = {
			options: [
				{ text: 'Type', value: 'type', disabled: false },
				{ text: 'Year', value: 'year', disabled: false },
				],
			startPosition: 0,
			isAscending: true
		};	
	}

	onNavigationClicked($event: IPageNavigationOption) {
	}

	onPageReadyClicked($event: IPageReady) {
		this.pageReadyData = $event;
	}	

	onDataInfoChanged($event: Tuple2<number, number>) {
		this.pagerDataInfo = $event;
	}
}
