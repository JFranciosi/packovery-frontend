import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.html',
    styleUrls: ['./chat.css']
})
export class Chat implements OnInit {
    @Input() orderId!: string;
    @Input() riderName!: string;
    @Input() riderSurname!: string;
    @Input() isOpen = false;

    @Output() close = new EventEmitter<void>();

    newMessage = '';
    messages: { text: string, sender: 'user' | 'rider', time: string }[] = [];

    ngOnInit() {
        if (this.messages.length === 0) {
            this.messages = [
                { text: 'Ciao, a che ora è prevista la consegna?', sender: 'user', time: '14:05' },
                { text: `Ciao! Arriverò verso le 14:30.`, sender: 'rider', time: '14:06' }
            ];
        }
    }

    closeChat() {
        this.close.emit();
    }

    sendMessage() {
        if (!this.newMessage.trim()) return;

        this.messages.push({
            text: this.newMessage,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        const userMsg = this.newMessage;
        this.newMessage = '';

        setTimeout(() => {
            this.messages.push({
                text: `Ricevuto: "${userMsg}". Sto arrivando!`,
                sender: 'rider',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }, 2000);
    }
}
