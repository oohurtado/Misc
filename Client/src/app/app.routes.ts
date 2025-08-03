import { Routes } from '@angular/router';
import { HomeComponent } from './components/section/home/home.component';
import { Formula1StandingsBaseComponent } from './components/section/formula1-standings/formula1-standings-base/formula1-standings-base.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'sections/f1-standings', component: Formula1StandingsBaseComponent},
    // {
    //     path: 'sections/formula1-standings', component: Formula1StandingsComponent, children: [
    //         { path: '', redirectTo: 'list', pathMatch: 'full' },
    //         { path: 'list', component: Formula1StandingsListComponent },
    //     ]
    // },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
