import { Routes } from '@angular/router';
import { SectionsComponent } from './components/_shared/sections/sections.component';
import { Formula1StandingsComponent } from './components/section/formula1-standings/formula1-standings.component';
import { Formula1StandingsListComponent } from './components/section/formula1-standings/formula1-standings-list/formula1-standings-list.component';
import { HomeComponent } from './components/section/home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    {
        path: 'sections/formula1-standings', component: Formula1StandingsComponent, children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: Formula1StandingsListComponent },
        ]
    },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
