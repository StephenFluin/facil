import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="toolbar">
            <span><ng-content></ng-content></span>
            <div class="user-details">
                <img *ngIf="afAuth.authState | async as state" class="user-img" [src]="state.photoURL" />
                <button *ngIf="afAuth.authState | async as state" (click)="logout()">Logout</button>
            </div>
        </div>
    `,
    styles: [],
})
export class TopbarComponent {
    constructor(private router: Router, public afAuth: AngularFireAuth) {}

    logout() {
      this.afAuth.auth.signOut()
      this.router.navigateByUrl('/');
    }
}
