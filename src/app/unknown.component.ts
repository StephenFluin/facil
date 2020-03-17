import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unknown',
    template: `
        <app-topbar>
                Facil
            </app-topbar>
            <div class="main">
        <p>Pick a room:</p>
        <form (submit)="submit(room.value)"><input #room /><button type="submit">Join</button></form>
        </div>
    `,
    styles: [],
})
export class UnknownComponent {
    constructor(private router: Router) {}

    submit(room: string) {
        this.router.navigateByUrl(`/${room}`);
    }
}
