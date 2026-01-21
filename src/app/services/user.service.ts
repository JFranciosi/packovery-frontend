import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from '../model/models';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = '/user';

    getUserById(userId: string): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.apiUrl}/${userId}`);
    }
}
