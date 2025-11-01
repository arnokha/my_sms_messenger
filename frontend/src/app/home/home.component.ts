import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  username: string | null = null;
  redirectDelay = 2000

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const hasToken = this.userService.isAuthenticated();

    if (hasToken) {
      // token exists, but need to load user data if not already loaded
      // call getMe() to populate user data, if token is invalid, redirect to login
      if (!this.userService.currentUser()) {
        this.userService.getMe().subscribe({
          next: (user) => {
            this.isAuthenticated = true;
            this.username = user.username;
            setTimeout(() => {
              this.router.navigate(['/messages']);
            }, this.redirectDelay);
          },
          error: (error) => {
            console.error('Failed to load user data:', error);
            this.isAuthenticated = false;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, this.redirectDelay);
          }
        });
      } else {
        // user data already loaded
        this.isAuthenticated = true;
        this.username = this.userService.getCurrentUsername();
        setTimeout(() => {
          this.router.navigate(['/messages']);
        }, this.redirectDelay);
      }
    } else {
      // no token, redirect to login
      this.isAuthenticated = false;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, this.redirectDelay);
    }
  }
}
