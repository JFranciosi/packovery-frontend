
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse, FilterOrderRequest, SelectOptionsResponse, OrderDetailsResponse } from '../model/models';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private apiUrl = '/order';

    getOrders(offset: number, limit: number): Observable<OrderResponse[]> {
        const params = new HttpParams()
            .set('offset', offset)
            .set('limit', limit);
        return this.http.get<OrderResponse[]>(this.apiUrl, { params });
    }

    getFilteredOrders(filter: FilterOrderRequest, offset: number, limit: number): Observable<OrderResponse[]> {
        const params = new HttpParams()
            .set('offset', offset)
            .set('limit', limit);

        // Backend is now POST. Send filter as body.
        return this.http.post<OrderResponse[]>(`${this.apiUrl}/filter`, filter, { params });
    }

    getOrderById(orderId: string): Observable<OrderDetailsResponse> {
        return this.http.get<OrderDetailsResponse>(`${this.apiUrl}/${orderId}`);
    }

    getSelectOptions(): Observable<SelectOptionsResponse> {
        return this.http.get<SelectOptionsResponse>(`${this.apiUrl}/select-options`);
    }
}
