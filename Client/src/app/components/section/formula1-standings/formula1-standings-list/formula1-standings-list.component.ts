import { Component, OnInit } from '@angular/core';
import { ScrapService } from '../../../../services/scrap.service';

@Component({
  selector: 'app-formula1-standings-list',
  standalone: true,
  imports: [],
  templateUrl: './formula1-standings-list.component.html',
  styleUrl: './formula1-standings-list.component.css'
})
export class Formula1StandingsListComponent implements OnInit {
    
    constructor(private scrapService: ScrapService) {
        // Initialization logic can go here if needed
    }

    async ngOnInit() {
        await this.scrapService
        .getFormula1StandingsAsync("drivers", 2025)
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error fetching Formula 1 standings:', error)
        });
    }
}
