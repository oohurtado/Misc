import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SystemService } from '../../../services/common/system.service';

@Component({
    selector: 'app-sections',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './sections.component.html',
    styleUrl: './sections.component.css'
})
export class SectionsComponent {    
}
