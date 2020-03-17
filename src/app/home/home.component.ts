import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { tap, map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Person } from '../moderate/moderate.component';

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
                            <div style="font-size:2em">{{ person.value.name }}</div>
                            <img [src]="person.value.picture" />
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
export class HomeComponent implements OnDestroy {
    user$ = this.afAuth.authState.pipe(
        tap(state => {
            this.syncUser = state;
        })
    );
    queue: AngularFireList<any>;
    queueRead: Observable<any>;

    syncUser: firebase.User;
    queueKey: string;
    destroy = new Subject();

    constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        this.route.paramMap.pipe(takeUntil(this.destroy)).subscribe(params => {
            this.queue = this.db.list<any>(`queue/${params.get('id')}`);
            this.queueRead = this.queue.snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => {
                        const data = a.payload.val() as Person;
                        const key = a.payload.key;
                        const value = { key, value: data };
                        return value;
                    })
                ),
                tap(list => {
                    this.queueKey = null;
                    for (const item of list) {
                        if (item.value.picture === this.syncUser.photoURL) {
                          this.queueKey = item.key;
                        }
                    }
                    console.log(list, this.queueKey);
                })
            );
        });
    }
    ngOnDestroy() {
        this.destroy.next(null);
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
