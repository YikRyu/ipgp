import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/http/authentication.service';
import { ToastService } from '../../services/services/toast.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/services/local-storage.service';
import { UserService } from '../../services/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public inputLoginForm = {
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  };
  public inputLoginFg: FormGroup = this.fb.group(this.inputLoginForm);
  public validateMessages = {
    email: [
      { type: 'required', message: 'Please provide email!' },
      { type: 'email', message: 'Please provide email with correct format!' },
    ],
    password: [{ type: 'required', message: 'Please provide password!' }],
  };

  public isLoggingIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private authService: AuthenticationService,
    private userService: UserService,
    public router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loginCheck();
  }

  //prevent user from accessing to login page if alraedy logged in
  private loginCheck(){
    let currentUser = this.localStorageService.getItem('current-user');
    if(JSON.parse(currentUser)){
      this.router.navigate(['/recognition-dashboard']);
    }
  }

  submitForm() {
    const emailField = this.inputLoginFg.get('email');
    const passwordField = this.inputLoginFg.get('password');
    if (emailField.value && emailField.valid && passwordField.value) {
      this.isLoggingIn = true;
      this.authService
        .login(emailField.value.trim(), passwordField.value.trim())
        .subscribe({
          next: (response) => {
            this.toastService.showSuccess(
              'Login successful! Redirecting to home page...'
            );
            this.localStorageService.setItem('current-user', JSON.stringify(response));
            setTimeout(()=>{
              this.userService.getUserType();
              this.isLoggingIn = false;
              this.toastService.clear();
              this.router.navigate(['/recognition-dashboard']);
            }, 1500);
          },
          error: (error) => {
            this.toastService.showError('Login failed. ' + error.error.message);
            this.isLoggingIn = false;
          },
        });
    }else{
      this.toastService.showError('Please provide all fields with value and with valid format!');
    }
  }
}
