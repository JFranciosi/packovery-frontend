import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    private authService = inject(AuthService);
    private router = inject(Router);

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    closeSidebar() {
        this.close.emit();
    }
}
