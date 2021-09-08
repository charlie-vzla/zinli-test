/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

interface Response {
    data?: any;
    message: string;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CarsService {
    constructor(
        private http: HttpClient,
    ) {}

    create(car: any): Observable<Response> {
        return this.http.post<Response>(`${env.api}/vehicles`, car);
    }

    list(): Observable<Response> {
        return this.http.get<Response>(`${env.api}/vehicles`);
    }

    edit(car: any): Observable<Response> {
        return this.http.put<Response>(`${env.api}/vehicles`, car);
    }

    editAll(status: string): Observable<Response> {
        return this.http.put<Response>(`${env.api}/vehicles/all`, status);
    }

    delete(client: string, plates: string): Observable<Response> {
        return this.http.delete<Response>(`${env.api}/vehicles/${client}/${plates}`);
    }

    delteAll(): Observable<Response> {
        return this.http.delete<Response>(`${env.api}/vehicles/all`);
    }
}
