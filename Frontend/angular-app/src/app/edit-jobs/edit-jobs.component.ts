import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../job-table/job-table.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-jobs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-jobs.component.html',
  styleUrl: './edit-jobs.component.scss'
})
export class EditJobsComponent implements OnInit {
  jobForm: FormGroup;
  id!: number;


  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')); // get id from URL
    this.getJobById(this.id);
  }

  getJobById(id: number) {
    this.jobService.getJobById(id).subscribe(
      (data: any) => {
        this.jobForm.patchValue(data); // fill the form with existing job data
      },
      (err: any) => {
        console.error('Error fetching job by ID:', err);
      }
    );
  }


  onSubmit() {
    if (this.jobForm.valid) {
      this.jobService.updateJob(this.id, this.jobForm.value).subscribe(() => {
        this.router.navigate(['/jobTable']);
      });
    }
  }

  Cancel() {
    this.router.navigate(['/jobTable']);
  }
}
