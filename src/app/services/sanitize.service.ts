import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SanitizeService {

   
    sanitize(input: string, maxLength: number = 500): string {
        if (!input || typeof input !== 'string') return input;

        let sanitized = input
            .replace(/<[^>]*>/g, '')
            .replace(/[;'"\\]/g, '')
            .trim();

        return sanitized.substring(0, maxLength);
    }

 
    sanitizeObject<T>(obj: T): T {
        if (!obj || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item)) as unknown as T;
        }

        const sanitizedObj = { ...obj } as any;
        for (const key in sanitizedObj) {
            if (typeof sanitizedObj[key] === 'string') {
                sanitizedObj[key] = this.sanitize(sanitizedObj[key]);
            } else if (typeof sanitizedObj[key] === 'object') {
                sanitizedObj[key] = this.sanitizeObject(sanitizedObj[key]);
            }
        }
        return sanitizedObj as T;
    }
}
