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

    @Input() navigation: IPaginatorNavigation = { options: [] };
    @Output() evtNavigationCreateClicked: EventEmitter<IPageNavigationOption> = new EventEmitter<IPageNavigationOption>();
    
    constructor() {
    }
    onNavigationCreateClicked($event: MouseEvent, arg1: IPageNavigationOption) {
        console.log('onNavigationCreateClicked', $event, arg1);
        this.evtNavigationCreateClicked.emit(arg1);
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
