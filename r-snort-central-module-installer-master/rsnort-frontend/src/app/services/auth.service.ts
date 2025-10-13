import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';

  constructor(private http: HttpClient) { }

  // login(email: string, password: string) {
  //   return this.http.post<{ token: string }>(`${this.API_URL}/login`, { email, password })
  //     .pipe(tap(response => {
  //       localStorage.setItem('token', response.token);
  //     }));
  // }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>('/api/auth/login', { email, password })
      .pipe(
        tap({
          next: response => {
            console.log('[AuthService] login OK:', response);
            localStorage.setItem('token', response.token);
          },
          error: err => {
            console.error('[AuthService] login ERROR:', err);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
