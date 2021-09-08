import { Router } from '@angular/router';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { UsersService } from "./user.services";

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
    // private message: string;

    constructor(
        private user: UsersService,
        private router: Router,
    ) {}

    intercept( req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        const header = req.clone({
            headers: new HttpHeaders({
                'Accept-Language':  'en-US',
                'Authorization': 'Bearer ' + token
            })
        });

        return next.handle(header).pipe(
            catchError(this.handlerError.bind(this))
        );
    }

    handlerError(error: Response | any): Observable<never> {
        // let message: string = '';

        /* if (error.error instanceof ErrorEvent) {
            message = error.error.message;
        } else {
            if ( error.status === 401 ) {
                this.observableLogoutService.closeSession(true);
            }
        } */

        if (error.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            this.user.user.next(null);

            this.router.navigate(['/']);
        }

        const message = error.error.message || error.message;
        return throwError(message);
    }
}