import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModerateComponent } from './moderate/moderate.component';
import { UnknownComponent } from './unknown.component';
import { PrivacyComponent } from './privacy.component';

export const routes: Routes = [
    { path: '', component: UnknownComponent},
    { path: 'privacy', component: PrivacyComponent },
    { path: ':id', component: HomeComponent },
    { path: ':id/m', component: ModerateComponent },
];
