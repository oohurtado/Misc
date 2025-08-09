import { JsonPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-the-messanger',
    standalone: true,
    imports: [JsonPipe],
    templateUrl: './the-messanger.component.html',
    styleUrl: './the-messanger.component.css'
})
export class TheMessangerComponent {

    @Input() columns: string[] = [];
    @Input() data: string[][] = [];       
}
