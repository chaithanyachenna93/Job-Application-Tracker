import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JobService } from '../../job-table/job-table.service';
import { map } from 'rxjs';
import { Job } from '../../models/model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  stats: any = null;
  inProgress: number = 0;
  recentJobs: Job[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.fetchStats();
    this.fetchRecentJobs();
  }

  fetchStats() {
    this.jobService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        const totalKnown = (data.Applied || 0) + (data.offers || 0) + (data.rejected || 0);
        this.inProgress = data.total - totalKnown;
      },
      error: (err) => console.error('Error fetching stats:', err)
    });
  }

  fetchRecentJobs() {
    this.jobService.getJobs().pipe(
      map(jobs => jobs
        .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
        .slice(0, 3)
      )
    ).subscribe({
      next: (data) => this.recentJobs = data,
      error: (err) => console.error('Error fetching recent jobs:', err)
    });
  }
}

