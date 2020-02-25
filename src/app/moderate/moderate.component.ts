import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { tap, map } from 'rxjs/operators';
export interface Person {
    key?: string;
    name: string;
    picture: string;
}
@Component({
    selector: 'app-moderate',
    template: `
    <h1>Moderate!</h1>
    <button (click)="pop()">Pop</button>
    <button (click)="empty()">Empty</button>
        <div *ngFor="let item of queueData | async">{{item | json}}</div>
    `,
    styles: [],
})
export class ModerateComponent {
    queue = this.db.list<{}>('queue');
    queueData = this.queue.snapshotChanges().pipe(
        map(actions =>
            actions.map(a => {
                const data = a.payload.val() as Person;
                const key = a.payload.key;
                const value = { key, value: data };
                return value;
            })
        ),
        tap(list => {
          (this.syncList = list);
          console.log(list);
        })
    );
    syncList;

    constructor(private db: AngularFireDatabase) {}
    empty() {
        this.queue.remove();
    }
    pop() {
        this.db.list('queue').remove(this.syncList[0].key);
    }
}
