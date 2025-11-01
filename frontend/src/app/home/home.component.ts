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
  mockDelay = 2000

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.userService.isAuthenticated();

    if (this.isAuthenticated) {
      this.username = this.userService.getCurrentUsername();
      setTimeout(() => {
        this.router.navigate(['/messages']);
      }, this.mockDelay);
    } else {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, this.mockDelay);
    }
  }
}
