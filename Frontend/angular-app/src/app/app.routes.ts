import { Routes } from '@angular/router';
import { JobTableComponent } from './job-table/job-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { AddJobsComponent } from './add-jobs/add-jobs.component';
import { LoginComponent } from './login/login.component';
import { EditJobsComponent } from './edit-jobs/edit-jobs.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {path:'',component:LoginComponent},
  {
    path: '',
    component: DashboardComponent,

    children: [
      { path: 'Dashboard', component: DashboardHomeComponent, canActivate: [AuthGuard] },
      { path: 'jobTable', component: JobTableComponent , canActivate: [AuthGuard]},
      { path: 'addJobs', component: AddJobsComponent, canActivate: [AuthGuard] },
      { path: 'edit/:id', component: EditJobsComponent, canActivate: [AuthGuard] },
    ]
  }

];

