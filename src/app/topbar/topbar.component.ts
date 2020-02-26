import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="toolbar">
            <span><ng-content></ng-content></span>
            <div class="user-details">
                <img *ngIf="afAuth.authState | async as state" class="user-img" [src]="state.photoURL" />
                <button (click)="afAuth.auth.signOut()">Logout</button>
            </div>
        </div>
    `,
    styles: [],
})
export class TopbarComponent implements OnInit {
    constructor(public afAuth: AngularFireAuth) {}

    ngOnInit(): void {}
}
