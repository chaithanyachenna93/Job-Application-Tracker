import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']  // ← note the “s”
})
export class DashboardComponent {
constructor( private router:Router){}
  logout() {
    // Clear local storage/session, redirect to login, etc.
    console.log('Logging out...');
    // Example:
    localStorage.clear();
    this.router.navigate(['']);
  }

}

