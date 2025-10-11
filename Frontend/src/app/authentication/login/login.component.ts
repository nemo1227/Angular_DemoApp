import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showLogin: boolean = true; // start with login form
  errorMessage: string | null = null;
  
  // LoginForm fields
  logUsername: string = '';
  logPassword: string = '';

  // RegisterForm fields
  regUsername: string = '';
  regEmail: string = '';
  regPassword: string = '';
  constructor(private loginService: LoginService, private router: Router) {}

  toggleForm(event: Event) 
{
    event.preventDefault(); // prevent page reload on link click
    this.showLogin = !this.showLogin;
  }
  onSignIn() 
  {
    this.loginService.login(this.logUsername, this.logPassword).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 401) {
          this.errorMessage = "❌ Incorrect username or password.";
        } 
        else if (error.status === 500) {
          this.errorMessage = "⚠️ Internal server error. Please try again later.";
        } 
        else {
          this.errorMessage = "❓ Server Not running.";
        }
      }
    });
  }
  onRegister()
  {
    if (!this.isPasswordValid(this.regPassword)) 
    {
      alert("❌ Password must be at least 15 characters OR at least 8 characters including a number and an uppercase letter.");
      return;
    }
    
    this.loginService.register(this.regUsername, this.regPassword, this.regEmail).subscribe({
      next: (response) => {
        alert("✅ Registration successful! You can now log in.");
        // Optionally, switch to login form after successful registration
        this.showLogin = true;
      },
      error: (error) => {
        console.error('Registration error:', error);
        alert("❌ Registration failed. Please try again.");
      }
    });
  }
  private isPasswordValid(password: string): boolean 
  {
    const longEnough = password.length >= 15;
    const strongEnough = password.length >= 8 &&
                         /[A-Z]/.test(password) &&
                         /\d/.test(password);
    return longEnough || strongEnough;
  }
}
