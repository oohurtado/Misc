import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IPageNavigationOption, IPageNavigation, IPageOrder, IPageOrderSelected, IPageFilter, IPageReady } from '../../../source/models/paginator.models';
import { CommonModule, JsonPipe } from '@angular/common';
import { LocalStorageService } from '../../../services/common/local-storage.service';
import { Tuple3 } from '../../../source/models/tuple.models';

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [JsonPipe, CommonModule],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {

    // paginator
    @Output() evtPageReady: EventEmitter<IPageReady> = new EventEmitter<IPageReady>();

    // navigation
    @Input() navigationData: IPageNavigation = { options: [] };
    @Output() evtNavigationClicked: EventEmitter<IPageNavigationOption> = new EventEmitter<IPageNavigationOption>();
    navigationSelected: IPageNavigationOption | null = null;   
    
    // order
    @Input() orderData!: IPageOrder;    
    currentOrderOption!: string;
    orderSelected!: IPageOrderSelected;

    // filter
    @ViewChild('openFilterModal', { static: true }) openModal!: ElementRef;
    @ViewChild('closeFilterModal', { static: true }) closeModal!: ElementRef;     
    @Input() filterSection!: string;    
    filterData: IPageFilter[] = [];         

    constructor(private localStorageService: LocalStorageService) {        
    }

    ngOnInit() {
        this.orderSelected = {            
            value: this.orderData.options[this.orderData.startPosition].value,
            isAscending: this.orderData.isAscending,
        };

        this.filterData = this.localStorageService.getPageFilter(this.filterSection);

        this.pageReady('init');
    }

    pageReady(buttonClicked: string) {
        this.evtPageReady.emit({
            orderSelected: this.orderSelected,
            buttonClicked: buttonClicked
        });
    }

    onNavigationClicked($event: MouseEvent, option: IPageNavigationOption) {
        this.navigationSelected = option;        
        this.evtNavigationClicked.emit(this.navigationSelected);
    }

    onSyncClicked($event: MouseEvent) {
        this.pageReady('sync');
    }

    onOrderOptionClicked(event: Event, index: number) {
        this.orderSelected.value = this.orderData.options[index].value;
        this.currentOrderOption = this.orderSelected.value;
        this.pageReady('order-option');
    }

    onOrderSortClicked(event: Event) {
        let button = event.target as HTMLButtonElement;
        button.blur();
        this.orderSelected.isAscending = !this.orderSelected.isAscending;
        this.pageReady('order-sort');
    }

    isOrderOptionSelectedClicked(data: string): boolean {
        return data === this.orderSelected.value;
    }

    onFilterClicked() {
        this.openModal.nativeElement.click();
    }

    onFilterCloseClicked($event: MouseEvent) {
        this.filterData = this.localStorageService.getPageFilter(this.filterSection);        
        this.closeModal.nativeElement.click();            
    }

    onFilterElementClicked($event: MouseEvent, section: string, element: Tuple3<string,string,boolean>) {
        let sectionFound = this.filterData.filter(p => p.section == section)[0];
        let extraFound = sectionFound.extra.filter(p => p.param1 == element.param1 && p.param2 == element.param2)[0];
        extraFound.param3 = !extraFound.param3;
    }
    
    onFilterOkClicked($event: MouseEvent) {        
        this.localStorageService.setPageFilter(this.filterSection, this.filterData);
        this.pageReady('filter-ok');
        this.closeModal.nativeElement.click();
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
