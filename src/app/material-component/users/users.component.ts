import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as moment from 'moment';
import { UsersService } from 'src/app/services/user.services';

export interface UserData {
    id: string;
    email: string;
    name: string;
    lastname: string;
    cellphone: string;
    address: string;
    birthdate: string;
    role: string;
    roleName ?: string;
    valid ?: boolean;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-lists',
    styleUrls: ['users.component.scss'],
    templateUrl: 'users.component.html',
})
export class UsersComponent implements AfterViewInit {
    loading: boolean;

    displayedColumns: string[] = ['email', 'name', 'lastname', 'cellphone', 'address', 'birthdate', 'role', 'action'];
    dataSource: MatTableDataSource<UserData>;

    total: number;

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
    @ViewChild(MatSort)
    sort!: MatSort;

    constructor(
        public dialog: MatDialog,
        private user: UsersService,
        private snackBar: MatSnackBar,
    ) {
        this.total = 0;
        this.loading = true;

        this.user.list().subscribe((result) => {
            this.total = result.data.total;

            const { users } = result.data;
            users.forEach((user: UserData) => {
                user.roleName = user.role === '1000' ? 'Admin' : 'Sucursal';
            })

            this.dataSource = new MatTableDataSource(users);
            this.loading = false;
        }, (error) => {
            console.error(error);
            this.loading = false;
        });

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource();
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

        dialogRef.afterClosed().subscribe((user) => {
            if (!user || !user.email) return;

            this.loading = true;
            this.user.create(user).subscribe((result) => {
                const { data } = this.dataSource;
                data.push(result.data);

                this.dataSource.data = data;
                this.loading = false;
                this.snackBar.open(result.message, 'close', this.successClass);
            }, (error) => {
                this.snackBar.open(error, 'close', this.errorClass);
                this.loading = false;
            });
        });
    }

    edit(user: UserData): void {
        const dialogRef = this.dialog.open(UserFormDialog, {
            data: user,
        });

        dialogRef.afterClosed().subscribe((user) => {
            if (!user || !user.email) return;

            this.loading = true;
            this.user.edit(user).subscribe((result) => {
                const { data } = this.dataSource;

                const index = data.findIndex((u) => u.email === user.email);
                data[index] = result.data;

                this.dataSource.data = data;
                this.loading = false;
            }, (error) => {
                this.snackBar.open(error, 'close', this.errorClass);
                this.loading = false;
            });
        });
    }

    delete(user: UserData): void {
        this.loading = true;
        this.user.delete(user.email).subscribe((result) => {
            --this.total;

            const { data } = this.dataSource;

            const index = data.findIndex((u) => u.email === user.email);
            data.splice(index, 1);

            this.dataSource.data = data;
            this.loading = false;

            this.snackBar.open(result.message, 'close', this.successClass);
        }, (error) => {
            this.snackBar.open(error, 'close', this.errorClass);
            this.loading = false;
        });
    }

    deleteAll(): void {
        this.loading = true;

        this.user.deleteAll().subscribe((result) => {
            this.total = 0;
            this.dataSource.data = [];

            this.snackBar.open(result.message, 'close', this.successClass);
            this.loading = false;
        }, (error) => {
            this.snackBar.open(error, 'close', this.errorClass);
            this.loading = false;
        });
    }

    private successClass: MatSnackBarConfig = {
        panelClass: ['style-success'],
        duration: 5000,
    };

    private errorClass: MatSnackBarConfig = {
        panelClass: ['style-error'],
        duration: 5000,
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

    form: FormGroup;

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

        this.role = new FormControl(`${this.data.role || ''}`, [Validators.required]);

        this.form = new FormGroup({
            email: this.email,
            name: this.name,
            lastname: this.lastname,
            cellphone: this.cellphone,
            address: this.address,
            birthdate: this.birthdate,
            role: this.role
        })
    }

    submit(): void {
        if (!this.form.valid) return;

        const { value } = this.form;
        value.birthdate = moment(value.birthdate).format('YYYY-MM-DD');

        this.dialogRef.close(this.form.value);
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
