import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-forgotpassword',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './forgotpassword.html',
    styleUrls: ['./forgotpassword.css']
})
export class Forgotpassword {

}
