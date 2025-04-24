import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../job-table/job-table.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-jobs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-jobs.component.html',
  styleUrl: './add-jobs.component.scss'
})
export class AddJobsComponent {
  jobForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      companyName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobLocation: ['', Validators.required],
      jobType: ['', Validators.required],
      salary: [''],
      notes: ['']
      // We won't add createdBy, updatedBy, userId here if setting dynamically
    });
  }

  Cancel() {
    this.router.navigate(['recruiter']);
  }

  onSubmit() {
    if (this.jobForm.valid) {
      const recruiterId = localStorage.getItem('userId');

      const jobData = {
        ...this.jobForm.value,
        recruiterId: recruiterId, // assuming your backend expects this
        
      };

      this.jobService.addJob(jobData).subscribe(() => {
        this.router.navigate(['/recruiter']);
      });
    }
  }

}
