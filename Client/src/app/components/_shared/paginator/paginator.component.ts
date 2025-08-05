import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IPageNavigationOption, IPageNavigation, IPageOrder, IPageOrderSelected, IPageFilter, IPageReady } from '../../../source/models/paginator.models';
import { CommonModule, JsonPipe } from '@angular/common';
import { LocalStorageService } from '../../../services/common/local-storage.service';
import { Tuple2, Tuple3 } from '../../../source/models/tuple.models';

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [JsonPipe, CommonModule],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit, OnChanges {

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

    // pager    
    @Input() pagerDataInfo!: Tuple2<number, number>;
    pagerNumber: number = 1;
    pagerSize: number = 0;
    pagerFrom: number = 0;
    pagerTo: number = 0;
    pagerIsFirstDisabled: boolean = true;
    pagerIsPreviousDisabled: boolean = true;
    pagerIsNextDisabled: boolean = true;
    pagerIsLastDisabled: boolean = true;
    pagerVisible: boolean = false;

    constructor(private localStorageService: LocalStorageService) {  
        this.pagerSize = localStorageService.getPageSize();      
    }

    ngOnInit() {
        this.orderSelected = {            
            value: this.orderData.options[this.orderData.startPosition].value,
            isAscending: this.orderData.isAscending,
        };

        this.filterData = this.localStorageService.getPageFilter(this.filterSection);
        this.pageReady('init');
    }

    ngOnChanges(changes: SimpleChanges): void {
        const prev = changes['pagerDataInfo'].previousValue;
        const curr = changes['pagerDataInfo'].currentValue;

      if (prev !== curr) {
            this.pagerDataInfo = curr;    
            
            this.pagerFrom = (this.pagerNumber * this.pagerSize) - this.pagerSize + 1;        
            this.pagerTo = this.pagerFrom + this.pagerDataInfo.param1 - 1;
            this.pagerVisible = this.pagerDataInfo.param2 > 0;

            this.pagerIsFirstDisabled = this.pagerIsPreviousDisabled = this.pagerFrom == 1;         
            this.pagerIsLastDisabled = this.pagerIsNextDisabled = this.pagerTo == this.pagerDataInfo.param2;
      }
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

    onPagerOptionClicked(option: string) {
        console.log(option);
    }

    onPagerSizeClicked($event: MouseEvent, option: number) {
        console.log(option);
    }
}
