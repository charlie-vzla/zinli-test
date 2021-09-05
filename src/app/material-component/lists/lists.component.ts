import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import * as moment from 'moment';

export interface UserData {
    id: string;
    email: string;
    name: string;
    lastname: string;
    cellphone: string;
    address: string;
    birthdate: string;
    role: number;
}

const NAMES: string[] = [
    'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
    'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-lists',
    styleUrls: ['lists.component.scss'],
    templateUrl: 'lists.component.html',
})
export class ListsComponent implements AfterViewInit {
    displayedColumns: string[] = ['email', 'name', 'lastname', 'cellphone', 'address', 'birthdate', 'role', 'action'];
    dataSource: MatTableDataSource<UserData>;

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
    @ViewChild(MatSort)
    sort!: MatSort;

    constructor(public dialog: MatDialog) {
        // Create 100 users
        const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(users);
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    add(): void {
        const dialogRef = this.dialog.open(UserFormDialog, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('user form closed!', result);
        });
    }

    edit(user: UserData): void {
        const dialogRef = this.dialog.open(UserFormDialog, {
            data: user,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('user form closed!', result);
        });
    }

    delete(user: UserData): void {
        console.log(user);
    }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    const roles = [1000, 2000];

    return {
        id: id.toString(),
        email: 'pagos@zinli.com',
        name: name,
        lastname: name,
        cellphone: '+584141234567',
        address: 'Zinli',
        birthdate: moment().format('YYYY-MM-DD'),
        role: roles[Math.floor(Math.random() * (1 + 1))],
    };
}

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form-dialog.html',
})
export class UserFormDialog {
    email: FormControl;
    name: FormControl;
    lastname: FormControl;
    cellphone: FormControl;
    address: FormControl;
    birthdate: FormControl;
    role: FormControl;

    constructor(
        public dialogRef: MatDialogRef<UserFormDialog>,
        @Inject(MAT_DIALOG_DATA) public data: UserData
    ) {
        this.email = new FormControl(this.data.email, [
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(150),
        ]);

        this.name = new FormControl(this.data.name, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
        ]);

        this.lastname = new FormControl(this.data.lastname, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
        ]);

        this.cellphone = new FormControl(this.data.cellphone, [
            Validators.pattern(/^((\d{3,4}-\d{4})|(\+\d{3}\s\d{3,4}-\d{4}))$/),
        ]);

        this.address = new FormControl(this.data.address, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
        ]);

        let date = ''
        if (this.data.birthdate) {
            date = moment(this.data.birthdate).format('YYYY-MM-DD');
        }
        this.birthdate = new FormControl(date, [Validators.required]);

        this.role = new FormControl(`${this.data.role}`, [Validators.required]);
    }

    getErrorMessage(control: string): string {
        let error = '';
        switch (control) {
            case 'email': {
                const errors = this.email.errors || {};

                if (errors.required) {
                    error = 'You must enter a value';
                } else if (errors.email) {
                    error = 'Not a valid email';
                } else if (errors.minlength) {
                    error = 'Invalid length, min 4';
                } else if (errors.maxlength) {
                    error = 'Invalid length, max 150';
                }

                break;
            }
            case 'name': {
                const errors = this.name.errors || {};

                if (errors.required) {
                    error = 'You must enter a value';
                } else if (errors.minlength) {
                    error = 'Invalid length, min 3';
                } else if (errors.maxlength) {
                    error = 'Invalid length, max 100';
                }

                break;
            }
            case 'lastname': {
                const errors = this.lastname.errors || {};

                if (errors.required) {
                    error = 'You must enter a value';
                } else if (errors.minlength) {
                    error = 'Invalid length, min 3';
                } else if (errors.maxlength) {
                    error = 'Invalid length, max 100';
                }

                break;
            }
            case 'cellphone': {
                const errors = this.cellphone.errors || {};

                if (errors.required) {
                    error = 'You must enter a value';
                } else if (errors.pattern) {
                    error = 'Invalid format';
                }

                break;
            }
            case 'address': {
                const errors = this.address.errors || {};

                if (errors.required) {
                    error = 'You must enter a value';
                } else if (errors.minlength) {
                    error = 'Invalid length, min 3';
                } else if (errors.maxlength) {
                    error = 'Invalid length, max 250';
                }

                break;
            }
            case 'birthdate': {
                const errors = this.birthdate.errors || {};
                if (errors.required) {
                    error = 'You must enter a value';
                }

                break;
            }
            case 'role': {
                const errors = this.role.errors || {};
                if (errors.required) {
                    error = 'You must enter a value';
                }
                break;
            }
            default:
                error = '';
        }

        return error;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
