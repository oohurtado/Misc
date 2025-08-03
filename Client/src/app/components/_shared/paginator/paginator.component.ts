import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent {

    @Output() evtBasic!: EventEmitter<number>;

    constructor() {
        this.evtBasic = new EventEmitter<number>();
    }

    getRandomNumber(): number {
        return Math.floor(Math.random() * 100);
    }

    notify() {
        this.evtBasic.emit(this.getRandomNumber());
    }
}
