import { Component } from '@angular/core';
import { PaginatorComponent } from "../../../_shared/paginator/paginator.component";
import { IPageNavigationOption, IPaginatorNavigation } from '../../../../source/models/paginator.models';

@Component({
	selector: 'app-formula1-standings-base',
	standalone: true,
	imports: [PaginatorComponent],
	templateUrl: './formula1-standings-base.component.html',
	styleUrl: './formula1-standings-base.component.css'
})
export class Formula1StandingsBaseComponent {
	
	navigation!: IPaginatorNavigation;

	constructor() {
		this.initialNavigation();
	}

	initialNavigation(){
		this.navigation = {
			options: [
				{ text: 'Scrap data', value: "scrap-data", disabled: false },
				
			],
			icon: 'fa-solid fa-user-ninja'
		};
	}

	onNavigationCreateClicked($event: IPageNavigationOption) {
		console.log('Navigation option clicked:', $event);
	}

	onSyncClicked($event: void) {
		console.log('Sync button clicked');
	}
}
