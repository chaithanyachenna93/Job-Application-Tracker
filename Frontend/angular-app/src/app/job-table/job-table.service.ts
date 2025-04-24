import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = 'http://localhost:3000/api/jobs';
  private apiUrl1='http://localhost:3000/api'
private apiUrl2='http://localhost:3000/api/jobs/apply'
  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getJobById(id: number,): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  getJobByUserId(userId:any ): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${userId}`);
  }


  applyToJob(application: any): Observable<any> {
    return this.http.post<Job>(this.apiUrl2,application); // matches backend route
  }
  getUserApplications(userId: string) {
    return this.http.get<any[]>(`http://localhost:3000/api/user-applications/${userId}`);
  }

  addJob(job: Job): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  updateJob(id: number, updates: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, updates);
  }


  deleteJob(jobId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${jobId}`);
  }

  getStats(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl1}/stats`, {
      params: { userId }
    });
  }


  getJobApplications(jobId: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl1}/job-applications/${jobId}`);
  }

  // Update the application status
  // updateApplicationStatus(applicationId: number, body: { status: string }) {
  //   return this.http.put(`/api/job-applications/${applicationId}`, body);
  // }
  updateApplicationStatus(applicationId: number, body: { status: string }): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/job-applications/${applicationId}`,
      body
    );
  }
}

