import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.password || !this.confirmPassword) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.isLoading = true;

    this.userService.signup(this.username, this.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/messages']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Signup failed:', error);
      }
    });
  }
}
