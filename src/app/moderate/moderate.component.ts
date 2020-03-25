import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { tap, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
export interface Person {
    key?: string;
    name: string;
    picture: string;
}
@Component({
    selector: 'app-moderate',
    template: `
        <app-topbar>Facilitate!</app-topbar>
        <div class="main">
            <p>Control the queue</p>
            <button (click)="pop()">Pop</button>
            <button (click)="empty()">Empty</button>
            <div class="queue">
                <ng-container *ngFor="let person of queueData | async">
                    <div class="person">
                        <div style="font-size:2em">{{ person.value.name }}</div>
                        <img [src]="person.value.picture" style="width:200px;" />
                    </div>
                </ng-container>
            </div>
        </div>
    `,
    styles: [],
})
export class ModerateComponent {
    queue: AngularFireList<any>;
    queueData: Observable<any>;
    syncList;

    destroy = new Subject();

    constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {
        this.route.paramMap.pipe(takeUntil(this.destroy)).subscribe(params => {
            this.queue = this.db.list<any>(`queue/${params.get('id')}`);
            this.queueData = this.queue.snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => {
                        const data = a.payload.val() as Person;
                        const key = a.payload.key;
                        const value = { key, value: data };
                        return value;
                    })
                ),
                tap(list => {
                    this.syncList = list;
                    console.log(list);
                })
            );
        });
    }
    ngOnDestroy() {
        this.destroy.next(null);
    }
    empty() {
        this.queue.remove();
    }
    pop() {
        if (this.syncList?.length > 0) {
            this.queue.remove(this.syncList[0].key);
        }
    }
}
