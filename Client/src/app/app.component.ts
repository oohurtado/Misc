import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemService } from './services/common/system.service';
import { SectionsComponent } from "./components/_shared/sections/sections.component";
import { NavbarComponent } from "./components/_shared/navbar/navbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Client';
}
