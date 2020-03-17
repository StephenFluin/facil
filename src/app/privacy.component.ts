import { Component } from '@angular/core';

@Component({
    selector: 'app-privacy',
    template: `
        <p>
            The facilitation app stores your auth ID when you sign in, and we store your name and photo URL. To remove
            yourself, remove yourself from any queues you may have joined.
        </p>
    `,
})
export class PrivacyComponent {
    constructor() {}
}
