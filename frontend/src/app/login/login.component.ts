import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      return;
    }

    this.isLoading = true;

    this.userService.login(this.username, this.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/messages']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
      }
    });
  }
}
