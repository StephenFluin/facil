import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
   <div *ngIf="user$ | async as user; else login">
    <div>
        Welcome {{ user.displayName }}
        <img [src]="user.photoURL" style="width:100px;" />
    </div>

    <button *ngIf="!queueKey" (click)="add()">Add Me</button>
    <button *ngIf="queueKey" (click)="remove()">Remove Me</button>
    <h2>The Queue</h2>
    <div *ngFor="let person of queueRead | async">
        <div class="person">
            <div style="font-size:2em">{{ person.name }}</div>
            <img [src]="person.picture" style="width:200px;"/>
        </div>
    </div>

    <div style="margin-top:200px;">
        <button (click)="logout()">Logout</button>
    </div>
</div>
<ng-template #login>
    <h2>Sign in!</h2>
    <button (click)="loginTwitter()">Twitter</button>
    <button (click)="loginGoogle()">Google</button>
</ng-template>
  `,
})
export class HomeComponent  {
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
