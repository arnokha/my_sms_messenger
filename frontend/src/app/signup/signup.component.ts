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
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.password || !this.confirmPassword) {
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.signup(this.username, this.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/messages']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Signup failed:', error);
        // Backend returns { errors: ["error1", "error2"] }
        if (error.error?.errors && Array.isArray(error.error.errors)) {
          this.errorMessage = error.error.errors.join(', ');
        } else {
          this.errorMessage = 'Signup failed. Please try again.';
        }
      }
    });
  }
}
