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
Cancel() {
this.router.navigate(['jobTable']);
}
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
      applicationDate: ['', Validators.required],
      salary: [''],
      notes: [''],
      status: ['Applied', Validators.required],
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.jobService.addJob(this.jobForm.value).subscribe(() => {
        this.router.navigate(['/jobTable']);
      });
    }
  }
}
