import { Routes } from '@angular/router';
import { JobTableComponent } from './job-table/job-table.component';

import { AddJobsComponent } from './add-jobs/add-jobs.component';
import { LoginComponent } from './login/login.component';
import { EditJobsComponent } from './edit-jobs/edit-jobs.component';


import { RegistrationComponent } from './registration/registration.component';
import { RecruiterDashboardComponent } from './recruiter-dashboard/recruiter-dashboard.component';
import { Component } from '@angular/core';
import { ErrorComponent } from './error/error.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { JobsComponent } from './jobs/jobs.component';

export const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:"registration",component:RegistrationComponent},

  {path:"error",component:ErrorComponent},

      { path: 'user', component: UserDashboardComponent,  },
      { path: 'jobTable', component: JobTableComponent },

      { path: 'edit/:id', component: EditJobsComponent },
      {
        path: 'recruiter',
        component: RecruiterDashboardComponent,},

          { path: 'addJob', component:  AddJobsComponent },

          {path:'jobs',component:JobsComponent}
];

