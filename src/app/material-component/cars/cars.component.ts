/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as moment from 'moment';
import { CarsService } from 'src/app/services/cars.services';

export interface CarData {
    index?: number;
    client: string;
    cellphone: string;
    plates: string;
    rentFrom: string;
    rentTo: string;
    status ?: string;
    user: string;
    fecCre: string;
    fecMod ?: string;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-cars',
    styleUrls: ['cars.component.scss'],
    templateUrl: 'cars.component.html',
})
export class CarsComponent implements AfterViewInit {
    loading: boolean;

    displayedColumns: string[] = ['client', 'cellphone', 'plates', 'rentFrom', 'rentTo', 'status', 'user', 'fecCre', 'fecMod', 'action'];
    dataSource: MatTableDataSource<CarData>;

    total: number;

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
    @ViewChild(MatSort)
    sort!: MatSort;

    @ViewChild('deleteAllSwal')
    deleteSwal!: SwalComponent;

    constructor(
        public dialog: MatDialog,
        private car: CarsService,
        private snackBar: MatSnackBar,
    ) {
        this.total = 0;
        this.loading = true;

        this.car.list().subscribe((result) => {
            this.total = result.data.total;

            const { vehicles } = result.data;

            let count = 0;
            vehicles.forEach((vehicle: CarData) => {
                vehicle.index = count++;
            });

            this.dataSource = new MatTableDataSource(vehicles);
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
        const dialogRef = this.dialog.open(CarFormDialog, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((car) => {
            if (!car || !car.plates) return;

            this.loading = true;

            this.car.create(car).subscribe((result) => {
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

    edit(car: CarData): void {
        const dialogRef = this.dialog.open(CarFormDialog, {
            data: car,
        });

        car.index

        dialogRef.afterClosed().subscribe((vehicle) => {
            if (!vehicle || !vehicle.plates) return;

            this.loading = true;
            this.car.edit(vehicle).subscribe((result) => {
                const { data } = this.dataSource;

                const index = car.index || 0;
                data[index] = result.data;

                this.dataSource.data = data;
                this.loading = false;
                this.snackBar.open(result.message, 'close', this.successClass);
            }, (error) => {
                console.log(error)
                this.snackBar.open(error, 'close', this.errorClass);
                this.loading = false;
            });
        });
    }

    editAll(): void {
        const dialogRef = this.dialog.open(CarStatusFormDialog, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((status) => {
            if (!status) return;

            this.loading = true;
            this.car.editAll(status).subscribe((result) => {
                const { vehicles } = result.data;

                let count = 0;
                vehicles.forEach((vehicle: CarData) => {
                    vehicle.index = count++;
                });

                this.dataSource = new MatTableDataSource(vehicles);
                this.loading = false;
                this.snackBar.open(result.message, 'close', this.successClass);
            }, (error) => {
                this.snackBar.open(error, 'close', this.errorClass);
                this.loading = false;
            });
        });
    }

    delete(car: CarData): void {
        this.loading = true;

        this.car.delete(car.client, car.plates).subscribe((result) => {
            --this.total;

            const { data } = this.dataSource;

            const index = car.index || 0;
            data.splice(index, 1);

            this.dataSource.data = data;
            this.snackBar.open(result.message, 'close', this.successClass);
        }, (error) => {
            this.snackBar.open(error, 'close', this.errorClass);
            this.loading = false;
        });
    }

    deleteAllAlert(): void {
        this.deleteSwal.fire();
    }

    deleteAll(): void {
        this.loading = true;

        this.car.delteAll().subscribe(() => {
            this.loading = false;
            this.dataSource.data = [];
            this.total = 0;
        }, (error) => {
            this.snackBar.open(error, 'close', this.errorClass);
            this.loading = false;
        })
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
    templateUrl: './car-form-dialog.html',
})
export class CarFormDialog {
    client: FormControl;
    cellphone: FormControl;
    plates: FormControl;
    rentFrom: FormControl;
    rentTo: FormControl;
    status: FormControl;

    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CarFormDialog>,
        @Inject(MAT_DIALOG_DATA) public data: CarData
    ) {
        this.client = new FormControl(this.data.client, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
        ]);

        this.cellphone = new FormControl(this.data.cellphone, [
            Validators.pattern(/^((\d{3,4}-\d{4})|(\+\d{3}\s\d{3,4}-\d{4}))$/),
        ]);

        this.plates = new FormControl(this.data.plates, [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
            Validators.pattern(/^[\d\w]{4,8}$/)
        ]);

        let dateFrom = ''
        if (this.data.rentFrom) {
            dateFrom = moment(this.data.rentFrom).format('YYYY-MM-DD');
        }
        this.rentFrom = new FormControl(dateFrom, [Validators.required]);

        let dateTo = ''
        if (this.data.rentTo) {
            dateTo = moment(this.data.rentTo).format('YYYY-MM-DD');
        }
        this.rentTo = new FormControl(dateTo, [Validators.required]);

        const controls: any = {
            client: this.client,
            cellphone: this.cellphone,
            plates: this.plates,
            rentFrom: this.rentFrom,
            rentTo: this.rentTo,
        }

        this.status = new FormControl(`${this.data.status || ''}`, [Validators.required]);
        if (data.status) {
            controls.status = this.status;
        }

        this.form = new FormGroup(controls);
    }

    submit(): void {
        if (!this.form.valid) return;

        const { value } = this.form;
        value.rentFrom = moment(value.rentFrom).format('YYYY-MM-DD');
        value.rentTo = moment(value.rentTo).format('YYYY-MM-DD');

        this.dialogRef.close(this.form.value);
    }

    getErrorMessage(control: string): string {
        let error = '';
        switch (control) {
            case 'client': {
                const errors = this.client.errors || {};

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
            case 'cellphone': {
                const errors = this.cellphone.errors || {};

                if (errors.required) {
                    error = 'You must enter a value';
                } else if (errors.pattern) {
                    error = 'Invalid format';
                }

                break;
            }
            case 'plates': {
                const errors = this.plates.errors || {};

                if (errors.required) {
                    error = 'You must enter a value';
                } else if (errors.pattern) {
                    error = 'Invalid format';
                }

                break;
            }
            case 'rentFrom': {
                const errors = this.rentFrom.errors || {};
                if (errors.required) {
                    error = 'You must enter a value';
                }

                break;
            }
            case 'rentTo': {
                const errors = this.rentTo.errors || {};
                if (errors.required) {
                    error = 'You must enter a value';
                }

                break;
            }
            case 'status': {
                const errors = this.status.errors || {};

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

@Component({
    selector: 'app-user-form',
    templateUrl: './car-status-dialog.html',
})
export class CarStatusFormDialog {
    status: FormControl;

    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CarStatusFormDialog>,
    ) {
        this.status = new FormControl('', [Validators.required]);

        this.form = new FormGroup({ status: this.status});
    }

    submit(): void {
        if (!this.form.valid) return;

        this.dialogRef.close(this.form.value);
    }

    getErrorMessage(): string {
        let error = '';
        const errors = this.status.errors || {};

        if (errors.required) {
            error = 'You must enter a value';
        }

        return error;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
