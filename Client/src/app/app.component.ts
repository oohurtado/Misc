import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemService } from './services/common/system.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    title = 'Client';

    constructor(private systemService: SystemService) {
        // Initialization logic can go here if needed
    }

    async ngOnInit() {
        await this.getPingAsync();
    }

    async getPingAsync() {
        await this.systemService.getPingAsync()
            .then(response => {
                console.log('Ping response:', response);
            })
            .catch(error => {
                console.error('Error fetching ping:', error);
            });
    }
}
