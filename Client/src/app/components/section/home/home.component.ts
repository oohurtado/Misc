import { Component, OnInit } from '@angular/core';
import { SectionsComponent } from "../../_shared/sections/sections.component";
import { SystemService } from '../../../services/common/system.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [SectionsComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

    pingResponse: string = '...';
    
    constructor(private systemService: SystemService) {
        // Initialization logic can go here if needed
    }

    async ngOnInit() {
        await this.getPingAsync();
    }

    async getPingAsync() {
        await this.systemService.getPingAsync()
            .then(response => {
                this.pingResponse = response.data;
            })
            .catch(error => {
                this.pingResponse = 'Error fetching ping';
            });
    }

}
