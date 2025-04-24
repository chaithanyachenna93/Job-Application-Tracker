import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../job-table/job-table.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../models/model';

@Component({
  selector: 'app-edit-jobs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './edit-jobs.component.html',
  styleUrl: './edit-jobs.component.scss'
})
export class EditJobsComponent implements OnInit {
  jobForm: FormGroup;
  showApplyCard: boolean = false;
  selectedJob: Job | null = null;
  resumeLink: string = '';
  applicationNotes: string = '';
  isLoading: boolean = false;
  jobs: Job[] = [];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      companyName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      applicationDate: [''],
      status: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.isLoading = false;
      }
    });
  }

  openApplyCard(job: Job): void {
    this.selectedJob = { ...job };
    this.showApplyCard = true;
    this.resumeLink = job.ResumeUrl || '';
  }

  submitApplication(): void {
    if (!this.resumeLink || !this.selectedJob) return;

    this.isLoading = true;
    const updatedJob: Job = {
      ...this.selectedJob,
      status: 'Applied',
      ResumeUrl: this.resumeLink,
      notes: this.applicationNotes,
      applicationDate: new Date().toISOString()
    };

    this.jobService.updateJob(this.selectedJob.id, updatedJob).subscribe({
      next: () => {
        this.loadJobs();
        this.showApplyCard = false;
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error applying to job:', error);
        this.isLoading = false;
      }
    });
  }

  cancelApplication(): void {
    this.showApplyCard = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.applicationNotes = '';
    this.resumeLink = '';
    this.selectedJob = null;
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.isLoading = true;
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.loadJobs();
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          this.isLoading = false;
        }
      });
    }
  }

  editJob(jobId: number): void {
    this.router.navigate(['/edit-job', jobId]);
  }
}
