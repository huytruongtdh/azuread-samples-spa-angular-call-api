import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <hr>
    <ul>
      <li><a routerLink="/">Home</a></li>
      
      @if(!loggedInUser) {
        <li><a routerLink="/auth/login">Login</a></li>
        <li><a routerLink="/auth/register">Register</a></li>
      }
      @else {
        <li><a routerLink="/user">Users</a></li>
        <li>Hello {{loggedInUser.email}}</li>
        <li><button (click)="logout()">Logout</button></li>
      }

    </ul>
    <hr>
    <router-outlet />
  `
})
export class AppComponent {
  loggedInUser: any;

  constructor(private authService: AuthService, private router: Router) {

    this.authService.currentUserSubject.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
