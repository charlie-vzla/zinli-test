import { Injectable } from '@angular/core';

export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    role: string[];
}

const MENUITEMS = [
    { state: 'users', type: 'link', name: 'Users', icon: 'view_list', role: ['0000', '10000'] },
    { state: 'cars', type: 'link', name: 'Cars', icon: 'view_list', role: ['0000', '1000', '2000'] },
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}
