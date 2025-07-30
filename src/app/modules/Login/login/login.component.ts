import {Component} from '@angular/core';
import {FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {FormConfigService} from '../../../core/services/form-config.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatIconButton,
    NgForOf,
    NgSwitchCase,
    NgSwitchDefault,
    NgSwitch,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  visibleField: boolean = false;
  loginForm: FormGroup;
  formConfig = [
    {
      name: 'username',
      type: 'text',
      label: 'user name',
      validator: [Validators.required, Validators.minLength(3)],
      formName: 'username'
    },
    {
      name: 'password',
      type: 'password',
      label: 'password',
      validator: [Validators.required, Validators.minLength(3)],
      formName: 'password'
    }
  ]

  constructor(
    protected fc: FormConfigService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.fc.formFields = this.formConfig;
    this.fc.createForm();
    this.loginForm = this.fc.formPost;
  }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.snackBar.open('Welcome', '', {
        duration: 3000,
        horizontalPosition: 'center',
      });
      this.router.navigate(['/tasks']);
    }
  }

  showpass() {
    this.visibleField = !this.visibleField;
  }

  onSubmit() {

    const {username, password} = this.loginForm.value;
    const success = this.authService.login(username, password);

    if (success) {
      this.snackBar.open('Welcome', '', {
        duration: 3000,
        horizontalPosition: 'center',
      });
      this.router.navigate(['/tasks']);
    } else {
      this.snackBar.open('Username or Password is Incorrect !', '', {
        duration: 3000,
        horizontalPosition: 'center',
      });
    }
  }
}
