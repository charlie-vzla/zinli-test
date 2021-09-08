import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/user.services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: []
})
export class AppHeaderComponent implements OnInit {
    /**
     * Indica si el usuario esta logeado
     */
    logged: boolean;

    constructor(
        private dialog: MatDialog,
        // private userService: UserService,
        private cd: ChangeDetectorRef,
        private user: UsersService
    ) {
        this.logged = false;
    }

    ngOnInit(): void {
        this.user.user.subscribe((user) => {
            console.log(user);
            if (user && user.valid) {
                this.logged = true;
            } else if (!user || (user && !user.valid)) {
                this.logged = false;
            }
        });
    }

    /**
     * Lets the user close its session.
     *
     * TODO do it with google-plugin
     */
    closeSession(): void {
        this.user.logout();
    }
    /**
     * Open a dialog for the user to login.
     */
    showDialog(): void {
        const dialogRef = this.dialog.open(LoginDialogComponent, {});

        dialogRef.afterClosed().subscribe((result) => {
            this.user.login(result.email).subscribe((user) => {
                const { token } = user.data;
                delete user.data.token;

                this.user.user.next(user.data);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user.data));

            }, (error) => console.log(error));
        })
    }

    /**
     * Cambia la ruta actual a la indicada.
     * @param route
     */
    /* goto(route) {
        this.router.navigate([route]);
    } */
}

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form-dialog.html',
})
export class LoginDialogComponent {
    email: FormControl;

    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<LoginDialogComponent>,
    ) {
        this.email = new FormControl('', [
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(150),
        ]);

        this.form = new FormGroup({
            email: this.email,
        });
    }

    submit(): void {
        if (!this.form.valid) return;

        this.dialogRef.close(this.form.value);
    }

    getErrorMessage(): string {
        let error = '';

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

        return error;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
