import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { routes } from './routes';
import { AppComponent } from './app.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { ModerateComponent } from './moderate/moderate.component';
import { HomeComponent } from './home/home.component';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { UnknownComponent } from './unknown.component';

@NgModule({
    declarations: [AppComponent, ModerateComponent, HomeComponent, TopbarComponent, UnknownComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        AngularFireModule.initializeApp({
            apiKey: 'AIzaSyCIe97GA2C0HDvXs2wbho4b1af_UC1XHhw',
            authDomain: 'facil-2020.firebaseapp.com',
            databaseURL: 'https://facil-2020.firebaseio.com',
            projectId: 'facil-2020',
            storageBucket: 'facil-2020.appspot.com',
            messagingSenderId: '24368076693',
            appId: '1:24368076693:web:7dac26eb079c99817bc89c',
            measurementId: 'G-H75HKSXJCV',
        }),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
