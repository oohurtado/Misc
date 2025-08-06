import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IPageNavigationOption, IPageNavigation, IPageOrder, IPageOrderSelected, IPageFilter, IPageReady } from '../../../source/models/paginator.models';
import { CommonModule, JsonPipe } from '@angular/common';
import { LocalStorageService } from '../../../services/common/local-storage.service';
import { Tuple2, Tuple3 } from '../../../source/models/tuple.models';
import { PaginatorFactory } from '../../../source/factories/paginator.factory';

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit, OnChanges {

    @Input() section!: string;

    // paginator
    @Output() evtPageReady: EventEmitter<IPageReady> = new EventEmitter<IPageReady>();

    // navigation
    navigationData: IPageNavigation = { options: [] };
    @Output() evtNavigationClicked: EventEmitter<IPageNavigationOption> = new EventEmitter<IPageNavigationOption>();
    navigationSelected: IPageNavigationOption | null = null;   
    
    // order
    orderData!: IPageOrder;    
    currentOrderOption!: string;
    orderSelected!: IPageOrderSelected;

    // filter
    @ViewChild('openFilterModal', { static: true }) openModal!: ElementRef;
    @ViewChild('closeFilterModal', { static: true }) closeModal!: ElementRef;         
    filterData: IPageFilter[] = [];         

    // pager    
    @Input() pagerDataInfo!: Tuple2<number, number>; // data-size, data-grand-total
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
        this.navigationData = PaginatorFactory.createPageNavigation(this.section);
        this.orderData = PaginatorFactory.createPageOrder(this.section);

        this.orderSelected = {            
            value: this.orderData.options[this.orderData.startPosition].value,
            isAscending: this.orderData.isAscending,
        };

        this.filterData = this.localStorageService.getPageFilter(this.section);
        this.pageReady('init', true);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const prev = changes['pagerDataInfo'].previousValue;
        const curr = changes['pagerDataInfo'].currentValue;

        if (prev !== curr) {
            this.pagerDataInfo = curr;    
            this.refreshPager();
        }
    }

    refreshPager() {
        this.pagerFrom = (this.pagerNumber * this.pagerSize) - this.pagerSize + 1;        
        this.pagerTo = this.pagerFrom + this.pagerDataInfo.param1 - 1;
        this.pagerVisible = this.pagerDataInfo.param2 > 0;

        this.pagerIsFirstDisabled = this.pagerIsPreviousDisabled = this.pagerFrom == 1;         
        this.pagerIsLastDisabled = this.pagerIsNextDisabled = this.pagerTo == this.pagerDataInfo.param2;
    }

    pageReady(buttonClicked: string, setPageNumberToOne: boolean) {
        if (setPageNumberToOne) {
            this.pagerNumber = 1;
        }

        this.evtPageReady.emit({
            orderSelected: this.orderSelected,            
            buttonClicked: buttonClicked,
            pageNumber: this.pagerNumber,
            pageSize: this.pagerSize,
        });
    }

    onNavigationClicked($event: MouseEvent, option: IPageNavigationOption) {
        this.navigationSelected = option;        
        this.evtNavigationClicked.emit(this.navigationSelected);
    }

    onSyncClicked($event: MouseEvent) {
        this.pageReady('sync', true);
    }

    onOrderOptionClicked(event: Event, index: number) {
        this.orderSelected.value = this.orderData.options[index].value;
        this.currentOrderOption = this.orderSelected.value;
        this.pageReady('order-option', true);
    }

    onOrderSortClicked(event: Event) {
        let button = event.target as HTMLButtonElement;
        button.blur();
        this.orderSelected.isAscending = !this.orderSelected.isAscending;
        this.pageReady('order-sort', true);
    }

    isOrderOptionSelectedClicked(data: string): boolean {
        return data === this.orderSelected.value;
    }

    onFilterClicked() {
        this.openModal.nativeElement.click();
    }

    onFilterCloseClicked($event: MouseEvent) {
        this.filterData = this.localStorageService.getPageFilter(this.section);        
        this.closeModal.nativeElement.click();            
    }

    onFilterElementClicked($event: MouseEvent, section: string, element: Tuple3<string,string,boolean>) {
        let sectionFound = this.filterData.filter(p => p.section == section)[0];
        let extraFound = sectionFound.extra.filter(p => p.param1 == element.param1 && p.param2 == element.param2)[0];
        extraFound.param3 = !extraFound.param3;
    }
    
    onFilterOkClicked($event: MouseEvent) {        
        this.localStorageService.setPageFilter(this.section, this.filterData);
        this.pageReady('filter-ok', true);
        this.closeModal.nativeElement.click();
    }

    onPagerOptionClicked(option: string) {
        let lastPage = Math.ceil(this.pagerDataInfo.param2 / this.pagerSize);        

        switch (option) {
            case "first":
                this.pagerNumber = 1;
                break;
            case "previous":
                if (this.pagerNumber > 1) {
                    this.pagerNumber--;
                }
                break;
            case "next":
                if (this.pagerNumber < lastPage) {
                    this.pagerNumber++;
                }
                break;		
            case "last":
                this.pagerNumber = lastPage;
                break;
        }

        this.pageReady('pager-option', false);
    }

    onPagerSizeClicked($event: MouseEvent, option: number) {        
        this.pagerSize = option;        
        this.localStorageService.setPageSize(this.pagerSize);
        this.pageReady('pager-size', true);
    }
}
