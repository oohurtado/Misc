import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScrapService } from '../../../../services/scrap.service';
import { IPageReady } from '../../../../source/models/paginator.models';
import { LocalStorageService } from '../../../../services/common/local-storage.service';
import { Scr_Formula1StandingResponse } from '../../../../source/models/scrap/formula1-standing.response';
import { ApiResponse } from '../../../../source/models/api.response';
import { DatePipe, JsonPipe } from '@angular/common';
import { Tuple2 } from '../../../../source/models/tuple.models';
// import { PaginatorComponent } from "../../../_shared/paginator/paginator.component";

@Component({
    selector: 'app-formula1-standings-list',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './formula1-standings-list.component.html',
    styleUrl: './formula1-standings-list.component.css'
})
export class Formula1StandingsListComponent implements OnInit, OnChanges {

    @Input() pageReady!: IPageReady;
    @Input() filterSection!: string;
    response!: ApiResponse<Scr_Formula1StandingResponse[]>;
    isProcessing: boolean;

    @Output() evtDataInfoChanged: EventEmitter<Tuple2<number, number>> = new EventEmitter<Tuple2<number, number>>();

    constructor(
      private scrapService: ScrapService,
      private localStorageService: LocalStorageService
    ) {
        // Initialization logic can go here if needed
        this.isProcessing = false;
    }

    async ngOnInit() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        const prev = changes['pageReady'].previousValue;
        const curr = changes['pageReady'].currentValue;

      if (prev !== curr) {
        this.pageReady = Object.assign(<IPageReady>{}, curr);                
        await this.onScrapDataAsync();        
      }
    }

    async onScrapDataAsync() {     
        let term = '';
        let filter = this.localStorageService.getPageFilterForAsString(this.localStorageService.getPageFilter(this.filterSection));        
        
        this.isProcessing = true;        
        await this.scrapService
            .getFormula1StandingsByPageAsync(this.pageReady.orderSelected.value, this.pageReady.orderSelected.isAscending ? 'asc' : 'desc', this.pageReady.pageNumber, this.pageReady.pageSize, term, filter)
            .then(response => {
                this.response = Object.assign(new ApiResponse<Scr_Formula1StandingResponse[]>(), response);                
                this.evtDataInfoChanged.emit(new Tuple2<number, number>(this.response.data.length, this.response.grandTotal));
            })
            .catch(error => {
                console.error('Error fetching data:', error);                
                // Handle the error here
            });
        this.isProcessing = false;
    }
}
