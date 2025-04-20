import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) {
      this.loginForm = this.fb.group({
        phoneNumber: ['', [Validators.required]],
        password: ['', Validators.required],
      });
    }

    onSubmit() {
      if (this.loginForm.valid) {
        const { phoneNumber, password } = this.loginForm.value;
        this.authService.login(phoneNumber, password).subscribe({
          next: (res: any) => {
            console.log('Login Response:', res);  // Log the whole response
            if (res && res.token && res.userId) {  // <-- Fix here
              localStorage.setItem('token', res.token);
              localStorage.setItem('userId', res.userId);  // <-- And here
              console.log('Token:', localStorage.getItem('token'));
              console.log('User ID:', localStorage.getItem('userId'));
              this.router.navigate(['Dashboard']);
            } else {
              this.errorMessage = 'Invalid response from server.';
            }
          },
          error: (err) => {
            console.error('Login error:', err);
            this.errorMessage = 'Login failed. Please check your credentials.';
          }
        });
      }
    }

  }


