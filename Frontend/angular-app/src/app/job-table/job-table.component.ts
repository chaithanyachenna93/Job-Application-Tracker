import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { JobService } from './job-table.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-job-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './job-table.component.html',
  styleUrls: ['./job-table.component.scss']
})
export class JobTableComponent {
  selectedStatus: string = '';
  searchText: string = '';
  allJobs: any[] = [];
  Jobs: any=[];

id: any;

  constructor(private jobService: JobService,private router:Router) {
    console.log('JobService injected:', this.jobService);
  }
  ngOnInit(): void {
    this.getJobs();
  }

  getJobs() {
    this.jobService.getJobs().subscribe(
      (data: any) => {
        this.Jobs = data;
        this.allJobs = data;
        console.log(data)
      },
      (err: any) => {
        console.log('error getting jobs', err);
      }
    );
  }

  addJob() {
    this.router.navigate(['/addJobs']);
  }


  filterJobs() {
    this.Jobs = this.allJobs.filter((job: any) => {
      const matchesText =
        this.searchText === '' ||
        job.companyName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        job.jobTitle?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        job.jobLocation?.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.selectedStatus === '' || job.status === this.selectedStatus;

      return matchesText && matchesStatus;
    });
  }

  deleteJob(id:number) {
    this.jobService.deleteJob(id).subscribe(
      () => {
        this.getJobs();

      },
      (error: any) => {
        console.error('Error deleting event', error);
      }
    );
  }
  editJob(){
    this.router.navigate(['/editJobs/:id']);
  }


}
