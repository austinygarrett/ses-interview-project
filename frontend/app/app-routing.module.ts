import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard';
import { LoginComponent, RegisterComponent } from './account';
import { AuthGuard } from './_helpers';

const earthquakesModule = () => import('./earthquakes/earthquakes.module').then(x => x.EarthquakeModule);

const routes: Routes = [
    { path: 'app', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'earthquakes', loadChildren: earthquakesModule, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: 'app' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }