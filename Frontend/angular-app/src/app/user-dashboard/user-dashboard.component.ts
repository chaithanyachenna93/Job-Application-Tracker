import { Component, OnInit } from '@angular/core';
import { JobService } from '../job-table/job-table.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Stats {
  total: number;
  Applied: number;
  offers: number;
  rejected: number;
}

interface JobDisplay {
  jobId: number;
  companyName: string;
  jobTitle: string;
  status: string;
  applicationDate: string;
  ResumeUrl?: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  stats: Stats | null = null;
  allJobs: JobDisplay[] = [];
  showEditCard = false;
  isLoading = false;
  isJobLoading = false;

  editingJob: JobDisplay = {
    jobId: 0,
    companyName: '',
    jobTitle: '',
    status: '',
    applicationDate: '',
    ResumeUrl: ''
  };

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.fetchStats();
    this.fetchAllJobsByUser();
  }

  fetchStats(): void {
    const userId = localStorage.getItem('userId'); // or wherever you're storing it

    if (!userId) {
      console.error('User ID not found.');
      return;
    }

    this.jobService.getStats(userId).subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error fetching stats:', err)
    });
  }


  fetchAllJobsByUser(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.isJobLoading = true;
    this.jobService.getUserApplications(userId).subscribe({
      next: (data: JobDisplay[]) => {
        this.allJobs = data.sort((a, b) =>
          new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
        );
        this.isJobLoading = false;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.isJobLoading = false;
      }
    });
  }

  openEditCard(job: JobDisplay): void {
    this.editingJob = { ...job };
    this.showEditCard = true;
  }

  updateJob(): void {
    if (!this.editingJob.jobId || !this.editingJob.ResumeUrl) return;

    this.isLoading = true;

    this.jobService.updateJob(this.editingJob.jobId, {
      ResumeUrl: this.editingJob.ResumeUrl
    }).subscribe({
      next: () => {
        const index = this.allJobs.findIndex(j => j.jobId === this.editingJob.jobId);
        if (index !== -1) {
          this.allJobs[index] = { ...this.allJobs[index], ResumeUrl: this.editingJob.ResumeUrl };
        }
        this.isLoading = false;
        this.showEditCard = false;
      },
      error: (err) => {
        console.error('Error updating job:', err);
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.showEditCard = false;
  }

  deleteJob(jobId: number): void {
    if (!confirm('Are you sure you want to delete this application?')) return;

    this.isLoading = true;
    this.jobService.deleteJob(jobId).subscribe({
      next: () => {
        this.allJobs = this.allJobs.filter(job => job.jobId !== jobId);
        this.fetchStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error deleting job:', err);
        this.isLoading = false;
      }
    });
  }

  jobs(): void {
    this.router.navigate(['jobs']);
  }

  dashboard(): void {
    this.router.navigate(['user']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
