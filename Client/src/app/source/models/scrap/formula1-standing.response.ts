import { publishFacade } from "@angular/compiler";

    export class Scr_Formula1StandingResponse {
    constructor(
        public id: number,
        public type: string,
        public year: number,
        public eventAt: Date
    ) { }
}