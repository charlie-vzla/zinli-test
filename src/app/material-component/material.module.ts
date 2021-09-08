import { CarsComponent, CarFormDialog, CarStatusFormDialog } from './cars/cars.component';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import 'hammerjs';
import { DemoMaterialModule } from '../demo-material-module';
import { MaterialRoutes } from './material.routing';
import { UserFormDialog, UsersComponent } from './users/users.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';





@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MaterialRoutes),
        DemoMaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        CdkTableModule,
        MatDatepickerModule,
        MatMomentDateModule,
        SweetAlert2Module
    ],
    providers: [
        {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: ['l', 'LL'],
                },
                display: {
                    dateInput: 'YYYY-MM-DD',
                    monthYearLabel: 'MMM YYYY',
                    dateA11yLabel: 'LL',
                    monthYearA11yLabel: 'MMMM YYYY',
                },
            },
        },
    ],
    declarations: [
        UsersComponent,
        UserFormDialog,
        CarsComponent,
        CarFormDialog,
        CarStatusFormDialog,
    ]
})
export class MaterialComponentsModule {}
