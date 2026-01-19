import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { Comune } from '../model/models';

@Injectable({
    providedIn: 'root'
})
export class LocationsService {
    private http = inject(HttpClient);
    private jsonUrl = '/gi_comuni.json';

    // Cache the data to avoid multiple requests
    private comuniCache$: Observable<Comune[]> | null = null;

    getAllComuni(): Observable<Comune[]> {
        if (!this.comuniCache$) {
            this.comuniCache$ = this.http.get<any[]>(this.jsonUrl).pipe(
                map(data => data.map(item => ({
                    nome: item.denominazione_ita,
                    sigla: item.sigla_provincia,
                    codice: item.codice_istat,
                    provincia: { nome: '', codice: '' }, // Placeholder if needed
                    cap: [],
                    zona: { nome: '', codice: '' },
                    regione: { nome: '', codice: '' },
                    codiceCatastale: item.codice_belfiore,
                    popolazione: 0
                }))),
                shareReplay(1)
            );
        }
        return this.comuniCache$;
    }

    // Helper to search (filters local data after fetching)
    searchComuni(term: string): Observable<Comune[]> {
        if (!term || term.length < 2) return of([]);
        const lowerTerm = term.toLowerCase();

        return this.getAllComuni().pipe(
            map(comuni => comuni.filter(c =>
                c.nome.toLowerCase().includes(lowerTerm)
            ).slice(0, 20))
        );
    }
}
