import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizeService } from '../../services/sanitize.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chat.html',
    styleUrls: ['./chat.css']
})
export class Chat implements OnInit {
    private sanitizeService = inject(SanitizeService);
    @Input() orderId!: string;
    @Input() riderName!: string;
    @Input() riderSurname!: string;
    @Input() isOpen = false;

    @Output() close = new EventEmitter<void>();

    newMessage = '';
    messages: { text: string, sender: 'user' | 'rider', time: string }[] = [];

    ngOnInit() {
        // La chat inizia vuota
        this.messages = [];
    }

    closeChat() {
        this.close.emit();
    }

    onInputChange(event: any) {
        this.newMessage = event.target.value;
    }

    sendMessage(val?: string) {
        const sanitizedText = this.sanitizeService.sanitize(this.newMessage);
        if (!sanitizedText) return;

        this.messages.push({
            text: sanitizedText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        this.newMessage = '';
    }
}
