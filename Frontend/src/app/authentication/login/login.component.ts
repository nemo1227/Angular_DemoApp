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
  showRegister: boolean = false; // register form hidden
  errorMessage: string | null = null;
  
  // LoginForm fields
  logUsername: string = '';
  logPassword: string = '';

  // RegisterForm fields
  regUsername: string = '';
  regEmail: string = '';
  regPassword: string = '';

  // Forgot Password field
  showForgotPassword = false;
  forgotEmail = '';
  constructor(private loginService: LoginService, private router: Router) {}

  toggleForm(event: Event) 
  {
    event.preventDefault(); // prevent page reload on link click
    this.showLogin = !this.showLogin;
    this.showRegister = !this.showRegister;
    this.showForgotPassword = false;
  }
  toggleForgotPassword(event: Event) 
  {
    event.preventDefault(); // prevent page reload on link click
    this.showForgotPassword = true;
    this.showLogin = false;
    this.showRegister = false;
  }
  onSignIn() 
  {
    this.loginService.login(this.logUsername, this.logPassword).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 401) 
        {
          this.errorMessage = "❌ Incorrect username or password.";
        } 
        else if (error.status === 500) 
        {
          this.errorMessage = "⚠️ Internal server error. Please try again later.";
        } 
        else 
        {
          this.errorMessage = "❓ Unexpected error occurred.";
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
        this.showRegister = false;
      },
      error: (error) => {
        console.error('Registration error:', error);
        if(error.status === 400)
        {
          alert("User Already Exists with the corresponding Email address.");
        }
        else
        {
          alert("❌ Registration failed. Please try again.");
        }
      }
    });
  }

  onForgotPassword()
  {
    console.log('Sending reset link to', this.forgotEmail);
    this.loginService.forgotPassword(this.forgotEmail).subscribe({
      next: (response) => {
        alert("✅ If the email exists, a password reset link has been sent.");
        this.showForgotPassword = false;
        this.showLogin = true;
        this.showRegister = false;
        this.forgotEmail = '';
      },
      error: (error) => {
        console.error('Forgot Password error:', error);
        alert("❌ Failed to send password reset link. Please try again.");
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
