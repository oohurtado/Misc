import { JsonPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-the-messanger',
    standalone: true,
    imports: [JsonPipe],
    templateUrl: './the-messanger.component.html',
    styleUrl: './the-messanger.component.css'
})
export class TheMessangerComponent implements OnChanges {

    @Input() columns: string[] = [];
    @Input() data: string[][] = [];    

    ngOnChanges(changes: SimpleChanges): void {
        const prevData = changes['data'].previousValue;
        const currData = changes['data'].currentValue;

        if (prevData !== currData) {
            // this.pageReady = Object.assign(<IPageReady>{}, curr);
            // await this.getScrapDataAsync();
        }
    }
}
