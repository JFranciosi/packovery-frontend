import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [CommonModule, DatePipe],
    templateUrl: './date-picker.html',
    styleUrls: ['./date-picker.css']
})
export class DatePickerComponent {
    @Input() date: string | null = null;
    @Input() placeholder: string = 'gg/mm/aaaa';
    @Output() dateChange = new EventEmitter<string>();

    isOpen = false;
    currentCalendarDate = new Date();
    calendarDays: { date: Date, isCurrentMonth: boolean, isSelected: boolean, isToday: boolean }[] = [];
    weekDays = ['lu', 'ma', 'me', 'gi', 've', 'sa', 'do'];

    isYearView = false;
    years: number[] = [];

    toggleCalendar(e: Event) {
        e.stopPropagation();
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            if (this.date) {
                this.currentCalendarDate = new Date(this.date);
            } else {
                this.currentCalendarDate = new Date();
            }
            this.generateCalendarDays();
        }
    }

    closeCalendar() {
        this.isOpen = false;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        this.closeCalendar();
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        event.stopPropagation();
    }

    prevMonth(e: Event) {
        e.stopPropagation();
        this.currentCalendarDate = new Date(this.currentCalendarDate.getFullYear(), this.currentCalendarDate.getMonth() - 1, 1);
        this.generateCalendarDays();
    }

    nextMonth(e: Event) {
        e.stopPropagation();
        this.currentCalendarDate = new Date(this.currentCalendarDate.getFullYear(), this.currentCalendarDate.getMonth() + 1, 1);
        this.generateCalendarDays();
    }

    generateCalendarDays() {
        this.calendarDays = [];
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        let startingDayOfWeek = firstDay.getDay() - 1;
        if (startingDayOfWeek === -1) startingDayOfWeek = 6;

        const prevMonthLastDay = new Date(year, month, 0).getDate();

        for (let i = 0; i < startingDayOfWeek; i++) {
            const day = prevMonthLastDay - startingDayOfWeek + 1 + i;
            this.calendarDays.push({
                date: new Date(year, month - 1, day),
                isCurrentMonth: false,
                isSelected: false,
                isToday: false
            });
        }

        const today = new Date();
        const selectedDate = this.date ? new Date(this.date) : null;

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, month, i);
            const isToday = date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

            let isSelected = false;
            if (selectedDate) {
                isSelected = date.getDate() === selectedDate.getDate() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getFullYear() === selectedDate.getFullYear();
            }

            this.calendarDays.push({
                date: date,
                isCurrentMonth: true,
                isSelected: isSelected,
                isToday: isToday
            });
        }

        const remainingDays = 42 - this.calendarDays.length;
        for (let i = 1; i <= remainingDays; i++) {
            this.calendarDays.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
                isSelected: false,
                isToday: false
            });
        }
    }

    selectDate(day: any) {
        const year = day.date.getFullYear();
        const month = String(day.date.getMonth() + 1).padStart(2, '0');
        const d = String(day.date.getDate()).padStart(2, '0');
        const newDate = `${year}-${month}-${d}`;

        this.date = newDate;
        this.dateChange.emit(newDate);
        this.closeCalendar();
    }

    clearDate(e: Event) {
        e.stopPropagation();
        this.date = '';
        this.dateChange.emit('');
        this.closeCalendar();
    }

    setToday() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const newDate = `${year}-${month}-${d}`;

        this.date = newDate;
        this.dateChange.emit(newDate);
        this.closeCalendar();
    }

    generateYears() {
        const currentYear = new Date().getFullYear();
        this.years = [];
        for (let i = currentYear - 100; i <= currentYear + 20; i++) {
            this.years.push(i);
        }
    }

    toggleYearView(e: Event) {
        e.stopPropagation();
        this.isYearView = !this.isYearView;
        if (this.isYearView) {
            if (this.years.length === 0) {
                this.generateYears();
            }
        }
    }

    selectYear(year: number, e: Event) {
        e.stopPropagation();
        this.currentCalendarDate = new Date(year, this.currentCalendarDate.getMonth(), 1);
        this.isYearView = false;
        this.generateCalendarDays();
    }
}
