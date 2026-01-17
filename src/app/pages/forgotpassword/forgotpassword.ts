import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-forgotpassword',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './forgotpassword.html',
    styleUrls: ['./forgotpassword.css']
})
export class Forgotpassword {
    constructor(private router: Router) { }

    onSubmit() {
        this.router.navigate(['/confirmation-code']);
    }
}
