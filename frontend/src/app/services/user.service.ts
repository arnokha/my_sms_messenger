import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User, UserResponse, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';

  // Single source of truth for current logged-in user
  currentUser = signal<User | null>(null);

  // Backend endpoints
  private createUserUrl = environment.baseUrl + "api/v1/users";
  private createSessionUrl = environment.baseUrl + "api/v1/sessions";
  private deleteSessionUrl = environment.baseUrl + "api/v1/sessions/current";
  private meUrl = environment.baseUrl + "api/v1/me";

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(this.createSessionUrl, { username, password }).pipe(
      map(response => {
        return {
          id: response.user.id,
          username: response.user.username,
          token: response.token
        };
      }),
      tap(user => {
        localStorage.setItem(this.AUTH_TOKEN_KEY, user.token);
        this.currentUser.set(user);
      })
    );
  }

  signup(username: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(this.createUserUrl, {
      user: { username, password }
    }).pipe(
      map(response => {
        return {
          id: response.user.id,
          username: response.user.username,
          token: response.token
        };
      }),
      tap(user => {
        localStorage.setItem(this.AUTH_TOKEN_KEY, user.token);
        this.currentUser.set(user);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.delete<void>(this.deleteSessionUrl).pipe(
      tap(() => {
        localStorage.removeItem(this.AUTH_TOKEN_KEY);
        this.currentUser.set(null);
      })
    );
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  }

  getCurrentUsername(): string | null {
    return this.currentUser()?.username ?? null;
  }

  getMe(): Observable<User> {
    return this.http.get<UserResponse>(this.meUrl).pipe(
      map(response => {
        const token = this.getAuthToken();
        return {
          id: response.user.id,
          username: response.user.username,
          token: token || ''
        };
      }),
      tap(user => {
        this.currentUser.set(user);
      })
    );
  }
}