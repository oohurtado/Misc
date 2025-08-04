import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPageNavigationOption, IPaginatorNavigation } from '../../../source/models/paginator.models';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [JsonPipe, CommonModule],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent {

    // navigation
    @Input() navigation: IPaginatorNavigation = { options: [] };
    @Output() evtNavigationCreateClicked: EventEmitter<IPageNavigationOption> = new EventEmitter<IPageNavigationOption>();
    navigationSelected: IPageNavigationOption | null = null;   

    @Output() evtSyncClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }
    
    onNavigationClicked($event: MouseEvent, option: IPageNavigationOption) {
        this.navigationSelected = option;        
        this.evtNavigationCreateClicked.emit(this.navigationSelected);
    }

    onSyncClicked($event: MouseEvent) {
        this.evtSyncClicked.emit();
    }


    
    // this.evtBasic = new EventEmitter<number>();
    // @Output() evtBasic!: EventEmitter<number>;
    // getRandomNumber(): number {
    //     return Math.floor(Math.random() * 100);
    // }
    // notify() {
    //     this.evtBasic.emit(this.getRandomNumber());
    // }
}
