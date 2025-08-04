import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPageNavigationOption, IPageNavigation, IPageOrder, IPageOrderSelected } from '../../../source/models/paginator.models';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [JsonPipe, CommonModule],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {

    // navigation
    @Input() navigationData: IPageNavigation = { options: [] };
    @Output() evtNavigationClicked: EventEmitter<IPageNavigationOption> = new EventEmitter<IPageNavigationOption>();
    navigationSelected: IPageNavigationOption | null = null;   

    // sync
    @Output() evtSyncClicked: EventEmitter<void> = new EventEmitter<void>();
    
    // order
    @Input() orderData!: IPageOrder;
    @Output() evtOrderSelected: EventEmitter<IPageOrderSelected> = new EventEmitter<IPageOrderSelected>();
    currentOrderOption!: string;
    orderSelected!: IPageOrderSelected;

    constructor() {
    }

    ngOnInit() {
        this.orderSelected = {            
            value: this.orderData.options[this.orderData.startPosition].value,
            isAscending: this.orderData.isAscending,
        }
    }
    
    onNavigationClicked($event: MouseEvent, option: IPageNavigationOption) {
        this.navigationSelected = option;        
        this.evtNavigationClicked.emit(this.navigationSelected);
    }

    onSyncClicked($event: MouseEvent) {
        this.evtSyncClicked.emit();
    }

    onOrderOptionClicked(event: Event, index: number) {
        this.orderSelected.value = this.orderData.options[index].value;
        this.currentOrderOption = this.orderSelected.value;
        this.evtOrderSelected.emit(this.orderSelected);
    }

    onOrderSortClicked(event: Event) {
        let button = event.target as HTMLButtonElement;
        button.blur();
        this.orderSelected.isAscending = !this.orderSelected.isAscending;
        this.evtOrderSelected.emit(this.orderSelected);
    }

    isOrderOptionSelectedClicked(data: string): boolean {
        return data === this.orderSelected.value;
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
