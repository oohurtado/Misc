import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../services/common/system.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule],
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
