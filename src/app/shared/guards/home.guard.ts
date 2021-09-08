import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class HomeGuard implements CanActivate {
    canActivate(): boolean {
        // your  logic goes here
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!user || !token) return false;

        return true;
    }
}