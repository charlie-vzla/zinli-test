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
import { ButtonsComponent } from './buttons/buttons.component';
import { ChipsComponent } from './chips/chips.component';
import {
    DialogComponent,
    DialogOverviewExampleDialogComponent
} from './dialog/dialog.component';
import { ExpansionComponent } from './expansion/expansion.component';
import { GridComponent } from './grid/grid.component';
import { ListsComponent, UserFormDialog } from './lists/lists.component';
import { MaterialRoutes } from './material.routing';
import { MenuComponent } from './menu/menu.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { ProgressComponent } from './progress/progress.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { SliderComponent } from './slider/slider.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { StepperComponent } from './stepper/stepper.component';
import { TabsComponent } from './tabs/tabs.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TooltipComponent } from './tooltip/tooltip.component';





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
        MatMomentDateModule
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
    entryComponents: [DialogOverviewExampleDialogComponent],
    declarations: [
        ButtonsComponent,
        GridComponent,
        ListsComponent,
        UserFormDialog,
        MenuComponent,
        TabsComponent,
        StepperComponent,
        ExpansionComponent,
        ChipsComponent,
        ToolbarComponent,
        ProgressSnipperComponent,
        ProgressComponent,
        DialogComponent,
        DialogOverviewExampleDialogComponent,
        TooltipComponent,
        SnackbarComponent,
        SliderComponent,
        SlideToggleComponent
    ]
})
export class MaterialComponentsModule {}
