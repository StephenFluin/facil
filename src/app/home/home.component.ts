import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { tap, map } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    template: `
        <ng-container *ngIf="user$ | async as user; else login">
            <app-topbar>
                Facil
            </app-topbar>
            <div class="main">
                <p>Manage your place in the queue</p>
                <button *ngIf="!queueKey" (click)="add()">Add Me</button>
                <button *ngIf="queueKey" (click)="remove()">Remove Me</button>
                <h2 style="margin-top:32px;">The Queue</h2>
                <div class="queue">
                    <div *ngFor="let person of queueRead | async">
                        <div class="person">
                            <div style="font-size:2em">{{ person.name }}</div>
                            <img [src]="person.picture" />
                        </div>
                    </div>
                </div>
            </div>
        </ng-container>
        <ng-template #login>
            <div class="main">
                <h2>Sign in to use Facil!</h2>
                <p>The easy facilitation tool</p>
                <button (click)="loginTwitter()">Twitter Sign-In</button>
                <button (click)="loginGoogle()">Google Sign-In</button>
            </div>
        </ng-template>
    `,
})
export class HomeComponent {
    user$ = this.afAuth.authState.pipe(
        tap(state => {
            this.syncUser = state;
        })
    );
    queue = this.db.list<any>('queue');
    queueRead = this.queue.valueChanges().pipe(
        tap(list => {
            console.log('list includes', list);
            if (list?.length <= 0) {
                this.queueKey = null;
            }
        })
    );
    syncUser: firebase.User;
    queueKey: string;

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        window['empty'] = () => this.empty();
    }
    loginGoogle() {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    loginTwitter() {
        this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
    logout() {
        console.log('signing out');
        this.afAuth.auth.signOut();
    }

    add() {
        this.queue.push({ name: this.syncUser.displayName, picture: this.syncUser.photoURL }).then(result => {
            console.log('queued', result.key);
            this.queueKey = result.key;
        });
    }

    remove() {
        this.queue.remove(this.queueKey);
        this.queueKey = null;
    }
    empty() {
        this.db.object('queue').remove();
    }
}
