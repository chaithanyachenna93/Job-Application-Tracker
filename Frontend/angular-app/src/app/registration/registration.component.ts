import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  registerForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient,private router:Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }
  formatDateForMySQL(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }


  onSubmit() {
    if (this.registerForm.invalid) return;

    const now = new Date();
    const formattedNow = this.formatDateForMySQL(now);

    const formData = {
      ...this.registerForm.value,
      createdAt: formattedNow,
      createdBy: 0,
      updatedAt: formattedNow,
      updatedBy: 0
    };

    this.http.post('http://localhost:3000/api/users', formData).subscribe({
      next: (res: any) => {
        this.message = 'Registration successful!';
        this.registerForm.reset();
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Registration failed. Try again.';
      }
    });
  }

}
