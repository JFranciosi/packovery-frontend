import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportResponse } from '../model/models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/report`;

    getReports(): Observable<ReportResponse[]> {
        return this.http.get<ReportResponse[]>(this.apiUrl);
    }

    getReportById(reportId: number): Observable<ReportResponse> {
        return this.http.get<ReportResponse>(`${this.apiUrl}/${reportId}`);
    }

    resolveReport(reportId: number, resolution: string, description: string = 'Risolto manualmente'): Observable<ReportResponse> {
        return this.http.put<ReportResponse>(`${this.apiUrl}/${reportId}/resolve`, {
            issueResolution: resolution,
            resolutionDescription: description
        });
    }

    getSelectOptions(): Observable<import('../model/models').SelectOptionsResponse> {
        return this.http.get<import('../model/models').SelectOptionsResponse>(`${this.apiUrl}/select-options`);
    }
}
