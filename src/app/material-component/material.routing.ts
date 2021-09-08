import { CarsComponent } from './cars/cars.component';
import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { HomeGuard } from '../shared/guards/home.guard';


export const MaterialRoutes: Routes = [
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [HomeGuard]
    },
    {
        path: 'cars',
        component: CarsComponent,
        canActivate: [HomeGuard]
    },
];
