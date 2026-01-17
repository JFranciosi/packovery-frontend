import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-confirmation-code',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './confirmation-code.html',
    styleUrls: ['./confirmation-code.css']
})
export class ConfirmationCode {

}
