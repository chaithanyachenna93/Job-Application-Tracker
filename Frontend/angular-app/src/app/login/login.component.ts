import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule

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
    register() {
      this.router.navigate(['/registration']);
    }

    onSubmit() {
      if (this.loginForm.valid) {
        const { phoneNumber, password } = this.loginForm.value;
        this.authService.login(phoneNumber, password).subscribe({
          next: (res: any) => {
            console.log('Login Response:', res);  // Log the response to check its structure

            if (res && res.token && res.userId && res.role) {
              // Store token, userId, and role in localStorage
              localStorage.setItem('token', res.token);
              localStorage.setItem('userId', res.userId);
              localStorage.setItem('role', res.role);  // Save the user role
              console.log('Token:', localStorage.getItem('token'));
              console.log('User ID:', localStorage.getItem('userId'));
              console.log('Role:', localStorage.getItem('role'));

              // Redirect to the appropriate dashboard based on the role
              if (res.role === 'Recruiter') {
                this.router.navigate(['recruiter']);  // Redirect to recruiter dashboard
              } else if (res.role === 'user') {
                this.router.navigate(['user']);  // Redirect to user dashboard
              } else {
                this.router.navigate(['error']);  // Default dashboard
              }
            } else {
              this.errorMessage = 'Invalid response from server.';
              console.error('Response does not contain the expected fields:', res);
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


