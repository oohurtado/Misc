import { Routes } from '@angular/router';
import { HomeComponent } from './components/section/home/home.component';
import { Formula1StandingsBaseComponent } from './components/section/formula1-standings/formula1-standings-base/formula1-standings-base.component';
import { Formula1StandingsEditorComponent } from './components/section/formula1-standings/formula1-standings-editor/formula1-standings-editor.component';
import { Formula1StandingsDetailsComponent } from './components/section/formula1-standings/formula1-standings-details/formula1-standings-details.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'sections/f1-standings', component: Formula1StandingsBaseComponent},
    { path: 'sections/f1-standings/editor', component: Formula1StandingsEditorComponent},
    { path: 'sections/f1-standings/editor/:type/:year', component: Formula1StandingsEditorComponent},
    { path: 'sections/f1-standings/details/:type/:year', component: Formula1StandingsDetailsComponent},
    // {
    //     path: 'sections/formula1-standings', component: Formula1StandingsComponent, children: [
    //         { path: '', redirectTo: 'list', pathMatch: 'full' },
    //         { path: 'list', component: Formula1StandingsListComponent },
    //     ]
    // },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
