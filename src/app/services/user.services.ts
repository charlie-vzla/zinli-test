/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment as env  } from '../../environments/environment'

interface Response {
    data?: any;
    message: string;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    user: BehaviorSubject<any>;

    constructor(
        private http: HttpClient,
    ) {
        this.user = new BehaviorSubject<any>(null);

        const user = localStorage.getItem('user') || '';
        try {
            this.user.next(JSON.parse(user));
        } catch (error) {
            console.log('UserService', error);
        }
    }

    login(email: string): Observable<Response> {
        return this.http.post<Response>(`${env.api}/users/login`, { email });
    }

    logout() {
        this.user.next(null);
        localStorage.removeItem('token');
    }

    create(user: any): Observable<Response> {
        return this.http.post<Response>(`${env.api}/users`, user);
    }

    list(): Observable<Response> {
        return this.http.get<Response>(`${env.api}/users`);
    }

    edit(user: any): Observable<Response> {
        return this.http.put<Response>(`${env.api}/users`, user);
    }

    delete(email: string): Observable<Response> {
        return this.http.delete<Response>(`${env.api}/users/${email}`);
    }

    deleteAll(): Observable<Response> {
        return this.http.delete<Response>(`${env.api}/users/all`);
    }
}
