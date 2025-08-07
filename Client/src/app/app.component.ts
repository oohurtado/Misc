import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/_shared/navbar/navbar.component";
import { SharedService } from './services/common/shared.service';
import { Utils } from './source/helpers/utils.helper';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Client';

    loading: boolean = false;

    constructor(
        private sharedService: SharedService,
        private cdRef: ChangeDetectorRef
    ) {
        this.sharedService.evtLoading.subscribe(p => {            
            this.loading = p;
            this.cdRef.detectChanges();
        });
    }
}
