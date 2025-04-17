import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root' //makes this service available throughout the whole app
})
//this service class will manage employee-related HTTP operations
export class EmployeeService {
private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) { } //this is dependecy injection in the constructor, it injects HttpClient so we can make http requests
  private createHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  public getEmployees(): Observable<Employee[]> { //get request
    const headers = this.createHeaders(); 
    return this.http.get<Employee[]>(`${this.apiServerUrl}/employee/all`, { headers }); //call in http client and make it a get request, current return type is "any"
  }

  public addEmployee(employee: Employee): Observable<Employee> { //post 
    const headers = this.createHeaders(); 
    return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`, employee, { headers }); //passing payload in the body
  }

  public updateEmployee(employee: Employee): Observable<Employee> { //Put 
    const headers = this.createHeaders(); 
    return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`, employee, { headers }); //passing payload in the body
  }

  public deleteEmployee(employeeId: number): Observable<void> { //delete 
    const headers = this.createHeaders(); 
    return this.http.delete<void>(`${this.apiServerUrl}/employee/delete/${employeeId}`, { headers }); //passing payload in the body
  }
}
