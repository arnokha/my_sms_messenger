import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';

  constructor() {}

  login(username: string, password: string): Observable<User> {
    // Mock login - always succeeds and uses username as token
    const user: User = {
      username,
      token: username
    };

    localStorage.setItem(this.AUTH_TOKEN_KEY, user.token);

    return of(user).pipe(delay(500));
  }

  signup(username: string, password: string): Observable<User> {
    // Mock signup - always succeeds and performs login action
    const user: User = {
      username,
      token: username
    };

    localStorage.setItem(this.AUTH_TOKEN_KEY, user.token);

    return of(user).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  }

  getCurrentUsername(): string | null {
    return this.getAuthToken(); // Token is the username in our mock system
  }
}