import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddJobsComponent } from '../add-jobs/add-jobs.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { JobService } from '../job-table/job-table.service';
import { Job } from '../models/model';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrl: './recruiter-dashboard.component.scss'
})
export class RecruiterDashboardComponent implements OnInit {
  jobs: Job[] = [];  // Job listings
  selectedUsers: {
    userLastName: string;
    userEmail: string;
    applicationStatus: string;
    applicationId: number;
  }[] = [];  // Users who applied

  validStatuses: string[] = ['Applied', 'Interviewed', 'Offered', 'Rejected'];

  constructor(
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  // Load recruiter's jobs
  loadJobs() {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.jobService.getJobByUserId(userId).subscribe(
        (data: any) => {
          this.jobs = data;
        },
        (error: any) => {
          console.error('Error fetching jobs:', error);
        }
      );
    } else {
      console.error('No userId found in localStorage');
    }
  }

  // View users who applied to a job
  showAppliedUsers(jobId: number) {
    console.log('Fetching users for jobId:', jobId);
    this.jobService.getJobApplications(jobId).subscribe(
      (users: any) => {
        console.log('Received users:', users);
        this.selectedUsers = users;
      },
      (error: any) => {
        console.error('Error fetching applied users:', error);
      }
    );
  }

  // Update user's application status
  updateStatus(user: any) {
    const body = { status: user.applicationStatus };
    this.jobService.updateApplicationStatus(user.applicationId, body).subscribe(
      (updatedApplication) => {
        console.log('Status updated:', updatedApplication);
        // Update the local state instead of refetching
        const index = this.selectedUsers.findIndex(u => u.applicationId === user.applicationId);
        if (index !== -1) {
          this.selectedUsers[index].applicationStatus = updatedApplication.status;
        }
      },
      (err) => {
        console.error('Error updating status:', err);
        // Revert the change if there's an error
        user.applicationStatus = this.selectedUsers.find(u => u.applicationId === user.applicationId)?.applicationStatus;
      }
    );
  }


  // Post a new job
  openPostJobDialog() {
    this.router.navigate(['/addJob']);
  }

  // Logout
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
