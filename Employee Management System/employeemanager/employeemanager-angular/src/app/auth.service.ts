import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://yourapilink/api/auth';

  constructor(private http: HttpClient) { }
  getEmployeeData(): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Get the token from local storage

    if (token) {
      // Set the Authorization header with Bearer token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      return this.http.get('/api/employee/all', { headers });
    } else {
      throw new Error('No JWT token found');
    }
  }
  login(credentials: { username: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
