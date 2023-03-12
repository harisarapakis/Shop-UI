import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import ValidateForm from 'src/app/shared/helpers/validateForm';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordModalComponent } from './forgot-password-modal/forgot-password-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  type: string = 'password';
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).pipe(
        map(x => {
          this.auth.setToken(x.token);
          this.router.navigate(['employees'])}
        ),
        catchError(err => {
          return of(this.snackBar.open(err?.error.message, 'Dismiss', {
              duration: 3000
            }));
        })).subscribe();
    } else {
      ValidateForm.validateAllFormFiels(this.loginForm)
      this.snackBar.open('Your Form is Invalid', 'Dismiss', {
        duration: 3000
      });
    }
  }

  openForgetPasswordModal() {
    const dialogRef = this.dialog.open(ForgetPasswordModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
