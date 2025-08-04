import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Formula1StandingsListComponent } from "./formula1-standings-list/formula1-standings-list.component";
import { PaginatorComponent } from "../../_shared/paginator/paginator.component";
import { IPageNavigation } from '../../../source/models/paginator.models';

@Component({
    selector: 'app-formula1-standings',
    standalone: true,
    templateUrl: './formula1-standings.component.html',
    styleUrl: './formula1-standings.component.css',
    imports: [Formula1StandingsListComponent, PaginatorComponent]
})
export class Formula1StandingsComponent {
    
    // someNumber: number = 0;

    // onBasic($event: number) {
    //     console.log('Basic event triggered:', $event);
    //     this.someNumber = $event;
    // }        

    constructor() {   
    }
}
