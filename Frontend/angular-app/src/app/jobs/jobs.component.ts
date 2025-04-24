import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JobService } from '../job-table/job-table.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent {
  searchText: string = '';
  jobs: any[] = [];
  filteredJobs: any[] = [];
  appliedJobIds: number[] = [];

  showApplyCard: boolean = false;
  selectedJob: any = null;
  applicationNotes: string = '';
  resumeLink: string = '';
  isLoading: boolean = false;

  constructor(
    private jobService: JobService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getJobs();
  }

  dashboard() {
    this.router.navigate(['user']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  getJobs() {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.filteredJobs = [...this.jobs];

        // Initialize applied job IDs from both server and localStorage
        const serverAppliedIds = this.jobs
          .filter(job => job.status === 'Applied')
          .map(job => job.id);

        const localAppliedIds = JSON.parse(localStorage.getItem('appliedJobIds') || '[]');

        // Combine and remove duplicates
        this.appliedJobIds = [...new Set([...serverAppliedIds, ...localAppliedIds])];

        console.log('Jobs loaded:', this.jobs);
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.snackBar.open('Failed to load jobs', 'Close', { duration: 3000 });
      }
    });
  }

  filterJobs(): void {
    if (!this.searchText) {
      this.filteredJobs = [...this.jobs];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      (job.companyName?.toLowerCase().includes(searchTerm) ||
      job.jobTitle?.toLowerCase().includes(searchTerm) ||
      job.jobLocation?.toLowerCase().includes(searchTerm)
    ));
  }

  openApplyCard(job: any): void {
    if (this.appliedJobIds.includes(job.id)) {
      this.snackBar.open('You have already applied to this job', 'Close', { duration: 3000 });
      return;
    }

    this.selectedJob = { ...job };
    this.showApplyCard = true;
    this.resumeLink = '';
    this.applicationNotes = '';
  }

  cancelApplication(): void {
    this.showApplyCard = false;
    this.resetForm();
  }

  submitApplication(): void {
    if (!this.resumeLink || !this.selectedJob) {
      this.snackBar.open('Please provide a resume link', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.snackBar.open('User not logged in', 'Close', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    const application = {
      jobId: this.selectedJob.id,
      userId: userId,
      resumeUrl: this.resumeLink,
      status: 'Applied',
      notes: this.applicationNotes,
      createdBy: userId
    };

    this.jobService.applyToJob(application).subscribe({
      next: (response) => {
        // Update local storage
        const appliedJobs = JSON.parse(localStorage.getItem('appliedJobIds') || '[]');
        appliedJobs.push(this.selectedJob.id);
        localStorage.setItem('appliedJobIds', JSON.stringify(appliedJobs));

        // Update the appliedJobIds array
        this.appliedJobIds.push(this.selectedJob.id);

        // Update job status in both arrays
        const updateStatus = (arr: any[]) => {
          const idx = arr.findIndex(j => j.id === this.selectedJob.id);
          if (idx !== -1) arr[idx].status = 'Applied';
        };
        updateStatus(this.jobs);
        updateStatus(this.filteredJobs);

        this.showApplyCard = false;
        this.resetForm();
        this.isLoading = false;

        this.snackBar.open('Application submitted successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error applying to job:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to submit application', 'Close', { duration: 3000 });
      }
    });
  }

  private resetForm(): void {
    this.applicationNotes = '';
    this.resumeLink = '';
    this.selectedJob = null;
  }

  isApplied(jobId: number): boolean {
    return this.appliedJobIds.includes(jobId);
  }
}
