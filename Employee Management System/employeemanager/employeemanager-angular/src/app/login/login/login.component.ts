import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        // Extract accessToken from the response and save it
        if (response.accessToken) {  
          this.authService.saveToken(response.accessToken);  
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Unexpected error. Please try again.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password.';
        console.error(err);
      }
    });
  }
}
